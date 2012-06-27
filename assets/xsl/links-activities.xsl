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
	<xsl:variable name="link" select="concat('#', $activityName)" />

	<a class="link-activity" href="{$link}">
		<xsl:value-of select="$activityName" />
	</a>
</xsl:template>

</xsl:stylesheet>
