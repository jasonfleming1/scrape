//================ REQUIRE PACKAGES ================

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cherrio = require("cheerio"); 
const app = express();

//================ MODELS + INITIALIZATION ================

const db =  require("./models");


//================ HEROKU DEPLOYMENT ================

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape";
mongoose.connect(MONGODB_URI);

//================ MIDDLEWARE ================

//use morgan logger for logging requests
app.use(logger("dev"));

//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//make public a static folder
app.use(express.static("./public"));

//================ SERVER STARTS ================

app.listen(PORT, function() {
    console.log("Scraper is running on port " + PORT + " »");
});
