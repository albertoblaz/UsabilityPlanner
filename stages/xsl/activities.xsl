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

<xsl:template match="activity[1]">
	<article class="activity">
		<div class="padding">
			<p class="description">
				<xsl:value-of select="@description" />
			</p>
			<br />

			<h4 class="headline">Subactivities</h4>

			<ul>
				<xsl:apply-templates select="subactivity" />
			</ul>
		</div>
	</article>
</xsl:template>

<xsl:template match="activity">
	<article class="activity hidden">
		<div class="padding">
			<p class="description">
				<xsl:value-of select="@description" />
			</p>
			<br />

			<h4 class="headline">Subactivities</h4>

			<ul>
				<xsl:apply-templates select="subactivity" />
			</ul>
		</div>
	</article>
</xsl:template>

<xsl:template match="subactivity">
	<li class="subactivity">
		<span class="checkboxWrapper">
			<a href="#" class="checkbox"></a>
			<input type="checkbox" class="hidden" />
		</span>

		<label>
			<xsl:value-of select="@name" />
		</label>

		<p class="description right">
			<xsl:value-of select="@description" />
		</p>
	</li>
</xsl:template>

</xsl:stylesheet>
