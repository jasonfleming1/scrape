//App

//================ SCRAPE ================

//Scrap Nav element
$("#scrapeNav").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
    console.log(data);
    $(location).attr("href", "/scraped");
  });
});

//Scrap button element
$("#scrapeBtn").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
    console.log(data);
    $(location).attr("href", "/scraped");
  });
});

//================ ARTICLE ACTIONS ================

//Save Article button
$(".save").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/articles/save/" + thisId
  }).done(function(data) {
    //$(location).attr("href", "/scraped");
  });
});

//Remove from Saved
$(".delete").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/articles/delete/" + thisId
  }).done(function(data) {
    $(location).attr("href", "/saved");
  });
});

//================ NOTE ACTIONS ================

//Save Note button
$(".saveNote").on("click", function(event) {
  event.preventDefault();
  var note = {};
  id = $(this).attr("data-id");
  note.body = $("#noteText")
    .val()
    .trim();
  console.log("noteText");
  // note.body =$("data-noteid").val().trim();
  console.log("note:" + note.body);
  if (!$("#noteText").val()) {
    alert("please enter a note to save");
  } else {
    console.log("note id: " + id);
    $.post("/notes/save/" + id, { body: note.body }).then(function(data) {
      // Log the response
      console.log(data);
      //   clear note box
      $("#noteText").val("");
      $(".modalNote").modal("hide");
      $(location).attr("href", "/saved");
    });
  }
});

//Delete Note button
$(".deleteNote").on("click", function() {
  //   var articleId = $(this).attr("data-id");
  var noteId = $(this).attr("data-note-id");
  // console.log(articleId);
  $.ajax({
    method: "GET",
    url: "/notes/delete/" + noteId
  }).done(function(data) {
    $(".modalNote").modal("hide");
    $(location).attr("href", "/saved");
  });
});

//================ NEW NOTE TRY ================

//get a note
$("#note-modal").on("click", function() {
  $("#noteText").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles" + thisId
  }).then(function(data) {
    console.log(data);
    $("#noteText").append("<textarea id='noteText' name='body'></textarea>");
    $(".saveNotes").append(
      "<button data-id=" + data._id + " id='saveNote'>Save Note</button>"
    );
    // If there's a note in the article
    if (data.note) {
      // Place the body of the note in the body textarea
      $("#previousNotes").val(data.note.body);
    }
  });
});
