<!DOCTYPE html>
<html lang="en">

<head>

	<!-- Meta -->
	<meta charset="utf-8" />
	<meta name="description" content="Usability Planner, a tool for helping developers and designers" />
	<meta name="generator" content="Espresso 2" />

	<!-- Title -->
	<title>Usability Planner</title>

	<!-- CSS -->
	<link media="all" rel="stylesheet" type="text/css" href="css/styles.css" />

</head>


<body>

	<div class="wrapper">
		<header class="header">
			<figure class="logo left">
				<img src="images/logo.gif" />
			</figure>
			
			<nav id="navigation">
				<ul class="right">
					<li class="nav-item"><a href="#" class="nav-link back">Back</a></li>
					<li class="nav-item"><a href="#" class="nav-link next">Next</a></li>
				</ul>
				
				<ul class="stages">
					<li class="stage first current-stage">
						<a href="#activities" class="nav-link button">Activities</a>
					</li>
					<li class="stage">
						<a href="#methods" class="nav-link button">Methods</a>
					</li>
					<li class="stage last">
						<a href="#plan"    class="nav-link button">Your Plan</a>
					</li>
				</ul>
			</nav>   <!-- end #navigation -->
			
			<div class="clear"></div>
		</header>
		<!-- end .header -->
	
	
		
		<section class="main-container">
			<div class="container">
			
			<article id="activities" class="main-content">
				<header>
					<hgroup>
						<h1 class="main headline center">Choose the activities where you want to introduce usability improvements in your project</h1>
					</hgroup>
				</header>
				
				<div class="content">


<?php
$xml = new DomDocument();
$xml->load('xml/stages.xml');

$tabs = new DomDocument();
$tabs->load('xsl/tabs.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($tabs);

echo($proc->transformToXML($xml));
?>
					

					
					<section id="activities-selection">
					
<?php
/*
$activities = new DomDocument();
$activities->load('xsl/activities.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($activities);

echo($proc->transformToXML($xml));
*/
?>
					</section>   <!-- #activities-selection -->


					<section id="costs-selection">
					
						<table border="0" cellspacing="0" cellpadding="0">
<thead>


<?php
$tableHead = new DomDocument();
$tableHead->load('xsl/table-head.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($tableHead);

echo($proc->transformToXML($xml));
?>

</thead>

<tbody>

<?php
$tableBody = new DomDocument();
$tableBody->load('xsl/table-body.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($tableBody);

echo($proc->transformToXML($xml));
?>

</tbody>
						</table>

					</section>   <!-- #costs-selection -->


				</div>   <!-- #content -->
			
			</article>   <!-- #activities -->

			<article id="methods" class="main-content">
				<header>
					<h1 class="main headline center">Specify the constraints that will influence which usability methods are appropiate in your situation</h1>
				</header>

				<div class="filtering">		
					<div class="filtering-inner">
						<p class="total-counter"><label class="filter-count">0</label> methods shown:</p>
<?php
$counters = new DomDocument();
$counters->load('xsl/counters.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($counters);

echo($proc->transformToXML($xml));
?>
					</div>
				</div>

				<div class="content">

					<aside id="constraints-selection" class="left">
<?php
$constraints = new DomDocument();
$constraints->load('xsl/constraints.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($constraints);

echo($proc->transformToXML($xml));
?>
					</aside>

					<section id="methods-selection" class="left">
					
						<div class="recommendation">
							<!--p class="title left">Method Filtering</p-->
							<div class="filter right">
								<p class="right">All methods</p>
								<div id="slider" class="right"></div>
								<p class="right">Most Recommended</p>
							</div>
						</div>

						<div class="clear"></div>
						
						<div class="expand-buttons left">
							<p id="expand"   class="expand-all">Expand All</p>
							<p id="collapse" class="expand-all">Collapse All</p>
						</div>
						
						<br />

<?php
$methods = new DomDocument();
$methods->load('xsl/methods.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($methods);

echo($proc->transformToXML($xml));
?>

					</section>   <!-- #techniques -->
					
				</div>   <!-- #content -->

			</article>   <!-- #methods -->
						
			<article id="plan" class="main-content">
				<header>
					<h1 class="main headline center">This is your plan of usability methods. If you wish, you can download it or change the weights</h1>
				</header>

				<div class="content">
					<div class="btn-container right">

						<div class="button right" id="btn-upload">
							<p class="message">Upload a plan file</p>
						</div>

						<div class="button right" id="btn-download">
							<p>Download plan</p>
						</div>

						<form id="theuploadform" class="invisible">
							<input type="file"   id="userfile"   class="invisible" name="files" />
							<input type="submit" id="formsubmit" class="invisible" value="Send File" />
						</form>

						<div class="clear"></div>
					</div>

					<div>


<?php
$methods = new DomDocument();
$methods->load('xsl/methods.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($methods);

echo($proc->transformToXML($xml));
?>
					</div>

				</div>   <!-- #content -->

			</article>   <!-- #plan -->

			</div>   <!-- end .container -->
			
			<footer id="footer" class="center">	
				<nav>
					<ul class="links">
						<li class="link"><a href="#">UX Professionals version</a></li>
						<li class="link"><a href="#">iPad version</a></li>
						<li class="link"><a href="#">Usability Guide</a></li>
						<li class="link"><a href="#">About</a></li>
						<li class="link"><a href="#">Feedback</a></li>
					</ul>
				</nav>
				
				<div class="copyright">
					<p>&copy; Usability Planner, 2012</p>
				</div>
			</footer>
			<!-- end #footer -->
			
		</section>
		<!-- end .container wrapper -->

	</div>


	<!-- JavaScript -->
	<script type="text/javascript" src="js/lib/html5shiv.js"></script>
	<script type="text/javascript" src="js/lib/json2.js"></script>
	<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="js/lib/jquery-ui-1.8.20.min.js"></script>
	<script type="text/javascript" src="js/lib/underscore-1.3.3.min.js"></script>
	<script type="text/javascript" src="js/lib/backbone-0.9.2.min.js"></script>


	<script type="text/javascript" src="js/constants.js"></script>

	<script type="text/javascript" src="js/models.js"></script>
	<script type="text/javascript" src="js/controllers.js"></script>
	<script type="text/javascript" src="js/collections.js"></script>

	<script type="text/javascript" src="js/plan.js"></script>

	<script type="text/javascript" src="js/xml-parser.js"></script>
	<script type="text/javascript" src="js/csv-parser.js"></script>
	<script type="text/javascript" src="js/file-manager.js"></script>
	<script type="text/javascript" src="js/planner.js"></script>

	<script type="text/javascript" src="js/recommender.js"></script>
	<script type="text/javascript" src="js/facade-controller.js"></script>

	<script type="text/javascript" src="js/main.js"></script>

	<!-- script type="text/javascript" src="js/script.js"></script -->
</body>
	
</html>