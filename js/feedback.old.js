function feedback() {
   
	// Create global variables
	/*var i = 0,
	    mouse_pos_x,
	    mouse_pos_y,*/

		// Global status object 
	    /*status = {
			newCommentOpen: false,
			new_comment_pos_x: 0,
			new_comment_pos_y: 0
		},*/

		// Array that contains all individual comments
	    /*comments = [];*/

	// Comment object constructor 
	/*function comment(index, copy, author) {
		this.index = index;
		this.position_x = 0;
		this.position_y = 0;
		this.contents = {
			author: author,
			copy: copy,
			timestamp: new Date()
		}
	}*/


	// OPEN/CLOSE CREATE NEW COMMENT DIALOG BOX

	$('#js-create-comment-btn').bind('click', function(){
		bindCreateCommentBox();
		event.stopPropagation();
	});

	$('#js-add-comment-close').bind('click', function(){
		methods.closeNewCommentDialog();
		event.stopPropagation();
	});

	function bindCreateCommentBox() {
		$('body').bind('click', function(e){
			mouse_pos_x = e.pageX;
			mouse_pos_y = e.pageY;
			if (status.newCommentOpen === false)
				methods.openNewCommentDialog(mouse_pos_x, mouse_pos_y);
		});
	}

	function unbindCreateCommentBox() {
		$('body').unbind('click');
	}

	// CREATE NEW COMMENT DIALOG BOX EVENTS

	$('#js-add-comment-btn').bind('click', function(event){
		// Get new comment values
		var newCommentAuthor = $('#js-add-comment-author').val();
		var newCommentCopy = $('#js-add-comment-copy').val();
		// Create new comment object if form fields are not empty 
		if (newCommentAuthor !== '' && newCommentCopy !== '') 
			methods.createNewCommentInstance(newCommentCopy, newCommentAuthor);
		else 
			alert("Please fill out all form fields.");
		// Clear form fields
		$('#js-add-comment-author, #js-add-comment-copy').val('');
		// Stop default link behavior 
		event.preventDefault();
	});

	function enableDeleteComment() {
		$('.comment').on('click', 'a.comment-delete', function(event){
			methods.deleteCommentElement($(this).parent());
			// Stop default link behavior and event propagation
			event.preventDefault();
			event.stopPropagation();
		});
	}


	// COMMENT ACTIONS 

	this.methods = {

		createNewCommentInstance: function(newCommentCopy, newCommentAuthor) {
			// Create a new instance of the comment object 
			var newComment = new comment(i, newCommentCopy, newCommentAuthor);
			    newComment.position_x = status.new_comment_pos_x;
			    newComment.position_y = status.new_comment_pos_y;
			// Increment comment counter 
			i++;
			// Call function to add new comment instance to the page 
			methods.addCommentElement(newComment);
		},

		addCommentElement: function(newComment) {
			// Add new comment to the comments object
			// Should the array be mapped? 
			comments[i] = newComment;
			// Or a regular array? 
			// comments.push(newComment);
			// Create new jQuery element
			$newCommentElement = $('<article class="comment"></article>');
			$newCommentElement.append('<p class="comment-copy">' + newComment.contents.copy + '</p>');
			$newCommentElement.append('<footer class="comment-footer"><p>Comment left by: <span class="comment-author">' + newComment.contents.author + '</span> on <span class="comment-timestamp">' + newComment.contents.timestamp + '</span></p></footer>');
			$newCommentElement.append('<a href="#" class="comment-delete">Delete comment</a>');
			$newCommentElement.attr('data-comment-index', newComment.index);
			$newCommentElement.css({
				'position': 'absolute',
				'top': newComment.position_y,
				'left': newComment.position_x
			});
			// Add new element to the page 
			$('#js-comments-wrapper').append($newCommentElement);
			// Assign dynamically created comment required event handler(s)
			enableDeleteComment();
			// Close the new comment popup 
			methods.closeNewCommentDialog();

			console.log(comments);
		},

		deleteCommentElement: function(comment_object) {
			// Remove selected comment from the comments object
			var commentIndex = comment_object.attr('data-comment-index') + 1;
			console.log(commentIndex);
			delete comments[commentIndex];
			// Remove selected comment from the page 
			comment_object.remove();

			console.log(comments);
		},

		closeNewCommentDialog: function() {
			unbindCreateCommentBox();
			status.newCommentOpen = false;
			$('.add-comment-form').css({"display": "none"});
		}, 

		openNewCommentDialog: function(pos_x, pos_y) {
			status.newCommentOpen = true;
			$('#js-add-comment-form').css({
				"left": pos_x,
				"top": pos_y,
				"display": "block"
			});
			status.new_comment_pos_x = pos_x;
			status.new_comment_pos_y = pos_y;
		}

	}

}