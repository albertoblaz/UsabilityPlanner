<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="UTF-8"/>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="usabilityPlanner">
	<xsl:apply-templates select="stages" />
</xsl:template>

<xsl:template match="stages">
	<div id="analysis-methods" class="info">
		<xsl:apply-templates select="stage" />
	</div>
</xsl:template>

<xsl:template match="stage">
	<article>
		<h3 class="headline expandable">Analysis</h3>
		<ul class="list-methods">
			<xsl:apply-templates select="method" />
		</ul>
	</article>
</xsl:template>

<xsl:template match="method">
	<li class="method hidden">
		<span class="checkboxWrapper">
			<a href="#" class="checkbox checked"></a>
			<input type="checkbox" class="hidden" />
		</span>

		<div class="method-info">
			<p class="method-title">
				<xsl:value-of select="@name" />
			</p>
			<div class="expand-button right"></div>
			<p class="valoration right">strongly recommended</p>
			<div class="meter right"><span class="green bar"></span></div>
		</div>
		
		<article class="method-description hidden">
			Collecting and analyzing detailed information about the intended users, their tasks, and the technical and environmental constraint
		</article>
	</li>
</xsl:template>

</xsl:stylesheet>
