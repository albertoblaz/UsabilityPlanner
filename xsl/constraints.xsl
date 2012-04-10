<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="ISO-8859-1"/>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="usabilityPlanner">
	<xsl:apply-templates select="projectConstraints" />
</xsl:template>

<xsl:template match="projectConstraints">
	<article class="constraints">
		<h4 class="headline small underlined">Constraints</h4>
		<ul>
			<p><xsl:apply-templates select="projectConstraint" /></p>
		</ul>
	</article>
</xsl:template>

</xsl:stylesheet>
