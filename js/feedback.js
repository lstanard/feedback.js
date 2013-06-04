/* ------------------------------------------------

	REFERENCE: 
	----------
	* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
	* http://stackoverflow.com/questions/6276175/adding-methods-to-custom-objects-in-javascript 

	http://stackoverflow.com/questions/572897/how-does-javascript-prototype-work

	https://github.com/rwldrn/idiomatic.js/
	http://stackoverflow.com/questions/3913103/javascript-object-literal-pattern-with-multiple-instances 
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function

	http://stackoverflow.com/questions/310870/use-of-prototype-vs-this-in-javascript
	http://stackoverflow.com/questions/13190097/whats-the-best-way-to-create-javascript-classes?lq=1

   --------------------------------------------- */

/* ------------------------------------------------

	TO DO:

	- Give comments an absolute position on the page
	- Ability to create a new sticky by clicking on the page and capturing the mouse position on click
	- Ability to write multi-line comments (currently outputs 1 string)
	- Validate that form fields are not empty 

   --------------------------------------------- */

/*function init() {
	feedback();
}*/

function feedback() {

	function init() {

		bind_click_to_body();
		assign_handlers();

	}

/*  -----------------------------
	DECLARE VARIABLES 
	-------------------------- */
   
	// Create global variables
	var i = 0,
	    mouse_pos_x,
	    mouse_pos_y,
	    new_comment_open = false;

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

/*  -----------------------------
	SETUP FUNCTIONS    
	-------------------------- */

	// Loop through all comments on page load and add them to the comments object 
	$all_comments.each(function(){
		methods.create_comment_obj($(this).find('.comment-copy').text(),$(this).find('.comment-author').text(),false);
		$(this).attr('data-comment-index',i);
	});

/*  -----------------------------
	HELPER FUNCTIONS    
	-------------------------- */


/*  -----------------------------
	EVENT HANDLERS   
	-------------------------- */

	$('#add-comment-btn').click(function(event){

		// Get new comment values
		var new_comment_author = $('#add-comment-author').val();
		var new_comment_copy = $('#add-comment-copy').val();

		// Create new comment object
		if (new_comment_author !== '' && new_comment_copy !== '') 
			methods.create_comment_obj(new_comment_copy,new_comment_author,true);
		else 
			alert("Please fill out fields");

		// Clear form fields
		$('#add-comment-author, #add-comment-copy').val('');

		event.preventDefault();

	});

	function bind_click_to_body(){
		$('body').bind('click', function(e){
			mouse_pos_x = e.pageX;
			mouse_pos_y = e.pageY;
			if (new_comment_open === false)
				methods.open_new_comment_dialog(mouse_pos_x, mouse_pos_y);
		});
	}

	$('.add-comment-close').bind('click', function(){
		methods.close_new_comment_dialog();
	});

	function assign_handlers() { 

		$('.comment').on('click', 'a.comment-delete', function(event){

			methods.remove_comment_obj($(this).parent());
			methods.remove_comment_elem($(this).parent());

			event.preventDefault();
			event.stopPropagation();

		});

	}

/*  -----------------------------
	"PUBLIC" METHODS (NOT AVAILABLE OUTSIDE OF FEEDBACK())
	-------------------------- */

	this.methods = {

		create_comment_obj: function(copy, author, create_new_comment) {

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

		},

		add_comment_obj: function(comment_object) {
			
			comments[i] = comment_object;
		
		},

		remove_comment_elem: function(comment_object) {
			
			comment_object.remove();

		},

		add_comment_elem: function(comment_object) {

			// Create new jQuery element
			$new_comment_elem = $('<article class="comment"></article>');
			$new_comment_elem.append('<p class="comment-copy">' + comment_object.contents.comment_copy + '</p>');
			$new_comment_elem.append('<footer class="comment-footer"><p>Comment left by: <span class="comment-author">' + comment_object.contents.comment_author + '</span></p></footer>');
			$new_comment_elem.append('<a href="#" class="comment-delete">Delete comment</a>');
			$new_comment_elem.attr('data-comment-index',i);

			// Add new element to the page 
			$('.comments-wrapper').append($new_comment_elem);

			// Assign dynamically created comment required event handler(s)
			assign_handlers();

			// Close the new comment popup (THIS NEEDS TO GO INTO A SEPARATE FUNCTION)
			methods.close_new_comment_dialog();

		},

		remove_comment_obj: function(comment_object) {

			var comment_num = comment_object.attr('data-comment-index') - 1;
			delete comments[comment_num];

		}, 

		close_new_comment_dialog: function() {

			new_comment_open = false;
			$('.add-comment-form').css({"display": "none"});
			event.stopPropagation();

		}, 

		open_new_comment_dialog: function(pos_x, pos_y) {

			new_comment_open = true;
			$('.add-comment-form').css({
				"left": pos_x,
				"top": pos_y,
				"display": "block"
			});

		}

	}

	// Get things started
	init();

}

$(document).ready(function(){
	feedback();
});