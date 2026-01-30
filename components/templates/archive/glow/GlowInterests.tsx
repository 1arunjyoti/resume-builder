import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { formatSectionTitle } from "@/lib/template-utils";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowInterestsProps {
  interests: Resume["interests"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowInterests: React.FC<GlowInterestsProps> = ({
  interests,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!interests || interests.length === 0) return null;

  return (
    <View key="interests" style={styles.section}>
      {((settings.interestsHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "INTERESTS",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 15 }}>
        {interests.map((int, index) => (
          <View
            key={int.id}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {settings.interestsListStyle === "bullet" && (
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
            {settings.interestsListStyle === "number" && (
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
                fontSize: fontSize,
                fontFamily: settings.interestsNameBold
                  ? boldFont
                  : settings.interestsNameItalic
                    ? italicFont
                    : baseFont,
                fontWeight: settings.interestsNameBold ? "bold" : "normal",
                fontStyle: settings.interestsNameItalic ? "italic" : "normal",
              }}
            >
              {int.name}
            </Text>
            {int.keywords && int.keywords.length > 0 && (
              <Text
                style={{
                  fontSize: fontSize,
                  fontFamily: settings.interestsKeywordsBold
                    ? boldFont
                    : settings.interestsKeywordsItalic
                      ? italicFont
                      : baseFont,
                  fontWeight: settings.interestsKeywordsBold
                    ? "bold"
                    : "normal",
                  fontStyle: settings.interestsKeywordsItalic
                    ? "italic"
                    : "normal",
                }}
              >
                : {int.keywords.join(", ")}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
