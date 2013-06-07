/**
*	
*	TO DO: FUNCTIONALITY 
*	--------------------
*	- Parse JSON data and display existing comments on the page 
*	- FeedbackWidget.openNewCommentDialog() will not work as a public function without e.pageX/e.pageY
*	- Add ability to toggle comments on/off 
*	
*	TO DO: UI 
*	---------
*	- Add marker to specify location of comments
*	
**/ 

(function(window, $, FeedbackWidget) {

	var i = 0,
		mousePosX,
		mousePosY,
		comments = {},

		// Private settings object 
		settings = {
			// UI elements 
			commentWrapper: $('#js-comments-wrapper'),
			commentClass: $('.comment'),
			createNewCommentBtn: $('#js-create-comment-btn'),
			addNewCommentForm: $('#js-add-comment-form'),
			addNewCommentClose: $('#js-add-comment-close'),
			addNewCommentInputAuthor: $('#js-add-comment-author'),
			addNewCommentInputCopy: $('#js-add-comment-copy'),
			addNewCommentBtn: $('#js-add-comment-btn'), 
			deleteCommentBtn: $('.comment-delete'),

			// Status object 
			status: {
				newCommentDialogOpen: false,
				newCommentPosX: 0,
				newCommentPosY: 0
			}
		}, 

		// Initialize all internal functions 
		init = function() {
			bindStaticUIActions();
		}, 

		// Bind initial UI actions on page load
		bindStaticUIActions = function() {
			settings.createNewCommentBtn.bind('click', function(){
				bindDynamicUIActions.bindCreateCommentAction();
				event.stopPropagation();
				event.preventDefault();
			});
			settings.addNewCommentClose.bind('click', function(){
				FeedbackWidget.closeNewCommentDialog();
				event.stopPropagation();
				event.preventDefault();
			});
			settings.addNewCommentBtn.bind('click', function(){
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
			});
		}, 

		// Bind dynamically created handlers as needed 
		bindDynamicUIActions = {
			bindCreateCommentAction: function() {
				$('body').bind('click', function(e) {
					if (settings.status.newCommentDialogOpen === false)
						FeedbackWidget.openNewCommentDialog(e);
				});
			}, 
			unbindCreateCommentAction: function() {
				$('body').unbind('click');
			},
			enableDeleteComment: function() {
				console.log("hit!");
				settings.deleteCommentBtn.bind('click', function(){
					console.log("hit");					
					event.stopPropagation();
					event.preventDefault();
				});
			}
		}, 

		// Comment object constructor 
		comment = function(index, author, copy) {
			this.index = index;
			this.domElement = null;
			this.position = {
				x: 0,
				y: 0
			};
			this.contents = {
				author: author, 
				copy: copy, 
				timestamp: new Date()
			}
			this.deleteComment = function() {
				console.log(this.domElement);
			}
		}, 

		// Build the element and return as a jQuery object
		createCommentElement = function(newCommentElement) {
			var $newCommentElement = $('<article class="comment"></article>');
				$newCommentElement.append('<p class="comment-copy">' + newCommentElement.contents.copy + '</p>');
				$newCommentElement.append('<footer class="comment-footer"><p>Comment left by: <span class="comment-author">' + newCommentElement.contents.author + '</span> on <span class="comment-timestamp">' + newCommentElement.contents.timestamp + '</span></p></footer>');
				$newCommentElement.append('<a href="#" class="comment-delete">Delete comment</a> | <a href="#" class="comment-reply">Reply</a>');
				$newCommentElement.attr('data-comment-index', newCommentElement.index);
				$newCommentElement.css({
					'position': 'absolute',
					'top': newCommentElement.position.y,
					'left': newCommentElement.position.x
				});

			return $newCommentElement;
		};

	// Public function: open the create new comment dialog
	FeedbackWidget.openNewCommentDialog = function(e) {
		if (e.pageX) settings.status.newCommentPosX = e.pageX;
		if (e.pageY) settings.status.newCommentPosY = e.pageY;
		settings.status.newCommentDialogOpen = true;
		settings.addNewCommentForm.css({
			'display': 'block',
			'top': settings.status.newCommentPosY, 
			'left': settings.status.newCommentPosX
		});
	}

	// Public function: close the create new comment dialog
	FeedbackWidget.closeNewCommentDialog = function() {
		settings.status.newCommentDialogOpen = false;
		settings.addNewCommentForm.hide();
		bindDynamicUIActions.unbindCreateCommentAction();
	}

	/**
	*
	* Public function: create a new comment  
	* 
	* Passing in any information to the function FeedbackWidget.createNewComment() should
	* create the new comment, add it to the comments array and append it to the DOM
	*
	* Should the properties of the newComment object be passed to the object contructor
	* or should they be set within the createNewComment function? 
	* 
	**/
	FeedbackWidget.createNewComment = function(author, copy) {
		// Create a new instance of the object "comment" and set position 
		var newComment = new comment(i, author, copy);
			newComment.position.x = settings.status.newCommentPosX;
			newComment.position.y = settings.status.newCommentPosY;

		// Call function to build the element and return as a jQuery object 
		var $newCommentElement = createCommentElement(newComment);

		// Set the jQuery object as a property of the comment object for reference 
		newComment.domElement = $newCommentElement;

		// Append newly created element to the comments wrapper 
		settings.commentWrapper.append($newCommentElement);

		// Add object to the comments wrapper object 
		comments[i] = newComment;

		// Close the create new comment dialog box
		FeedbackWidget.closeNewCommentDialog();

		bindDynamicUIActions.enableDeleteComment();

		i++;

		console.log(comments);
	}

	init();

}(window, jQuery, window.FeedbackWidget = window.FeedbackWidget || {}));