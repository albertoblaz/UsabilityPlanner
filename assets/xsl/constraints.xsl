<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="ISO-8859-1"/>

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="usabilityPlanner">
	<xsl:apply-templates select="constraints" />
</xsl:template>

<xsl:template match="constraints">
	<xsl:apply-templates select="constraintsGroup" />
</xsl:template>

<xsl:template match="constraintsGroup">
	<article class="constraints">
		<h3 class="headline small underlined">
			<xsl:value-of select="@name" />
		</h3>
		<ul>
			<xsl:apply-templates select="constraint" />
		</ul>
	</article>
</xsl:template>

<xsl:template match="constraint">
	<li class="constraint">
		<span class="checkboxWrapper">
			<a href="#" class="checkbox"></a>
			<input type="checkbox" class="hidden" />
		</span>
		<label class="label-constraint">
			<xsl:value-of select="@name" />
			<span class="tooltip">
				<xsl:value-of select="@description" />
			</span>
		</label>
	</li>
</xsl:template>

</xsl:stylesheet>
