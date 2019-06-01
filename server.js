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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//make public a static folder
app.use(express.static("./public"));

//use handlebars in the app
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main",
      partialsDir: __dirname + '/views/partials/'
    })
  );
  app.set("view engine", "handlebars");

//================ DB CONNECTION {heroku required} ================

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape";
mongoose.connect(MONGODB_URI);

//================ ROUTES ================

//GET home route
app.get("/", function (req, res) {
    db.Article.find({ "saved": false }, function (error, data) {
      var home = {
        article: data
      };
      console.log(home);
      res.render("index", home);
    });
  });// ==> get home

//GET isSavedArticles
app.get("/saved", function (req, res) {
    db.Article.find({ "saved": true }).populate("note").exec(function (error, articles) {
      var isSaved = {
        article: articles
      };
      console.log(articles);
      res.render("saved", isSaved);
    });
  });

//GET scrape website
app.get("/scrape", function(req, res) {

    //axios request at the site
    axios.get("https://www.dailynorseman.com/").then(function(res) {
        
        //let cheerio handle the response
        var $ = cheerio.load(res.data);

        //class that contains articles
        $("l-hero").each(function (i, element) {

            //empty result object
            var result = {};

            //get the data 
            result.title = $(element).find("h2").text().trim();
            //result.link = $(element).find("a").attr("href");
            //result.summary = $(element).find("p").text().trim();
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                // If an error occurred, send it to the client
                    return res.json(err);
                });
            }); // --> end article iterations

            //success message
            //res.send("Scrape Complete!");

    });// ==>end axios.get
}); // ==> end GET scrape

//POST save article

//GET remove from saved

//POST create note

//GET delete note

//================ SERVER STARTS ================

app.listen(PORT, function() {
    console.log("Scraper is running on port " + PORT + "!");
});