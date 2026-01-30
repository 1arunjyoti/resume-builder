import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { formatSectionTitle } from "@/lib/template-utils";
import { PDFRichText } from "../../PDFRichText";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowPublicationsProps {
  publications: Resume["publications"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowPublications: React.FC<GlowPublicationsProps> = ({
  publications,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!publications || publications.length === 0) return null;

  return (
    <View key="publications" style={styles.section}>
      {((settings.publicationsHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "PUBLICATIONS",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {publications.map((pub, index) => (
        <View key={pub.id} style={styles.entryBlock}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              {settings.publicationsListStyle === "bullet" && (
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
              {settings.publicationsListStyle === "number" && (
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
                  fontFamily: settings.publicationsNameBold
                    ? boldFont
                    : settings.publicationsNameItalic
                      ? italicFont
                      : baseFont,
                  fontWeight: settings.publicationsNameBold ? "bold" : "normal",
                  fontStyle: settings.publicationsNameItalic
                    ? "italic"
                    : "normal",
                }}
              >
                {pub.name}
              </Text>
              {pub.url && (
                <Link src={pub.url}>
                  <Text
                    style={{
                      fontSize: fontSize - 1,
                      color: getColor("links"),
                      marginLeft: 4,
                      fontFamily: settings.publicationsUrlBold
                        ? boldFont
                        : settings.publicationsUrlItalic
                          ? italicFont
                          : baseFont,
                      fontWeight: settings.publicationsUrlBold
                        ? "bold"
                        : "normal",
                      fontStyle: settings.publicationsUrlItalic
                        ? "italic"
                        : "normal",
                    }}
                  >
                    ↗
                  </Text>
                </Link>
              )}
            </View>
            <Text
              style={{
                fontSize: fontSize,
                color: getColor("dates"),
                fontFamily: settings.publicationsDateBold
                  ? boldFont
                  : settings.publicationsDateItalic
                    ? italicFont
                    : baseFont,
                fontWeight: settings.publicationsDateBold ? "bold" : "normal",
                fontStyle: settings.publicationsDateItalic
                  ? "italic"
                  : "normal",
              }}
            >
              {pub.releaseDate}
            </Text>
          </View>
          <Text
            style={{
              fontSize: fontSize,
              marginTop: 1,
              fontFamily: settings.publicationsPublisherBold
                ? boldFont
                : settings.publicationsPublisherItalic
                  ? italicFont
                  : baseFont,
              fontWeight: settings.publicationsPublisherBold
                ? "bold"
                : "normal",
              fontStyle: settings.publicationsPublisherItalic
                ? "italic"
                : "normal",
            }}
          >
            {pub.publisher}
          </Text>
          <View style={styles.entrySummary}>
            <PDFRichText
              text={pub.summary}
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
