<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="ISO-8859-1"/>


<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>


<xsl:template match="usabilityPlanner">
	<tr>
		<xsl:apply-templates select="costBenefits" />
	</tr>
</xsl:template>


<xsl:template match="costBenefits">
	<th>
		<xsl:value-of select="@name" />
	</th>

	<xsl:apply-templates select="costBenefit" />
</xsl:template>


<xsl:template match="costBenefit">
	<th>
		<xsl:value-of select="@name" />
	</th>
</xsl:template>


</xsl:stylesheet>
