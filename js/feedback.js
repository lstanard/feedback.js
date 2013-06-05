	/* ------------------------------------------------

		TO DO:
		------
		- Ability to write multi-line comments (currently outputs 1 string)
		- Format date string to be more concise
		- New comment positioning is off 
		- Reduce unnecessary repetition in comment property variables 
		- Use object constructor method (http://jsfiddle.net/louisstanard/K2Vrk/)

	--------------------------------------------- */


function feedback() {

	function init() {

		// Any initilizing function calls here

	}

/*  -----------------------------
	DECLARE VARIABLES 
	-------------------------- */
   
	// Create global variables
	var i = 0,
	    mouse_pos_x,
	    mouse_pos_y

	// Global settings object 
	var status = {
		new_comment_open: false,
		new_comment_pos_x: 0,
		new_comment_pos_y: 0
	}

	// Setup object that contains all individual comments
	var comments = {};

	// Comment object constructor 
	function comment(author, copy) {
		this.config = {
			index: index,
			timestamp: new Date(),
			position_x: 0,
			position_y: 0
		}
		this.contents = {
			author: author,
			copy: copy
		}
	}

/*  -----------------------------
	HELPER FUNCTIONS    
	-------------------------- */


/*  -----------------------------
	EVENT HANDLERS 

	!!! This whole section needs cleaned up !!! 

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

	function bind_click_to_body() {
		$('body').bind('click', function(e){
			mouse_pos_x = e.pageX;
			mouse_pos_y = e.pageY;
			if (status.new_comment_open === false)
				methods.open_new_comment_dialog(mouse_pos_x, mouse_pos_y);
				status.new_comment_pos_x = mouse_pos_x;
				status.new_comment_pos_y = mouse_pos_y;
		});
	}

	function unbind_click_to_body() {
		
		$('body').unbind('click');
	}


	$('.add-comment-close').bind('click', function(){
		
		methods.close_new_comment_dialog();

	});

	$('#create-comment-btn').bind('click', function(){

		bind_click_to_body();
		event.stopPropagation();

	});

	function dynamic_handlers() { 

		$('.comment').on('click', 'a.comment-delete', function(event){

			methods.remove_comment_elem($(this).parent());

			event.preventDefault();
			event.stopPropagation();

		});

	}

/*  -----------------------------
	METHODS (NOT AVAILABLE OUTSIDE OF FEEDBACK())
	-------------------------- */

	this.methods = {

		create_comment_obj: function(copy, author) {

			// Create a new instance of the comment object 
			var new_comment = new comment(author, copy);

			//var comment_timestamp = new Date();
			//var comment_copy = copy;
			//var comment_author = author;

			// Add contents to the newly created comment object 
			//new_comment.config.index = i;
			//new_comment.config.timestamp = comment_timestamp;
			new_comment.config.position_x = status.new_comment_pos_x;
			new_comment.config.position_y = status.new_comment_pos_y;
			//new_comment.contents.author = comment_author;
			//new_comment.contents.copy = comment_copy;			

			// Increment comment counter 
			i++;

			methods.add_comment_elem(new_comment);

		},

		remove_comment_elem: function(comment_object) {
			
			// Remove selected comment from the comments object
			var comment_num = comment_object.attr('data-comment-index') - 1;
			delete comments[comment_num];

			// Remove selected comment from the page 
			comment_object.remove();

		},

		add_comment_elem: function(comment_object) {

			// Add new comment to the comments object
			comments[i] = comment_object;

			// Create new jQuery element
			$new_comment_elem = $('<article class="comment"></article>');
			$new_comment_elem.append('<p class="comment-copy">' + comment_object.contents.copy + '</p>');
			$new_comment_elem.append('<footer class="comment-footer"><p>Comment left by: <span class="comment-author">' + comment_object.contents.author + '</span> on <span class="comment-timestamp">' + comment_object.config.timestamp + '</span></p></footer>');
			$new_comment_elem.append('<a href="#" class="comment-delete">Delete comment</a>');
			$new_comment_elem.attr('data-comment-index',i);
			$new_comment_elem.css({
				"position": "absolute",
				"top": comment_object.config.position_y,
				"left": comment_object.config.position_x
			});

			// Add new element to the page 
			$('.comments-wrapper').append($new_comment_elem);

			// Assign dynamically created comment required event handler(s)
			dynamic_handlers();

			// Close the new comment popup 
			methods.close_new_comment_dialog();

		},

		close_new_comment_dialog: function() {

			unbind_click_to_body();
			status.new_comment_open = false;
			$('.add-comment-form').css({"display": "none"});
			event.stopPropagation();

		}, 

		open_new_comment_dialog: function(pos_x, pos_y) {

			status.new_comment_open = true;
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