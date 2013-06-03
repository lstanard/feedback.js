/* ------------------------------------------------

	TO DO:

	- Give comments an absolute position on the page
	- Ability to create a new stick by clicking on the page and capturing the mouse position on click
	- Should be able to click "Delete comment"

   --------------------------------------------- */

function init() {
	
	// Create global variables
	var i = 0;
	// Collect all current comments on page load
	var $all_comments = $(".comment");
	// Setup object that contains all individual comments
	var comments = {};
	// Setup object for each individual comment
	var comment = function () {
		this.config = {
			index: 0,
			position_x: 0,
			position_y: 0
		}
		this.contents = {
			comment_author: "",
			comment_copy: ""
		}
	}

	this.methods = {

		create_comment_obj: function(copy, author, create_new_comment) {
			// Function to create a new comment object 
			var comment_copy = copy;
			var comment_author = author;
			// Create a new instance of the comment object 
			var new_comment = new comment();
			// Add contents to the newly created comment object 
			new_comment.contents.comment_author = comment_author;
			new_comment.contents.comment_copy = comment_copy;
			new_comment.config.index = i;
			methods.add_comment_obj(new_comment);
			// Increment comment counter 
			i++;
			// If the comment does not already exist on the page, call function to create the DOM element and add it
			if (create_new_comment === true) 
				methods.add_comment_elem(new_comment);
			console.log(comments);
		},

		add_comment_obj: function(comment_object) {
			// Function to add a comment to the comments object 
			comments[i] = comment_object;
		},

		remove_comment_elem: function(comment_object) {
			// Function to remove a comment from the DOM
			comment_object.remove();
		},

		add_comment_elem: function(comment_object) {
			// Function to add a comment to the DOM and append to page
			$new_comment_elem = $('<article class="comment"></article>');
			$new_comment_elem.append('<p class="comment-copy">' + comment_object.contents.comment_copy + '</p>');
			$new_comment_elem.append('<footer class="comment-footer"><p>Comment left by: <span class="comment-author">' + comment_object.contents.comment_author + '</span></p></footer>');
			$new_comment_elem.append('<a href="#" class="comment-delete">Delete comment</a>');
			$new_comment_elem.attr('data-comment-index',i);
			$('.comments-wrapper').append($new_comment_elem);
		},

		remove_comment_obj: function(comment_object) {
			// Function to remove a comment from the comments object 
			var comment_num = comment_object.attr('data-comment-index') - 1;
			delete comments[comment_num];
			console.log(comments);
		}

	}

	// Loop through all comments on page load and add them to the comments object 
	$all_comments.each(function(){
		methods.create_comment_obj($(this).find('.comment-copy').text(),$(this).find('.comment-author').text(),false);
		$(this).attr('data-comment-index',i);
	});

	// Capture mouse position 
	$(document).mousemove(function(e){
		// console.log(e.pageX +', '+ e.pageY);
	}); 

	// Event handlers
	$('#add-comment-btn').click(function(event){
		// Get new comment values
		var new_comment_author = $('#add-comment-author').val();
		var new_comment_copy = $('#add-comment-copy').val();
		// Create new comment object 
		methods.create_comment_obj(new_comment_copy,new_comment_author,true);
		// Clear form fields
		$('#add-comment-author, #add-comment-copy').val('');
		event.preventDefault();
	});

	$('.comment').on('click', 'a.comment-delete', function(event){
		methods.remove_comment_obj($(this).parent());
		methods.remove_comment_elem($(this).parent());
		event.preventDefault();
	});

}

$(document).ready(function(){

	/* 

		REFERENCE: 
		----------
		https://github.com/rwldrn/idiomatic.js/
		http://stackoverflow.com/questions/3913103/javascript-object-literal-pattern-with-multiple-instances 
		https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function

	*/ 

	init();

});