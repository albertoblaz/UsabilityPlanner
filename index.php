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
			<a target="_blank" href="http://usabilityplanner.org/">
				<figure class="logo left">
					<img src="images/logo.gif" />
				</figure>
			</a>
			
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
						<h2 class="sub headline center"><a href="#">(Why we speak about activities and not stages)</a></h2>
					</hgroup>
				</header>
				
				<div class="content">

					<nav class="tabs">
						<div class="tab three-columns tab-active">
							<p>Analysis</p>
						</div>
						
						<div class="tab three-columns">
							<p>Design</p>
						</div>
						
						<div class="tab three-columns last-tab">
							<p>Evaluation</p>
						</div>
						
						<div class="clear"></div>
					</nav>   <!-- end #tabs -->

					
					<section id="activities-selection">
					
<?php
$xml = new DomDocument();
$xml->load('xml/projectStagesDataDevelopers.xml');

$activities = new DomDocument();
$activities->load('xsl/activities.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($activities);

echo($proc->transformToXML($xml));
?>

					</section>   <!-- #activities-selection -->

				</div>   <!-- #content -->
			
			</article>   <!-- #activities -->

			<article id="methods" class="main-content">
				<header>
					<h1 class="main headline center">Specify the constraints that will influence which usability methods are appropiate in your situation</h1>
				</header>

				<div class="recommendation">
					<div class="inner-recommendation">
						<p class="title">Method Filtering</p>
						<div class="filter">
							<p>Most Recommended</p>
							<div id="slider"></div>
							<p>All methods</p>
						</div>
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
						
						<div class="filtering">						
							<p class="total-counter"><label class="filter-count">18</label> methods shown:</p>
<?php
$counters = new DomDocument();
$counters->load('xsl/counters.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($counters);

echo($proc->transformToXML($xml));
?>
							
							<div class="right">
								<p id="expand"   class="expand-all">Expand All</p>
								<p id="collapse" class="expand-all">Collapse All</p>
							</div>
						</div>
						
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
							<a href="/php/download-plan.php"> <span>Download plan</span> </a>
						</div>

						<!-- input type="file" class="invisible" id="files" name="files" /-->
						<form id="theuploadform" class="invisible">
							<input type="file"   id="files"      class="invisible" name="files" />
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

	<script type="text/javascript" src="js/init.js"></script>
	<script type="text/javascript" src="js/models.js"></script>
	<script type="text/javascript" src="js/controllers.js"></script>
	<script type="text/javascript" src="js/collections.js"></script>
	<script type="text/javascript" src="js/parser.js"></script>
	<script type="text/javascript" src="js/filemanager.js"></script>
	<script type="text/javascript" src="js/app.js"></script>

	<!-- script type="text/javascript" src="js/script.js"></script -->
</body>
	
</html>