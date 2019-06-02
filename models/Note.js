//NOTE MODEL

//================ REQUIRE PACKAGES ================

var mongoose = require("mongoose");

//================ CONSTRUCTOR REFERNECE ================

var Schema = mongoose.Schema;

//================ SCHEMA ================

var NoteSchema = new Schema({
    title: String,
    body: String,   
}); // ==> end Schema

//================ CREATE MODEL ================

var Note = mongoose.model("Note", NoteSchema);

//================ EXPORT SCHEMA ================

module.exports = Note;