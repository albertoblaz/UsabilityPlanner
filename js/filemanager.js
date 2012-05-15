
	UP.FileManager = function() {

		// Private API

		function objToCsv() {
			return ;
		}

		function csvToObj() {
			return ;
		}


		// Public API

		var obj = {};

		obj.downloadFile = function() {
			var output;
			var method;

			var methodsSelected = this.allMethodsCol.where({ selected : true });
			output = "Method;Value;";

			this.constraintsCol.each(function(c) {
				output += c.stringify();
			});

			output += "\r\n";

			for ( var i=0; i < methodsSelected.length; i++ ) {
				output += (methodsSelected[i].stringify() + "\r\n") ;
			}

			$.post('php/download-plan.php', { msg : output }, function(data) {
				console.log("success!");
				console.log(data);

			}).done(function(message) {
				//console.log("done!");
				//console.log(message);

			}).fail(function(jqXHR, textStatus) {
				console.log("fail");
				console.log(textStatus);

			});


			/*
			var button = $(this);

			var output;
			var method;
			var methodsJSON = [];

			var methodsSelected = this.allMethodsCol.where({ selected : true });

			for ( var i=0; i < methodsSelected.length; i++ ) {
				method = methodsSelected[i].stringify();
				methodsJSON.push( method );
			}

			output = JSON.stringify({ methods : methodsJSON });

			$.post('php/download-plan.php', { msg : output }, function(data) {
				console.log("success!");
				console.log(data);

			}).done(function(message) {
				//console.log("done!");
				//console.log(message);

			}).fail(function(jqXHR, textStatus) {
				console.log("fail");
				console.log(textStatus);

			});
			*/

		};

		obj.uploadFile = function(file) {
			var fileextension = file.name.split('.').pop();

			if (fileextension !== 'csv') {
				return false;
			}

			var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');

			$("body").append(iframe);

			var form = $('#theuploadform');
			form.attr("action", "php/upload-plan.php");
			form.attr("method", "post");
			form.attr("enctype", "multipart/form-data");
			form.attr("encoding", "multipart/form-data");
			form.attr("target", "postiframe");
			form.attr("file", $('#files').val());
			form.submit();

			$("#postiframe").load(function () {
				response = $("#postiframe")[0].contentWindow.document.body.innerHTML;
				console.log(response);
			});

			return true;
		};

		return obj;
	}