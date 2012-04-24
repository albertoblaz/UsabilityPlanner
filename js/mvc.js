
// Load the application once the DOM is ready, using `jQuery.ready`
$(function(){

	/* Constants */
	
	const FADE_SPEED       = 700;
	const DISABLED_OPACITY = 0.5;
	const SLIDE_SPEED      = 300;

	const recommendation = [ "strongly recommended", "neutral", "slightly recommended", "not recommended" ];
	
	
	/* Auxiliary Variables */
	
	var sliderValue  = 1;
	
	
	/* Auxiliary Functions */
	
	function activateCheckbox(obj) {
		obj.find('a').toggleClass('checked');
	}
	
	
	/* Models */
	
	var Method = Backbone.Model.extend({
	
		defaults: {
			weights = [];
			content: "",
			selected: true,
			value: 0
		},
		
		initialize: function(weights) {
			this.set({
				"weights": weights,
				"content": this.defaults.content,
				"selected": this.defaults.selected,
				"value": this.defaults.value
			});
		},
		
		calculateValue: function() {
			// Según la constraint seleccionada, se aplicará el peso correspondiente al valor total
			//this.value += ;
		}
		
	});
	
	
	var Constraint = Backbone.Model.extend({
	
		defaults: {
				this.selected = false;
		},
		
		initialize: function(name, description) {
			this.set({
				"name" : name,
				"description" : description
				"selected" : this.defaults.selected;
			});
		},
		
		selectConstraint: function() {
			this.selected = true;
			// En cuanto una constraint ha sido seleccionada, los modelos de Methods deben recalcular su valor
		},
		
		unselectConstraint: function() {
			this.selected = false;
			// En cuanto una constraint ha sido deseleccionada, los modelos de Methods deben recalcular su valor
		}
		
	});
	
	
	var Subactivity = Backbone.Model.extend({
		
		defaults: {
			this.name = "";
			this.description = "";
			this.methodsCol = [];
		}
		
		initialize: function(name, description, methodsCollection) {
			this.set({
				"name" : this.defaults.name
				"description" : this.defaults.description,
				"methodsCol" : this.defaults.methodsCol
			});
		}
		
	});
	
	
	var Activity = Backbone.Model.extend({
		
		defaults: {
			this.name = "";
			this.description = "";
			this.subactivitiesCol = [];
		}
		
		initialize: function(name, description, subactivitiesCol) {
			this.set({
				"name" : this.defaults.name
				"description" : this.defaults.description,
				"subactivitiesCol" : this.defaults.subactivitiesCol
			});
		}
		
	});
	
	
	/* Views */
	
	ConstraintView = Backbone.View.extend({
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
	
	
	MethodView = Backbone.View.extend({	
		initialize: function($node) {
			$el = $node;
		},
		
		events: {
			"click #methods-section.checkboxWrapper" : "checkboxEvent",
			"click #methods-section.methodInfo" : "displayInfoEvent",
		},
		
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
	
	
	/* Collections */
	
	MethodCollection = Backbone.Collection.extend({
		model: Method,

		comparator: function(todo) {
			return Method.get('value');
		}

	});

	
	/* Other Classes */
	
	var Weight = function () {
		var constraint;
		var numWeight;
		
		// Public API
		return {
			weightOfConstraint : function(constraintName) {
				if (constraintName === constraint.get("name")) {
					return numWeight;
				}
			}
		};
	};
	
	
	
	// Create our global collection of 'Methods'
	var MethodCollection = new MethodCollection();


  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted",
      "click .mark-all-done": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$(".mark-all-done")[0];

      Todos.bind('add',     this.addOne);
      Todos.bind('reset',   this.addAll);
      Todos.bind('all',     this.render);

      Todos.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       done,
        remaining:  remaining
      }));

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.addOne);
    },

    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        content: this.input.val(),
        order:   Todos.nextOrder(),
        done:    false
      };
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
