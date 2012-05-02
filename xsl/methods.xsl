<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="ISO-8859-1"/>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="usabilityPlanner">
	<xsl:apply-templates select="activities" />
</xsl:template>

<xsl:template match="activities">
	<xsl:apply-templates select="activity" />
</xsl:template>

<xsl:template match="activity">
	<xsl:variable name="activityName" select="@name" />
	<div class="info-activity" id="{$activityName}">
		<h2 class="headline expandable">
			<xsl:value-of select="@name" />
		</h2>

		<xsl:apply-templates select="subactivity" />
	</div>
</xsl:template>

<xsl:template match="subactivity">
	<article class="info-subactivity hidden">
		<header>
			<h3 class="headline small expandable">
				<xsl:value-of select="@name" />
			</h3>
		</header>

		<ul class="list-methods">
			<xsl:apply-templates select="method" />
		</ul>
	</article>
</xsl:template>

<xsl:template match="method">
	<li class="method">
		<span class="checkboxWrapper"><a href="#" class="checkbox checked"></a><input type="checkbox" class="hidden" /></span>

		<div class="method-info">
			<p class="method-title">
				<xsl:value-of select="@name" />
			</p>
			<div class="expand-button right"></div>
			<p class="valoration right">strongly recommended</p>
			<div class="meter right"><span class="green bar"></span></div>
		</div>
										
		<article class="method-description hidden">
			<xsl:value-of select="@description" />
		</article>
	</li>
</xsl:template>

</xsl:stylesheet>
