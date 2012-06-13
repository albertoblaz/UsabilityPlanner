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
	<nav class="tabs">
		<xsl:apply-templates select="activity" />
		<div class="clear"></div>
	</nav>
</xsl:template>

<xsl:template match="activity[1]">
	<div class="tab three-columns tab-active">
		<p>
			<xsl:value-of select="@name" />
		</p>
	</div>
</xsl:template>

<xsl:template match="activity">
	<div class="tab three-columns">
		<p>
			<xsl:value-of select="@name" />
		</p>
	</div>
</xsl:template>

</xsl:stylesheet>
