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
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//================ DB CONNECTION {heroku required} ================

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape";
//mongoose.Promise = Promise; not sure I need this
mongoose.connect(MONGODB_URI);

//================ ROUTES ================

//LOAD Page

//GET scrape website

//GET isSavedArticles

//POST save article

//GET delete article

//POST create note

//GET delete note

//================ SERVER STARTS ================

app.listen(PORT, function() {
    console.log("Scraper is running on port " + PORT + "!");
});