import React from "react";
import { View, Text } from "@react-pdf/renderer";

import { LayoutSettings, TemplateStyles } from "@/components/design/types";
import { PDFRichText } from "../../PDFRichText";
import { formatSectionTitle } from "@/lib/template-utils";

interface GlowSummaryProps {
  summary: string;
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowSummary: React.FC<GlowSummaryProps> = ({
  summary,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  // boldFont,
  // italicFont,
}) => {
  if (!summary) return null;

  return (
    <View key="summary" style={styles.section}>
      {((settings.summaryHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "PROFILE",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      <View style={styles.entrySummary}>
        <PDFRichText
          text={summary}
          style={{
            fontSize: fontSize,
            fontFamily: baseFont,
            lineHeight: 1.5,
          }}
        />
      </View>
    </View>
  );
};
