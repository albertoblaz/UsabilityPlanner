<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="ISO-8859-1"/>


<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>


<xsl:template match="usabilityPlanner">
	<tr class="table-heads">
		<xsl:apply-templates select="costBenefits" />
	</tr>

	<tr class="table-heads hidden">
		<xsl:apply-templates select="businessRisks" />
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


<xsl:template match="businessRisks">
	<th>
		<xsl:value-of select="@name" />
	</th>

	<xsl:apply-templates select="risk" />
</xsl:template>


<xsl:template match="risk">
	<th>
		<xsl:value-of select="@name" />
	</th>
</xsl:template>


</xsl:stylesheet>
