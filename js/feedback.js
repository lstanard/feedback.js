$(document).ready(function(){

	// Object that contains all individual comments
	var comments = {};
	
	// Object for each individual comment
	var comment = {};
	
	    comment.contents = {
	    	comment_author: "",
	    	comment_copy: ""
	    }
	
	// Retrieve all comments
	var all_comments = $(".comment"),
	    i = 0;
	
	all_comments.each(function(){
		
		var comment_copy = $(this).find('.comment-copy');
		var comment_author = $(this).find('.comment-author');
		
		comment.contents[comment_copy] = comment_copy;
		comment.contents[comment_author] = comment_author;
		
		comments[i] = comment.contents;
		
		i++;
		
	});
	
	console.log(comments);
	
});