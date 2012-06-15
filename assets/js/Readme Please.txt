
NOTE TO DEVELOPERS
------------------

Backbone.js is currently (April, 2012) one of the most used and famous JavaScript MVC frameworks
The problem is that its approach is based on things they call 'Models' and 'Views' (apart from 'Collections' and 'Routers' too)
But what they call 'Views' are actually 'Controllers' so the objects which extend of Backbone.View are the controllers for Methods, Activities and so on.


I know it's weird, but it is a great framework so you don't worry ok?
Just think about you create a Model, then you create a Controller who owns the logic of the MVC and it has 2 properties: the model and the view
And finally, what is the view???  The jQuery object that represents the DOM node


For example, imagine you are creating Constraint objects while parsing the XML file.
You have to create a model like this
	var myModel = new UP.Constraint(name, description);

Then you catch the DOM node with jQuery doing
	var myNode = $('.constraint').eq(i);    // 'i' is the index inside a loop

And finally you have to create the Controller doing something similar to the following
	new UP.ConstraintController( {model: myModel, el: myNode} );


I hope this could help you a little bit...   :)