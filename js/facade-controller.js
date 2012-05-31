
	UP.FacadeController = Backbone.Controller.extend({
		initialize: function(window, recommender) {
			// Attributes
			this.window = window;
			this.recommender = recommender;


			// Caching View Elements with jQuery
			this.initViewElements();


			// Handle Events
			this.setupEvents();


			// Initialization Effect
			this.adjustContainer();
			this.adjustActivityContainer();
			

			var tabs = $('.tab');
			if (tabs.length == 6) {
				tabs.find('p').css({ 'font-size' : '16px' });
				tabs.removeClass('three-columns').addClass('six-columns');
				$('.stage').eq(0).find('a').text("Stages");
			}
		},


		initViewElements: function() {
			this.logo     = $('.logo');

			this.stages   = $('.stage');
			this.backLink = $('.back');	
			this.nextLink = $('.next');	

			this.currentStage  = 0;

			this.container = $('.container'); 
			this.contents = this.container.find('.main-content');

			this.mainContainer = $('.main-container');

			this.downloadButton = $('#btn-download');
			this.uploadButton   = $('#btn-upload');
			//this.uploadInput    = $('#files');
			//this.dropSpace    = $('#drop-space');
		},


		adjustContainer: function() {
			var totalWidth = this.mainContainer.width() * this.contents.length;
			this.container.width(totalWidth);
	
			var firstHeight = this.contents.height();
			this.container.height(firstHeight);
		},

		
		adjustActivityContainer: function() {
			var max = 0;
			var margin;

			var activities = $('.activity');

			var first = activities.first();
			var margin = parseInt(first.css('margin-top'));

			activities.each(function(i) {
				var act = activities.eq(i);
				
				var h = parseInt(act.css('height'));

				var size = h + margin * 2;
				if ( size > max ) {
					max = size;
				}
				
			});

			var hh = this.container.height() + margin;
			this.container.height( hh );

			$('#activities-selection').css({ 'height' : max });
		},

		
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
				console.log("hecho click");
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


		animate: function(newIndex, oldIndex) {
			var SPEED = UP.constants.STAGES_SPEED;

			this.stages.eq(oldIndex).removeClass('current-stage');   // Old tab
			this.stages.eq(newIndex).addClass('current-stage');	 // New tab
		
			var height = this.contents.eq(newIndex).height();
			var pos = (this.mainContainer.width()+1) * -newIndex;
			this.container.stop().animate({marginLeft: pos, height: height}, SPEED);
		},


		stagesEvent: function(event, stageSelected) {
			event.preventDefault();
	
			var newPosition = stageSelected.prevAll().length;
			this.animate(newPosition, this.currentStage);
		
			this.currentStage = newPosition;		// Updating to the new current stage
		},


		backLinkEvent: function(event) {
			event.preventDefault();

			if (this.currentStage > 0) {
				var oldStage = this.currentStage;
				this.currentStage--;
				this.animate(this.currentStage, oldStage);
			}
		},


		nextLinkEvent: function(event) {
			event.preventDefault();

			if (this.currentStage < this.stages.length-1) {
				var oldStage = this.currentStage;
				this.currentStage++;
				this.animate(this.currentStage, oldStage);
			}
		},


		adjustResizeWindowEvent: function(event) {
			var mainContainerWidth = this.mainContainer.width();

			this.contents.width(mainContainerWidth);
			var width = mainContainerWidth * 3;
			this.container.width(width);
			var pos = (mainContainerWidth + 1) * -self.currentStage;
			this.container.css({marginLeft: pos});
		}

	});

	