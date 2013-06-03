var init = function() {
	
	// Create global variables
	var i = 0;
	// Object that contains all individual comments
	var comments = {};

	// Utility functions 
	var create_comment_obj = function(comment_object) {
		var comment_copy = comment_object.find('.comment-copy').text();
		var comment_author = comment_object.find('.comment-author').text();
		var new_comment = new comment();
		new_comment.contents.comment_author = comment_author;
		new_comment.contents.comment_copy = comment_copy;
		comments[i] = new_comment;
		i++;
	}
	
	// Setup object for each individual comment
	var comment = function () {
		this.contents = {
			comment_author: "",
			comment_copy: ""
		}
	}
		
	// Loop through all comments, parse the parts, create a new comment object and add to the comments object 
	var all_comments = $(".comment");
	all_comments.each(function(){
		create_comment_obj($(this));
	});

	// Event handlers
	$('#add-comment-btn').click(function(event){
		var new_comment_author = $('#add-comment-author').val();
		var new_comment_copy = $('#add-comment-copy').val();
		
		event.preventDefault();
	});

	$('.comment').delegate(".comment-delete", "click",  function(){
		event.preventDefault();
	});

	console.log(comments);

}

$(document).ready(function(){

	/* 

		REFERENCE: 
		----------
		https://github.com/rwldrn/idiomatic.js/#comments 
		http://stackoverflow.com/questions/3913103/javascript-object-literal-pattern-with-multiple-instances 

	*/ 

	init();
	
});