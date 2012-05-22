
	UP.FileManager = Backbone.Model.extend({
		initialize: function() {
		},


		downloadFile: function(csv, success) {
			console.log("CSV:");
			console.log(csv);

			var self = this;

			$.post(UP.constants.PHP_DOWNLOAD, { msg : csv }, function(data) {
				console.log("success!");
				console.log(data);
				if ( data ) {
					success = true;
					console.log("post");
//					self.trigger('downloadReady');
					document.location.href= 'plan.csv';
				}

			}).fail(function(jqXHR, textStatus) {
				console.log("fail");
				console.log(textStatus);
				success = false;
			});
		},


		uploadFile: function(file) {
			var csv = file[0].contentWindow.document.body.innerHTML;
			console.log(csv);
			return csv;
		}

	});