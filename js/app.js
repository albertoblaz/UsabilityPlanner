
	UP.App = Backbone.Controller.extend({
		initialize: function(window) {
			this.window = window;

			this.fileManager = UP.FileManager();
			this.parser      = UP.Parser(UP.constants.XML, this);
			this.parser.parseXML();


			// Collections
			this.constraintsCol = new UP.ConstraintCollection();
			this.allMethodsCol = new UP.MethodCollection();
			//this.activitiesCol  = new UP.ActivityCollection();
			this.activities = [];



			// Caching View Elements
			this.stages   = $('.stage');
			this.backLink = $('.back');	
			this.nextLink = $('.next');	

			this.expandButton   = $('#expand');
			this.collapseButton = $('#collapse');

			this.currentStage  = 0;

			this.container = $('.container'); 
			this.contents = this.container.find('.main-content');

			this.mainContainer = $('.main-container');

			this.slidervalue = UP.constants.SLIDER_VALUE;
			this.slider = $('#slider');	

			this.downloadButton = $('#btn-download');
			this.uploadButton   = $('#btn-upload');
			this.dropSpace      = $('#drop-space');


			// Handle Events
			this.setupEvents();


			// Initialization Effect
			var totalWidth = this.mainContainer.width() * this.contents.length;
			this.container.width(totalWidth);
	
			var firstHeight = this.contents.height();
			this.container.height(firstHeight);
		},

		setupEvents: function() {
			// Event Handlers
			var self = this;

			this.stages.on("click", function(event) {
				var stageSelected = $(this);
				self.stagesEvent(event, stageSelected);
			});

			this.backLink.on("click", function(event) {
				self.backLinkEvent(event)
			});

			this.nextLink.on("click", function(event) {
				self.nextLinkEvent(event)
			});

			this.expandButton.on("click", function(event) {
				self.expandButtonEvent(event);
			});

			this.collapseButton.on("click", function(event) {
				self.collapseButtonEvent(event);
			});

			this.downloadButton.on('click', function(event) {
				self.fileManager.downloadFile();
			});


			this.uploadButton.on('click', function(e) {
				$('#files').trigger('click');
			});		
			


/*
	if (window.File && window.FileReader && window.FormData) {
		// Great success! All the File APIs are supported.
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
*/

			$('#files').on('change', function(evt) {
				var file = this.files[0];

				var response = fileManager.uploadFile(file);

				if ( response ) {
					self.uploadButton.text("Plan uploaded!");
					self.uploadButton.addClass('green');
				} else {
					self.uploadButton.text("Need a .csv file");
					self.uploadButton.addClass('red');
				}

			});



			self.constraintsCol.on('change', function() {
				self.allMethodsCol.each(function(method) {
					method.calculateValue();
				});
				self.allMethodsCol.sort();
				self.allMethodsCol.each(function(method) {
					method.updateView();
				});

				self.hideMethods(self.slidervalue);
			});



			$(this.window).on('resize', function() {
				var mainContainerWidth = self.mainContainer.width();

				self.contents.width(mainContainerWidth);
				var width = mainContainerWidth * 3;
				self.container.width(width);
				var pos = (mainContainerWidth + 1) * -self.currentStage;
				self.container.css({marginLeft: pos});
			});

			$(this.window).trigger('resize');


			this.slider.slider({		/* Slider Widget Configuration Setup */
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: UP.constants.VALUE.length-1,
				value: this.slidervalue,
				animate: true,
				slide: function(event, ui) {	// Event function to perfom
					self.hideMethods(ui.value);
				}
			});

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

		expandButtonEvent: function(event) {
			for ( var i=0; i < this.activities.length; i++ ) {
				this.activities[i].expandList();
			}
		},

		collapseButtonEvent: function(event) {
			for ( var i=0; i < this.activities.length; i++ ) {
				this.activities[i].collapseList();
			}
		},

		hideMethods: function(newSliderValue) {
			this.slidervalue = newSliderValue;			// Updating the old value for next function call

			for ( var i=0; i < this.activities.length; i++ ) {
				var subs = this.activities[i].subactivities;
				for ( var j=0; j < subs.length; j++ ) {
					subs[j].hideMethods(newSliderValue);	// Showing or hiding methods on the lists
				}

				this.activities[i].updateCountersView();
			}
		},

	});

	// Starting out the system
	var App = new UP.App(window);

	