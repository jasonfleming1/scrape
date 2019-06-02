//================ REQUIRE PACKAGES ================

//basic dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//front-end requirement
var exphbs = require("express-handlebars");

//================ INITIALIZATION + MIDDLEWARE ================

//require all models
var db = require("./models");
console.log(db);

//assign the port {heroku required}
var PORT = process.env.PORT || 3000;

//initialize Express
var app = express();

//use morgan logger for logging requests
app.use(logger("dev"));

//parse request body as JSON
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

//make public a static folder
app.use(express.static("./public"));

//use handlebars in the app
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: __dirname + '/views/layouts/partials'
  })
);
app.set("view engine", "handlebars");

//================ DB CONNECTION {heroku required} ================

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/stribscraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//================ ARTICLE ROUTES ================

//GET home page without results like the demo
app.get("/", function (req, res) {
  console.log(req);
  console.log(req)
  res.render("index");
});// ==> get home revised

//GET scraped
app.get("/scraped", function(req, res) {
  db.Article.find(
    {
      saved: false
    },
    function(err, data) {
      if (err) {
        console.log("No items here because: " + err);
      } else {
        console.log(data);
        res.render("index", {
          article: data
        });
      }
    }
  );
}); // ==> get scraped complete

//GET isSavedArticles revised
app.get("/saved", function(req, res) {
  db.Article.find(
    {
      saved: true
    },
    function(err, data) {
      if (err) {
        console.log("No saved items here because: " + err);
      } else {
        console.log(data);
        res.render("saved", {
          article: data
        });
      }
    }
  );
}); // ==> get isSaved revised

//GET scrape website
app.get("/scrape", function(req, res) {
  //axios request at the site
  axios.get("http://www.startribune.com/local/").then(function(response) {
    //let cheerio handle the response
    var $ = cheerio.load(response.data);
    console.log($)
    //class that contains articles
    $("div.tease-container-right").each(function(i, element) {
      //empty result object
      var result = {};

      result.title = $(this)
      .find("a.tease-headline")
      .text()
      .trim();
      result.link = $(this)
        .find("a.tease-headline")
        .attr("href");
      result.summary = $(this)
        .find("div.tease-summary")
        .text()
        .trim();

        //console.log(result);
        db.Article.create(result)
        .then(function (dbArticle) {
          //console.log(dbArticle);
          res.send("Scrape Complete!");
        })
        .catch(function (err) {
          console.log(err)
          return res.json(err);
        });
    });
  });
});// ==> end GET scrape

//POST save article
app.post("/articles/save/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      saved: true
    }
  )
    .then(function(result) {
      console.log("isSaved now");
      res.json(result);
    })
    .catch(function(err) {
      res.json(err);
      console.log("Item not saved because: " + err);
    });
}); // ==> end post save articles

// POST remove from saved list
app.post("/articles/delete/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
    .then(function (response) {
      res.json(response);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
}); // ==> end post remove from saveed list

//GET clear from scraped list
app.get("/clear", function(req, res) {
  db.Article.deleteMany({ saved: false })
    .then(function(result) {
      console.log("Item(s) removed!");
      //console.log(result);
    })
    .catch(function(err) {
      res.json(err);
      console.log("Item not removed because: " + err);
    });
    res.redirect("/");
}); // ==> end clear from scraped list

//================ NOTE ROUTES ================

// POST add a note
app.post("/notes/save/:id", function (req, res) {
  console.log("body: " + req.body)
  console.log("Id: " + req.params.id)
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbnote) {
      res.json(dbnote);
    })
    .catch(function (err) {
      res.json(err);
    });
}); // ==> end post add a note (not working on ui)

// GET delete a note
app.get("/notes/delete/:id", function (req, res) {
  // Use the note id to find and delete it
  db.Note.findOneAndRemove({ "_id": req.params.id }).then(function (response) {
    res.redirect("/saved")
  }).catch(function (err) {
    res.json(err)
  });
}); // ==> end get delete a note (not working 404)


//================ SERVER STARTS ================

app.listen(PORT, function() {
  console.log("Any port in a storm: " + "localhost:" + PORT);
});