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
	<xsl:apply-templates select="subactivity" />
</xsl:template>


<xsl:template match="subactivity">
	<tr>
		<td>
			<xsl:value-of select="@name" />
		</td>

		<xsl:apply-templates select="costBenefit" />
	</tr>
</xsl:template>


<xsl:template match="costBenefit">
	<td>
		<span class="checkboxWrapper">
			<a href="#" class="checkbox"></a>
			<input type="checkbox" class="hidden" />
		</span>
	</td>
</xsl:template>


</xsl:stylesheet>
