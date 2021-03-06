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
		<h2 class="headline expandable hidden">
			<xsl:value-of select="@name" />
			(<label class="counter">0</label>)
		</h2>

		<xsl:apply-templates select="subactivity" />
	</div>
</xsl:template>

<xsl:template match="subactivity">
	<article class="info-subactivity hidden">
		<header>
			<h3 class="headline small expandable left">
				<xsl:value-of select="@name" />
			</h3>

			<ul class="cost-indicator left">
			</ul>

			<div class="clear"></div>
		</header>

		<ul class="list-methods">
			<xsl:apply-templates select="method" />
		</ul>
	</article>
</xsl:template>

<xsl:template match="method">
	<li class="method visible">
		<div class="method-info left">
			<div class="expand-button left"></div>
			<p class="method-title">
				<xsl:value-of select="@name" />
			</p>
			<p class="valoration right">neutral</p>
			<div class="meter right"><span class="bar orange"></span></div>
		</div>
		
		<input type="checkbox" checked="checked" />

		<div class="clear"></div>
		
		<article class="method-description hidden"></article>
	</li>
</xsl:template>

</xsl:stylesheet>
