	
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
			
			

			var self = this;

			$.post(UP.constants.PHP_DOWNLOAD, { msg : csv }, function(data) {
				
				
				if ( data ) {
					success = true;
					
//					self.trigger('downloadReady');
					document.location.href= 'plan.csv';
				}

			}).fail(function(jqXHR, textStatus) {
				
				
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
			
			return csv;
		}

	});