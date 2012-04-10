$(document).ready(function() {

function loadXMLDoc(dname) {
	/*
	if (window.XMLHttpRequest)
	{
		xhr = new XMLHttpRequest();
	}
	else
	{
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xhr.open("GET",dname,false);
	xhr.send("");
	return xhr.responseXML;
	*/
	$.get(dname);

	$.ajaxSetup({
		'beforeSend' : function(xhr) {
			xhr.overrideMimeType('text/xml; charset=UTF-8');
		}
	});
}

function displayResult() {
	xml = loadXMLDoc("xml/projectStagesDataDevelopers.xml");
	xsl = loadXMLDoc("xsl/constraints.xsl");
	
	
	if (window.ActiveXObject)   // code for IE
	{
		resultDocument = xml.transformNode(xsl);
		document.getElementById("constraints-selection").innerHTML = resultDocument;
	}
	else if (document.implementation && document.implementation.createDocument)
	{   // code for Mozilla, Firefox, Opera, etc.
		xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsl);
		resultDocument = xsltProcessor.transformToFragment(xml,document);
		document.getElementById("constraints-selection").appendChild(resultDocument);
	}
	
	//$('constraints-selection').html(resultDocument);
}

displayResult();
	
});