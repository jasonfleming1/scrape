//ARTCLE MODEL

//================ REQUIRE PACKAGES ================

var mongoose = require("mongoose");

//================ CONSTRUCTOR ================

var Schema = mongoose.Schema;

//================ SCHEMA ================

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    summary: {
        type: String, 
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	},
}); // ==> end Schema

//================ CREATE MODEL ================

var Article = mongoose.model("Article", ArticleSchema);

//================ EXPORT SCHEMA ================

module.exports = Article;