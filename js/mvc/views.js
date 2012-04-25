

	UP.ConstraintView = Backbone.View.extend({
		initialize: function($node) {
			$el = $node;
		},
		
		events: {
			"click .constraint" : "constraintSelectedEvent",
		},
		
		constraintSelectedEvent: function(event) {
			event.preventDefault();
			
			var $this = $(this);
			activateCheckbox($this);
			
			this.model.selectConstraint();		// Actualizar el modelo de Constraint llamando a su método select
		}
		
	});
	
	
	UP.MethodView = Backbone.View.extend({	
		initialize: function($node) {
			$el = $node;
			this.model.bind('change', this.render, this);
		},
		
		events: {
			"click #methods-section.checkboxWrapper" : "checkboxEvent",
			"click #methods-section.methodInfo" : "displayInfoEvent",
		},
		
		render : function() {
			$el.find('.valoration').text("Hola!!!");
		}
		
		checkboxEvent: function(event) {
			event.preventDefault();
			
			var checkbox = $(this);

			var li = checkbox.parent();
			disableMethodAnimation(li);
			activateCheckbox(checkbox);

			// Updating tab counters value
			updateFilterCounters();
		},
		
		displayInfoEvent: function() {
			var $this = $(this);
			var description  = $this.siblings('.method-description');
			var expandButton = $this.find('.expand-button');
			var method       = $this.parent();
			
			if (description.hasClass('hidden')) {
				description.css({opacity: 0});
				description.removeClass('hidden');
				
				var height = description.height() + 40;
				method.stop().animate({height: height}, FADE_SPEED);
				
				description.stop().animate({opacity: 1}, FADE_SPEED);
				expandButton.addClass('expanded');
			} else {
				method.stop().animate({height: 25}, FADE_SPEED);
				description.stop().animate({opacity: 0}, FADE_SPEED, function() {
					description.addClass('hidden');
				});
				expandButton.removeClass('expanded');
			}
		},
		
		disableMethodAnimation: function(li) {
			var CSSClass = 'disabled';
			var bar = li.find('.bar');
			
			if (li.hasClass(CSSClass)) {
				li.removeClass(CSSClass);
				li.animate({opacity: '1'}, FADE_SPEED);
				bar.animate({opacity: '1'}, FADE_SPEED);
			} else {
				li.addClass(CSSClass);
				li.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
				bar.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
			}
		}

	});