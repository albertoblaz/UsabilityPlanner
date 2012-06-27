

	/* jQuery Objects  */

	var input      = $('#userfile');
	var btnUpload  = $('#btn-upload');

	var form       = $('#theuploadform');

	var activities = $('#activities');
	var stages     = $('#stages');

	var param      = $('#parameter');


	/* Event Handlers */

	btnUpload.on('click', function() {
		input.trigger('click');
	});


	input.on('change', function() {
		var xml = "";

		if ( activities.attr('checked') ) {
			xml = "activities.xml";
			console.log("bien");
		} else if ( stages.attr('checked') ) {
			xml = "stages.xml";
			console.log("bien 2");
		} else {  // none of them
			console.log("mal!");
			return false;
		}

		param.val(xml);

		var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');
		$("body").append(iframe);
	
		form.attr("action", "csvToXml.php");
		form.attr("method", "post");
		form.attr("enctype", "multipart/form-data");
		form.attr("encoding", "multipart/form-data");
		form.attr("target", "postiframe");
		form.attr("file", input.val());
		form.submit();

		input.val("");

		var post = $('#postiframe');
		post.load(function() {
              		var csv = post[0].contentWindow.document.body.innerHTML;
			console.log(csv);
			return csv;
                });

		return false;
	});

