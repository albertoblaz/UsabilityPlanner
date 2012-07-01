
<?php
/*
	$version = "Activities";
	$versionOpposite = "Stages";
*/
	$version = "Stages";
	$versionOpposite = "Activities";


	$versionLowercase = strtolower($version);

	$path = '../assets/';

	$xml = new DomDocument();
	$xml->load( $path . 'xml/' . $versionLowercase . '.xml');
?>



<!DOCTYPE html>
<html lang="en" manifest=" <?php echo $path . 'offline'; ?> ">

<head>

	<!-- Title -->
	<title>Usability Planner</title>


	<!-- CSS -->
	<link media="all" rel="stylesheet" type="text/css" href=" <?php echo $path . 'css/styles.css'; ?> " />


	<!-- Meta -->
	<meta charset="utf-8" />

	<meta name="author" content="Xavier Ferre, Nigel Bevan, Alberto Blazquez" />
	<meta name="description" content="Usability Planner, a tool for helping developers and designers" />
	<meta name="generator" content="Espresso 2" />

	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">

	<link rel="apple-touch-icon-precomposed" href=" <?php echo $path . 'images/ipad-icon.png'; ?> ">
	<link rel="apple-touch-icon-precomposed" sizes="72x72" href=" <?php echo $path . 'images/ipad-icon.png'; ?> ">
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href=" <?php echo $path . 'images/ipad-icon@2x.png'; ?> ">

	<link rel="shortcut icon" href=" <?php echo $path . 'images/favicon.ico'; ?> ">
	<link rel="icon" href=" <?php echo $path . 'images/favicon.ico'; ?> ">

</head>


<body>

	<div class="wrapper">
		<header class="header">
			<figure class="logo left"></figure>
			
			<nav id="navigation">
				<ul class="right">
					<li class="nav-item"><a href="#" class="nav-link back">Back</a></li>
					<li class="nav-item"><a href="#" class="nav-link next">Next</a></li>
				</ul>
				
				<ul class="stages">
					<li class="stage current-stage">
						<a href="#activities" class="nav-link button"> <?php echo $version; ?> </a>
					</li>
					<li class="stage">
						<a href="#methods" class="nav-link button">Methods</a>
					</li>
					<li class="stage">
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
				<header class="header-act">

					<div>
						<hgroup class="act-header">
							<h2 class="main headline center">Choose the <?php echo $versionLowercase; ?> where you want to introduce usability improvements in your project</h2>
							<h3 class="small headline center">Optionally, prioritize the <?php echo $versionLowercase; ?> where usability will provide most benefit</h3>
						</hgroup>

						<h2 class="act-header main headline center hidden">At which <?php echo $versionLowercase; ?> of design and development would using UCD methods be most likely to improve usability?</h2>

<?php
	if ( $versionLowercase === "stages" ) {
		echo '<div class="prio right">
			<button class="btn-prioritize" type="button"><p>Prioritize ' . $versionLowercase . '</p><p class="hidden">Back to ' . $versionLowercase . ' selection</p></button>	
			</div>
		<div class="clear"></div>';
	}
?>

					</div>


				</header>
				

				<div class="act-buttons">
					<div class="hidden act-button tab tab-active"><p>Prioritize <?php echo $versionLowercase; ?> (Cost Benefits)</p></div>
					<div class="hidden act-button tab"><p>Prioritize <?php echo $versionLowercase; ?> (Business Risks)</p></div>
				</div>


				<div class="content">

					<div class="activities-panel">
						<nav class="tabs">
<?php
$tabs = new DomDocument();
$tabs->load( $path . 'xsl/tabs.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($tabs);

echo($proc->transformToXML($xml));
?>
						</nav>
				
						<section id="activities-selection">
<?php
$activities = new DomDocument();
$activities->load( $path . 'xsl/' . $versionLowercase . '.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($activities);

echo($proc->transformToXML($xml));
?>
						</section>   <!-- #activities-selection -->

					</div>


					<div class="activities-panel hidden">

						<section id="costs-selection">
						
							<table border="0" cellspacing="0" cellpadding="0">
								<thead>
<?php
$tableHead = new DomDocument();
$tableHead->load( $path . 'xsl/table-head.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($tableHead);

echo($proc->transformToXML($xml));
?>
								</thead>


								<tbody>

<?php
$tableBody = new DomDocument();
$tableBody->load( $path . 'xsl/table-body.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($tableBody);

echo($proc->transformToXML($xml));
?>
								</tbody>
							</table>

						</section>   <!-- #costs-selection -->

					</div>

				</div>   <!-- #content -->
			
			</article>   <!-- #activities -->

			<article id="methods" class="main-content">
				<header>
					<h2 class="main headline center">Specify the constraints that will influence which usability methods are appropiate in your situation</h2>
				</header>

				<div class="filtering">		
					<div class="filter adjusted-block">
						<p   class="left">Show most recommended</p>
						<div class="left" id="slider"></div>
						<p   class="left">Show all methods</p>

						<div class="clear"></div>
					</div>
				</div>

				<div class="content">

					<aside id="constraints-selection" class="left">
<?php
$constraints = new DomDocument();
$constraints->load( $path . 'xsl/constraints.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($constraints);

echo($proc->transformToXML($xml));
?>
					</aside>

					<section id="methods-selection" class="left">

						<div class="adjusted-block">
							<div class="left">
								<p id="expand"   class="expand-all">Expand All</p>
								<p id="collapse" class="expand-all">Collapse All</p>
							</div>
						
							<div class="right total-counter">
								<p><label class="filter-count">0</label> methods shown</p>
							</div>

							<div class="clear"></div>
						</div>


						<div class="links-activities">
							<p class="inline">Index: </p>
<?php
$counters = new DomDocument();
$counters->load( $path . 'xsl/links-activities.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($counters);

echo($proc->transformToXML($xml));
?>				

						</div>


						<div>

<?php
$methods = new DomDocument();
$methods->load( $path . 'xsl/methods.xsl');

$proc = new xsltprocessor();
$proc->importStyleSheet($methods);

echo($proc->transformToXML($xml));
?>
						</div>
					</section>   <!-- #techniques -->
					
				</div>   <!-- #content -->

			</article>   <!-- #methods -->
						
			<article id="plan" class="main-content">
				<header>
					<h2 class="main headline center">This is your plan of usability methods. If you wish, you can download it or change the weights</h2>
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

					<div class="clear"></div>

					<div>


<?php
$methods = new DomDocument();
$methods->load( $path . 'xsl/methods.xsl');

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
						<li class="link"><a target="_blank" href="..">Home</a></li>
						<?php 
							echo '<li class="link"><a target="_blank" href="../' . 
								strtolower($versionOpposite) .
								'/">' . $versionOpposite . ' version</a></li>';
						?>
						<li class="link"><a target="_blank" href="../about.html">About</a></li>
						<li class="link"><a target="_blank" href="../feedback.html">Feedback</a></li>
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
	<script type="text/javascript" src="<?php echo $path . 'js/lib/html5shiv.js' ?>"></script>
	<script type="text/javascript" src="<?php echo $path . 'js/lib/json2.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/lib/jquery-1.7.1.min.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/lib/jquery-ui-1.8.20.min.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/lib/underscore-1.3.3.min.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/lib/backbone-0.9.2.min.js'; ?> "></script>


	<script type="text/javascript" src="js/constants.js"></script>

	<script type="text/javascript" src="<?php echo $path . 'js/models.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/controllers.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/collections.js'; ?> "></script>

	<script type="text/javascript" src="<?php echo $path . 'js/plan.js'; ?> "></script>

	<script type="text/javascript" src="<?php echo $path . 'js/xml-parser.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/csv-parser.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/file-manager.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/planner.js'; ?> "></script>

	<script type="text/javascript" src="<?php echo $path . 'js/recommender.js'; ?> "></script>
	<script type="text/javascript" src="<?php echo $path . 'js/facade-controller.js'; ?> "></script>

	<script type="text/javascript" src="<?php echo $path . 'js/main.js'; ?> "></script>

</body>
	
</html>
