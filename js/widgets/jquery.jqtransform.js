


$(document).ready(function() {

	var checkboxEvent = function(e) {
		var input = $(this);
		var link = input.find('a');
		
		link.toggleClass('checked');
		
		e.preventDefault();
	};
	
	$('.checkboxWrapper').on("click", checkboxEvent);
	
});