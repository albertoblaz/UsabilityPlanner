	
	/**
	 * @module UP
	 * @submodule Util
	 * @class FileManager
	 * @extends Backbone.Model
	 */	
	UP.FileManager = Backbone.Model.extend({
	
		/**
		 * @method downloadFile
		 * @param csv {string}
		 */
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

		
		/**
		 * @method uploadFile
		 * @param file {Object}
		 * @return csv {string}
		 */
		uploadFile: function(file) {
			var csv = file[0].contentWindow.document.body.innerHTML;
			console.log(csv);
			return csv;
		}

	});