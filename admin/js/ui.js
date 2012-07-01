
	UP.Admin.UI = {

		initialize: function(csvConverter) {
			this.csvConverter = csvConverter;

			this.initViewElements();
			this.setupEvents();
		},


		initViewElements: function() {
			/* jQuery Objects  */

			this.input       = $('#userfile');
			this.btnDownload = $('#btn-download');
			this.btnUpload   = $('#btn-upload');

			this.form        = $('#theuploadform');

			this.activities  = $('#activities');
			this.stages      = $('#stages');

			this.param       = $('#parameter');
		},


		setupEvents: function() {	
			/* Event Handlers */

			var self = this;

			this.btnUpload.on('click', function() {
				self.input.trigger('click');
			});


			this.input.on('change', function() {
				var xml = self.checkVersion();
				self.param.val(xml);

				var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');
				$("body").append(iframe);

				self.form.attr("action", UP.Admin.constants.CSV_UPLOADER);
				self.form.attr("method", "post");
				self.form.attr("enctype", "multipart/form-data");
				self.form.attr("encoding", "multipart/form-data");
				self.form.attr("target", "postiframe");
				self.form.attr("file", self.input.val());
				self.form.submit();

				self.input.val("");

				var post = $('#postiframe');
				post.load(function() {
		              		var csv = post[0].contentWindow.document.body.innerHTML;
					self.csvConverter.csvToXml(csv, xml);
		                });

				return false;
			});


			this.btnDownload.on('click', function() {
				var xml = self.checkVersion();
				self.csvConverter.xmlToCsv(xml);
			});

		},

		checkVersion: function() {
			var xml = "";

			if ( this.activities.attr('checked') ) {
				xml = "activities.xml";
			} else if ( this.stages.attr('checked') ) {
				xml = "stages.xml";
			} else {  // none of them
				return false;
			}

			return xml;
		}

	};

