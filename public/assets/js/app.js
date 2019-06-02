//================ SCRAPE BUTTON ================

$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        $(location).attr("href","/");
    })
}); // ==> end scrape button

//================ SAVE ARTICLE BUTTON ================

$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        $(location).attr("href","/");
    })
}); // ==> end save article button

//================ DELETE ARTICLE BUTTON ================

$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        $(location).attr("href","/");
    })
});

//================ SAVE NOTE BUTTON ================

$(".saveNote").on("click", function() {
    event.preventDefault();
    var note = {};
    id = $(this).attr("data-id");
    note.body = $("#noteText").val().trim();
    console.log("noteTest");
    console.log("note: " + note.body);
    if (!$("#noteText").val()) {
        alert("Please enter a note to save your comment(s)!")
    } else {
        console.log("note id: " + id);
        $.post("/notes/save" + id, { body: note.body }).then(function(data) {
            $("noteText").val("");
            $(".modalNote").modal("hide");
            location.href = ("/saved"); //load "saved" page
        });
    }
}); // ==> end save note

//================ DELETE NOTE BUTTON ================

$(".deleteNote").on("click", function() {
    var noteId = $(this).attr("data-note-id");
     // console.log(articleId);
        $.ajax({
            method: "GET",
            url: "/notes/delete/" + noteId
        }).done(function(data) {
            $(".modalNote").modal("hide");
            $(location).attr("href","/saved");
        })
    }); // ==> end delete note