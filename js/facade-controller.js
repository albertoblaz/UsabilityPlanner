
	/**
	 * @module UP
	 * @submodule App
	 * @class FacadeController
	 * @extends Backbone.Controller
	 */	
	UP.FacadeController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @param window {object}
		 * @param recommender {Recommender}
		 * @constructor
		 */
		initialize: function(window, recommender) {
		
			/* Attributes */
			
			/**
			 * @property window
			 * @type Object
			 */
			this.window = window;
			
			/**
			 * @property recommender
			 * @type Recommender
			 */
			this.recommender = recommender;


			// Caching View Elements with jQuery
			this.initViewElements();


			// Handle Events
			this.setupEvents();


			// Initialization Effect
			//this.adjustContainer();
			this.adjustActivityContainer();
			this.adjustTabsActivityContainer();
			this.fixConstraintsDescription();

			this.stagesEvent(null, this.stages.first());


			var descriptions = $('.description');
			for (var i=0; i < descriptions.length; i++) {
				var d = descriptions.eq(i);
				if ( d.text() === "" ) {
					d.text( "(No available description yet)" );
				}
			}

		},


		adjustTabsActivityContainer: function() {
			var tabs = $('.tab');
			if (tabs.length == 6) {
				var size = 16;
				if ( navigator.userAgent.indexOf('iPad') != -1 ) {
					size = 14;
				}

				tabs.find('p').css({ 'font-size' : size + 'px' });
				tabs.removeClass('three-columns').addClass('six-columns');

				this.stages.first().find('a').text("Stages");
			}
		},


		fixConstraintsDescription: function() {
			var tooltip = $('.tooltip');
			var text = tooltip.text();
			if ( text === "" ) {
				tooltip.text( "(No available description yet)" );
			}
		},


		/**
		 * @method initViewElements
		 */
		initViewElements: function() {
		
			/**
			 * @property logo
			 * @type jQuery Object
			 * @default "logo DOM node"
			 */
			this.logo     = $('.logo');

			/**
			 * @property stages
			 * @type jQuery Object
			 * @default "stage DOM nodes"
			 */
			this.stages   = $('.stage');
			
			/**
			 * @property backLink
			 * @type jQuery Object
			 * @default "backLink DOM node"
			 */
			this.backLink = $('.back');	
			
			/**
			 * @property nextLink
			 * @type jQuery Object
			 * @default "nextLink DOM node"
			 */
			this.nextLink = $('.next');	

			/**
			 * @property currentStage
			 * @type number
			 * @default "0"
			 */
			this.currentStage  = 0;

			/**
			 * @property container
			 * @type jQuery Object
			 * @default "container DOM node"
			 */
			this.container = $('.container'); 
			
			/**
			 * @property contents
			 * @type jQuery Object
			 * @default "main-content DOM nodes"
			 */
			this.contents = this.container.find('.main-content');

			/**
			 * @property mainContainer
			 * @type jQuery Object
			 * @default "main-container DOM node"
			 */
			this.mainContainer = $('.main-container');

			/**
			 * @property downloadButton
			 * @type jQuery Object
			 * @default "download button DOM node"
			 */
			this.downloadButton = $('#btn-download');
			
			/**
			 * @property uploadButton
			 * @type jQuery Object
			 * @default "upload button DOM node"
			 */
			this.uploadButton   = $('#btn-upload');
			
			//this.uploadInput    = $('#files');
			//this.dropSpace    = $('#drop-space');
		},


		/**
		 * @method adjustContainer
		 */
		adjustContainer: function() {
			var totalWidth = this.mainContainer.width() * this.contents.length;
			this.container.width(totalWidth);
	
			var firstHeight = this.contents.height();
			this.container.height(firstHeight);
		},


		/**
		 * @method adjustActivityContainer
		 */		
		adjustActivityContainer: function() {
			var max = 0;
			var margin;

			var activities = $('.activity');

			var first = activities.first();
			var margin = 37; //parseInt(first.css('margin-top'));

			activities.each(function(i) {
				var act = activities.eq(i);
				
				var h = parseInt(act.css('height'));

				var size = h + margin * 2;
				if ( size > max ) {
					max = size;
				}
			});

			$('#activities-selection').css({ 'height' : max + 10 });

			//var hh = this.container.children('#activities').height();
			//this.container.height( hh );

		},


		/**
		 * @method setupEvents
		 */		
		setupEvents: function() {
			// Event Handlers
			var self = this;

			this.logo.on("click", function(event) {
				var stage = self.stages.first();
				self.stagesEvent(event, stage);
			});

			this.stages.on("click", function(event) {
				var stageSelected = $(this);
				self.stagesEvent(event, stageSelected);
			});

			this.backLink.on("click", function(event) {
				self.backLinkEvent(event);
			});

			this.nextLink.on("click", function(event) {
				self.nextLinkEvent(event);
			});

			this.downloadButton.on('click', function(event) {
				var success = self.recommender.downloadPlan();
				return false;
			});

			this.recommender.on('downloadReady', function(event) {
				
			});

			this.uploadButton.on('click', function(event) {
				//self.uploadInput.trigger('click');
				$("#userfile").trigger('click');
			});		


			$("#userfile").on('change', function() {
				var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');
				$("body").append(iframe);

				var form = $('#theuploadform');
				form.attr("action", UP.constants.PHP_UPLOAD);
				form.attr("method", "post");
				form.attr("enctype", "multipart/form-data");
				form.attr("encoding", "multipart/form-data");
				form.attr("target", "postiframe");
				form.attr("file", $('#userfile').val());
				form.submit();

				$("#postiframe").load(function () {
					self.recommender.uploadPlan( $("#postiframe") );
				});

				return false;
			});


			$(this.window).on('resize', function(event) {
				self.adjustResizeWindowEvent(event);
			});

			$(this.window).trigger('resize');


/*
	if (window.File && window.FileReader && window.FormData) {
		// Great success! All the File APIs are supported.
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
*/


		},


		/**
		 * @method animate
		 * @param newIndex {number}
		 * @param oldIndex {number}
		 */
		animate: function(newIndex, oldIndex) {
			var SPEED = UP.constants.STAGES_SPEED;

			this.stages.eq(oldIndex).removeClass('current-stage');   // Old tab
			this.stages.eq(newIndex).addClass('current-stage');	 // New tab
		
			var height = this.contents.eq(newIndex).height();
			var pos = (this.mainContainer.width()+1) * -newIndex;
			this.container.stop().animate({marginLeft: pos, height: height}, SPEED);
		},


		/**
		 * @method stagesEvent
		 * @param event {event}
		 * @param stageSelected {jQuery Object}
		 */
		stagesEvent: function(event, stageSelected) {
			if ( event != null) {
				event.preventDefault();
			}
	
			var newPosition = stageSelected.prevAll().length;
			this.animate(newPosition, this.currentStage);
		
			this.currentStage = newPosition;		// Updating to the new current stage
		},


		/**
		 * @method backlinkEvent
		 * @param event {event}
		 */
		backLinkEvent: function(event) {
			event.preventDefault();

			if (this.currentStage > 0) {
				var oldStage = this.currentStage;
				this.currentStage--;
				this.animate(this.currentStage, oldStage);
			}
		},


		/**
		 * @method nextlinkEvent
		 * @param event {event}
		 */
		nextLinkEvent: function(event) {
			event.preventDefault();

			if (this.currentStage < this.stages.length-1) {
				var oldStage = this.currentStage;
				this.currentStage++;
				this.animate(this.currentStage, oldStage);
			}
		},


		/**
		 * @method adjustReszeWindowEvent
		 * @param event {event}
		 */
		adjustResizeWindowEvent: function(event) {
			var mainContainerWidth = this.mainContainer.width();

			this.contents.width(mainContainerWidth);
			var width = mainContainerWidth * 3;
			this.container.width(width);
			var pos = (mainContainerWidth + 1) * -self.currentStage;
			this.container.css({marginLeft: pos});
		}

	});
	
