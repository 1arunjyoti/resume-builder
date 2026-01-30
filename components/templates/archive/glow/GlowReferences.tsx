import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { formatSectionTitle } from "@/lib/template-utils";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowReferencesProps {
  references: Resume["references"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowReferences: React.FC<GlowReferencesProps> = ({
  references,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!references || references.length === 0) return null;

  return (
    <View key="references" style={styles.section}>
      {((settings.referencesHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "REFERENCES",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {references.map((ref, index) => (
        <View key={ref.id} style={styles.entryBlock}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            {settings.referencesListStyle === "bullet" && (
              <Text
                style={{
                  marginRight: 4,
                  fontSize: fontSize,
                  color: getColor("headings"),
                }}
              >
                •
              </Text>
            )}
            {settings.referencesListStyle === "number" && (
              <Text
                style={{
                  marginRight: 4,
                  fontSize: fontSize,
                  color: getColor("headings"),
                }}
              >
                {index + 1}.
              </Text>
            )}
            <Text
              style={{
                fontSize: fontSize + 1,
                fontFamily: settings.referencesNameBold
                  ? boldFont
                  : settings.referencesNameItalic
                    ? italicFont
                    : baseFont,
                fontWeight: settings.referencesNameBold ? "bold" : "normal",
                fontStyle: settings.referencesNameItalic ? "italic" : "normal",
              }}
            >
              {ref.name}
            </Text>
          </View>
          <Text
            style={{
              fontSize: fontSize,
              fontFamily: settings.referencesPositionBold
                ? boldFont
                : settings.referencesPositionItalic
                  ? italicFont
                  : baseFont,
              fontWeight: settings.referencesPositionBold ? "bold" : "normal",
              fontStyle: settings.referencesPositionItalic
                ? "italic"
                : "normal",
            }}
          >
            {ref.reference}
          </Text>
        </View>
      ))}
    </View>
  );
};
