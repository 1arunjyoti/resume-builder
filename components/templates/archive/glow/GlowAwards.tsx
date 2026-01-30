import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { formatSectionTitle } from "@/lib/template-utils";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";
import { PDFRichText } from "../../PDFRichText";

interface GlowAwardsProps {
  awards: Resume["awards"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowAwards: React.FC<GlowAwardsProps> = ({
  awards,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!awards || awards.length === 0) return null;

  return (
    <View key="awards" style={styles.section}>
      {((settings.awardsHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "AWARDS",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {awards.map((award, index) => (
        <View key={award.id} style={styles.entryBlock}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {settings.awardsListStyle === "bullet" && (
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
              {settings.awardsListStyle === "number" && (
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
                  fontFamily: settings.awardsTitleBold
                    ? boldFont
                    : settings.awardsTitleItalic
                      ? italicFont
                      : baseFont,
                  fontWeight: settings.awardsTitleBold ? "bold" : "normal",
                  fontStyle: settings.awardsTitleItalic ? "italic" : "normal",
                }}
              >
                {award.title}
              </Text>
            </View>
            <Text
              style={{
                fontSize: fontSize,
                color: getColor("dates"),
                fontFamily: settings.awardsDateBold
                  ? boldFont
                  : settings.awardsDateItalic
                    ? italicFont
                    : baseFont,
                fontWeight: settings.awardsDateBold ? "bold" : "normal",
                fontStyle: settings.awardsDateItalic ? "italic" : "normal",
              }}
            >
              {award.date}
            </Text>
          </View>
          <Text
            style={{
              fontSize: fontSize,
              marginBottom: 2,
              fontFamily: settings.awardsAwarderBold
                ? boldFont
                : settings.awardsAwarderItalic
                  ? italicFont
                  : baseFont,
              fontWeight: settings.awardsAwarderBold ? "bold" : "normal",
              fontStyle: settings.awardsAwarderItalic ? "italic" : "normal",
            }}
          >
            {award.awarder}
          </Text>
          <View style={styles.entrySummary}>
            <PDFRichText
              text={award.summary}
              style={{
                fontSize: fontSize,
                fontFamily: baseFont,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
