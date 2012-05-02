	
	function fadingMethods(newSliderValue) {
		var i, j;
		var text;
		var methods = $('.method');
		
		methods.addClass('hidden').removeClass('visible').removeClass('last-method');
		
		for (i=0; i < methods.length; i++) {
			text = methods.eq(i).find('.valoration').text();
			for (j=0; j <= newSliderValue && j < valoration.length; j++) {
				if (text != 'null' && text != 'undefined' && text.localeCompare(valoration[j]) == 0) {
					methods.eq(i).removeClass('hidden').addClass('visible');
				}
			}
		}
		
		for (i=0; i < lists.length; i++) {
			lists.eq(i).find('.visible').last().addClass('last-method');
		}
	}