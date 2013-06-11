/**
*	
*	TO DO: FUNCTIONALITY 
*	--------------------
*	- Ability to create a reply chain, will reuse most of the same functions 
*	- Create a new function to extract form data to be re-used with new comments and replies 
*	- Separate markup from functionality 
*	- Ability to edit a comment 
*	- Multi-line comments 
*	- Timestamp could be formatted better 
*	
*	TO DO: UI 
*	---------
*	- Add marker to specify location of comments
*	
*	ISSUES: 
*	-------
*	- Should comments have a stacking order?
*
**/ 

(function(window, $, FeedbackWidget) {

	var i = 0,
		mousePosX,
		mousePosY,

		/**
		*
		*	Private settings object  
		*	-----------------------
		*
		**/

		settings = {
			// Define UI elements 
			$commentWrapper: $('#js-comments-wrapper'),
			$createNewCommentBtn: $('#js-create-comment-btn'),
			$addNewCommentForm: $('#js-add-comment-form'),
			$addNewCommentClose: $('#js-add-comment-close'),
			$addNewCommentBtn: $('#js-add-comment-btn'),
			$toggleCommentsBtn: $('#js-toggle-comments-btn'),
			// Probably shouldn't use an ID on these
			addNewCommentInputAuthor: $('#js-add-comment-author'),
			addNewCommentInputCopy: $('#js-add-comment-copy'),
			commentClass: 'comment',

			// Status object 
			status: {
				newCommentDialogOpen: false,
				newCommentPosX: 0,
				newCommentPosY: 0
			}
		}, 

		/**
		*
		*	Initialize all internal functions 
		*	---------------------------------
		*
		**/ 

		init = function() {
			parseCommentData();
			bindStaticUIActions();
		}, 

		/**
		*
		*	Comment object constructor 
		*	--------------------------
		*
		**/ 

		comment = function(index, author, copy, time) {
			this.index = index;
			this.status = "active";
			this.position = {
				x: "0px",
				y: "0px"
			};
			this.contents = {
				author: author, 
				copy: copy, 
				timestamp: time ? time : new Date()
			},
			this.replies = []
		},

		/**
		*
		*	Private internal helper functions 
		*	---------------------------------
		*
		**/

		// Parse the existing comment data from js/json/comment-data.js 
		parseCommentData = function() {
			if(comment_data) {
				$.each(comment_data.comments, function(){
					if (this.status === "active")
						FeedbackWidget.createNewComment(this.contents.author, this.contents.copy, this.contents.timestamp, this.position.x, this.position.y);
					$(this.replies).each(function(){
						if (this.status === "active")
							FeedbackWidget.createNewReply(this.contents.author, this.contents.copy, this.contents.timestamp);
					});
				});
			}
		},

		openNewCommentDialog = function(e) {
			if (e.pageX) settings.status.newCommentPosX = e.pageX;
			if (e.pageY) settings.status.newCommentPosY = e.pageY;
			settings.status.newCommentDialogOpen = true;
			settings.$addNewCommentForm.css({
				'display': 'block',
				'top': settings.status.newCommentPosY, 
				'left': settings.status.newCommentPosX
			});
		},

		closeNewCommentDialog = function() {
			settings.status.newCommentDialogOpen = false;
			settings.$addNewCommentForm.hide();
			bindDynamicUIActions.unbindCreateCommentAction();
		}

		// Build the element and return as a jQuery wrapped object
		createCommentElement = function(newCommentElement) {
			var $newCommentElement = $('<article class="' + settings.commentClass +'"><p class="comment-copy">' + newCommentElement.contents.copy + '</p><footer class="comment-footer"><p>Comment left by: <span class="comment-author">' + newCommentElement.contents.author + '</span> on <span class="comment-timestamp">' + newCommentElement.contents.timestamp + '</span></p></footer><a href="#" class="comment-delete-btn">Delete comment</a> | <a href="#" class="comment-reply-btn">Reply</a></article>');
				$newCommentElement.attr('data-comment-index', newCommentElement.index);
				$newCommentElement.css({
					'position': 'absolute',
					'top': newCommentElement.position.y,
					'left': newCommentElement.position.x
				});

			return $newCommentElement;
		}, 

		// Get and return comment forms values
		getFormValues = function() {

		},

		// Append the reply field to the current comment 
		appendReplyFieldForm = function(commentParent) {
			var $newCommentReply = $('<div class="comment-reply"><p><strong>New reply</strong> <a href="#" class="comment-reply-close">[X]</a></p><input type="text" id="js-add-comment-author" value="Name"><textarea id="js-add-comment-copy" value="Comment"></textarea><a href="#" class="btn" id="js-add-comment-btn">Post</a></div>');
			commentParent.append($newCommentReply);
		},

		/**
		*
		*	Event handlers 
		*	--------------
		*
		**/

		// Bind initial UI actions on page load
		bindStaticUIActions = function() {
			settings.$createNewCommentBtn.bind('click', function(){
				bindDynamicUIActions.bindCreateCommentAction();
				event.stopPropagation();
				event.preventDefault();
			});
			settings.$addNewCommentClose.bind('click', function(){
				closeNewCommentDialog();
				event.stopPropagation();
				event.preventDefault();
			});
			settings.$addNewCommentBtn.bind('click', function(){
				// Get new comment values
				var newCommentAuthor = settings.addNewCommentInputAuthor.val(); 
				var newCommentCopy = settings.addNewCommentInputCopy.val();
				// Create new comment if form fields are not empty 
				if (newCommentAuthor !== '' && newCommentCopy !== '') {
					FeedbackWidget.createNewComment(newCommentAuthor, newCommentCopy);
					// Clear inputs 
					settings.addNewCommentInputAuthor.val('')
					settings.addNewCommentInputCopy.val('');
				} else {
					alert('Please fill in all form fields.');
				}
				event.stopPropagation();
				event.preventDefault();
			});
			settings.$toggleCommentsBtn.bind('click', function(){
				settings.$commentWrapper.find('.'+settings.commentClass).fadeToggle('fast');
				event.stopPropagation();
				event.preventDefault();
			});
		}, 

		// Bind dynamically created handlers as needed 
		bindDynamicUIActions = {
			// Bind & unbind click to create new comment dialog
			bindCreateCommentAction: function() {
				$('body').bind('click', function(e) {
					if (settings.status.newCommentDialogOpen === false)
						openNewCommentDialog(e);
				});
			}, 
			unbindCreateCommentAction: function() {
				$('body').unbind('click');
			},

			// Individual comment controls 
			enableDeleteComment: function(comment) {
				$('.comment-delete-btn', comment).bind('click', function() {
					FeedbackWidget.deleteComment($(this));
					event.stopPropagation();
					event.preventDefault();
				});
			},
			bindReplyComment: function(comment) {
				$('.comment-reply-btn', comment).bind('click', function() {
					appendReplyFieldForm(comment);
					bindDynamicUIActions.closeReplyComment(comment);
					bindDynamicUIActions.unbindReplyComment($(this));
					event.stopPropagation();
					event.preventDefault();
				});
			},
			unbindReplyComment: function(link) {
				$(link).unbind('click');
			},
			closeReplyComment: function(comment) {
				$('.comment-reply-close', comment).bind('click', function() {
					bindDynamicUIActions.bindReplyComment(comment);
					$(this).closest('.comment-reply').remove();
					event.stopPropagation();
					event.preventDefault();
				});
			}
		};

	/**
	*
	*	Public methods
	*	--------------
	*
	**/

	// Delete a comment (pass in jQuery wrapped object to remove)
	FeedbackWidget.deleteComment = function(comment) {
		comment.parent().remove();
		comment_data.comments[comment.parent().attr('data-comment-index')].status = "deleted";
	}

	// Create a new reply
	FeedbackWidget.createNewReply = function(author, copy, time) {
		// Create an instance of the reply object
		// Build the element
		// Bind any necessary UI actions
		// Append the comment to the page
		// Add the comment to the comment_data object (if it doesn't exist)
		// Increment index? 
	}

	// Create a new comment  
	FeedbackWidget.createNewComment = function(author, copy, time, posX, posY) {
		// Create a new instance of the object "comment" and set position 
		var newComment = new comment(i, author, copy, time);
			settings.status.newCommentPosX !== 0 ? newComment.position.x = settings.status.newCommentPosX : newComment.position.x = posX;
			settings.status.newCommentPosY !== 0 ? newComment.position.y = settings.status.newCommentPosY : newComment.position.y = posY;

		// Call function to build the element and return as a jQuery object 
		var $newCommentElement = createCommentElement(newComment);

		// Bind UI actions 
		bindDynamicUIActions.enableDeleteComment($newCommentElement);
		bindDynamicUIActions.bindReplyComment($newCommentElement);

		// Append newly created element to the comments wrapper 
		settings.$commentWrapper.append($newCommentElement);

		// Add object to the comments array in the comment_data object  
		comment_data.comments[i] = newComment;

		// Close the create new comment dialog box
		closeNewCommentDialog();

		// Make the comment draggable, use the stop callback function to set new position when dropped 
		$($newCommentElement).draggable({
			stop: function() {
				comment_data.comments[$(this).attr('data-comment-index')].position.x = $(this).css('left');
				comment_data.comments[$(this).attr('data-comment-index')].position.y = $(this).css('top');
			}
		});

		// Increment index
		i++;
	}

	init();

}(window, jQuery, window.FeedbackWidget = window.FeedbackWidget || {}));
