	/* ------------------------------------------------

		TO DO:
		------
		- Post a reply / comment chain 
		- Ability to write multi-line comments (currently outputs 1 string)
		- Format date string to be more concise
		- New comment positioning is off 
		- Reduce unnecessary repetition in comment property variables 
		- Use object constructor method (http://jsfiddle.net/louisstanard/K2Vrk/)
		- Separate behavior from presentation 
		- The comment element on the page and the comment instance need to be tied together more closely 
		- Padding on element causing it to not line up correctly 

	--------------------------------------------- */

var s, 
    commentWidget = {

		settings: {
			// Comments info 
			commentList: null,
			numComments: null,

			// UI elements 
			commentWrapper: $('#js-comments-wrapper'),
			commentClass: $('.comment'),
			createNewCommentBtn: $('#js-create-comment-btn'),
			addNewCommentForm: $('#js-add-comment-form'),
			addNewCommentClose: $('#js-add-comment-close'),
			addNewCommentInputAuthor: $('#js-add-comment-author'),
			addNewCommentInputCopy: $('#js-add-comment-copy'),
			addNewCommentBtn: $('#js-add-comment-btn'), 

			// Status object 
			status: {
				newCommentDialogOpen: false,
				newCommentPosX: 0,
				newCommentPosY: 0
			}
		}, 

		init: function() {
			s = this.settings;
			var i = 0,
			    comments = [];
			this.bindStaticUIActions();
		}, 

		// Comment object constructor 
		comment: function(index, author, copy) {
			this.index = index;
			this.domElement = null;
			this.positionX = 0;
			this.positionY = 0;
			this.contents = {
				author: author, 
				copy: copy, 
				timestamp: new Date()
			}
			this.deleteComment = bindDynamicUIActions.bindDeleteCommentAction()
		}, 

		// Bind initial UI actions on page load
		bindStaticUIActions: function() {
			s.createNewCommentBtn.bind('click', function(){
				commentWidget.bindDynamicUIActions.bindCreateCommentAction();
				event.preventDefault();
			});
			s.addNewCommentBtn.bind('click', function(){
				// actions 
				event.stopPropagation();
			});
			s.addNewCommentClose.bind('click', function(){
				// actions
				event.stopPropagation();
			});
		}, 

		// Bind dynamic UI actions as needed - use .live() 
		bindDynamicUIActions: {
			bindCreateCommentAction: function() {
				// actions 
			}, 
			unbindCreateCommentAction: function() {
				// actions 
			}, 
			bindDeleteCommentAction: function() {
				// actions 
			}
		}, 

		openNewCommentDialog: function() {
			// actions 
		}, 

		closeNewCommentDialog: function() {
			// actions
		}, 

		createNewComment: function() {
			var index = init.i;
			// actions 
			i++;
		}, 

	};