import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";
import { PDFRichText } from "../../PDFRichText";
import { formatSectionTitle } from "@/lib/template-utils";

interface GlowCustomProps {
  custom: Resume["custom"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowCustom: React.FC<GlowCustomProps> = ({
  custom,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!custom) return null;

  return (
    <>
      {custom.map((section) => {
        if (!section.items || section.items.length === 0) return null;

        return (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionTitleWrapper}>
              <Text
                style={[styles.sectionTitle, { color: getColor("headings") }]}
              >
                {formatSectionTitle(
                  section.name,
                  settings.sectionHeadingCapitalization,
                )}
              </Text>
            </View>
            {section.items.map((item, index) => (
              <View key={item.id} style={styles.entryBlock}>
                <View style={styles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "baseline" }}
                    >
                      {settings.customSectionListStyle === "bullet" && (
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
                      {settings.customSectionListStyle === "number" && (
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
                          fontFamily: settings.customSectionNameBold
                            ? boldFont
                            : settings.customSectionNameItalic
                              ? italicFont
                              : baseFont,
                          fontWeight: settings.customSectionNameBold
                            ? "bold"
                            : "normal",
                          fontStyle: settings.customSectionNameItalic
                            ? "italic"
                            : "normal",
                        }}
                      >
                        {item.name}
                      </Text>
                      {item.url && (
                        <Link src={item.url} style={{ textDecoration: "none" }}>
                          <Text
                            style={{
                              fontSize: fontSize - 2,
                              color: getColor("links"),
                              marginLeft: 5,
                            }}
                          >
                            ↗
                          </Text>
                        </Link>
                      )}
                    </View>

                    {item.description && (
                      <Text
                        style={{
                          fontSize: fontSize,
                          marginBottom: 1,
                          marginTop: 1,
                          fontFamily: settings.customSectionDescriptionBold
                            ? boldFont
                            : settings.customSectionDescriptionItalic
                              ? italicFont
                              : baseFont,
                          fontWeight: settings.customSectionDescriptionBold
                            ? "bold"
                            : "normal",
                          fontStyle: settings.customSectionDescriptionItalic
                            ? "italic"
                            : "normal",
                        }}
                      >
                        {item.description}
                      </Text>
                    )}
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: fontSize,
                        color: getColor("dates"),
                        fontFamily: settings.customSectionDateBold
                          ? boldFont
                          : settings.customSectionDateItalic
                            ? italicFont
                            : baseFont,
                        fontWeight: settings.customSectionDateBold
                          ? "bold"
                          : "normal",
                        fontStyle: settings.customSectionDateItalic
                          ? "italic"
                          : "normal",
                      }}
                    >
                      {item.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.entrySummary}>
                  <PDFRichText
                    text={item.summary}
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
      })}
    </>
  );
};
