import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { PDFRichText } from "../../PDFRichText";
import { formatDate, formatSectionTitle } from "@/lib/template-utils";

import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowExperienceProps {
  work: Resume["work"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowExperience: React.FC<GlowExperienceProps> = ({
  work,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!work || work.length === 0) return null;

  return (
    <View key="work" style={styles.section}>
      {((settings.workHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>
            {formatSectionTitle(
              "PROFESSIONAL EXPERIENCE",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {work.map((exp, index) => (
        <View key={exp.id} style={styles.entryBlock}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                {settings.experienceCompanyListStyle === "bullet" && (
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
                {settings.experienceCompanyListStyle === "number" && (
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
                  style={[
                    styles.entryTitle,
                    {
                      fontSize: fontSize + 1,
                      color: "#000",
                      fontFamily: settings.experienceCompanyBold
                        ? boldFont
                        : settings.experienceCompanyItalic
                          ? italicFont
                          : baseFont,
                      fontWeight: settings.experienceCompanyBold
                        ? "bold"
                        : "normal",
                      fontStyle: settings.experienceCompanyItalic
                        ? "italic"
                        : "normal",
                    },
                  ]}
                >
                  {exp.company}
                </Text>
                {exp.url && (
                  <Link src={exp.url} style={{ textDecoration: "none" }}>
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
              <Text
                style={[
                  styles.entrySubtitle,
                  {
                    color: "#333",
                    marginTop: 1,
                    fontFamily: settings.experiencePositionBold
                      ? boldFont
                      : settings.experiencePositionItalic
                        ? italicFont
                        : baseFont,
                    fontWeight: settings.experiencePositionBold
                      ? "bold"
                      : "normal",
                    fontStyle: settings.experiencePositionItalic
                      ? "italic"
                      : "normal",
                  },
                ]}
              >
                {exp.position}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.entryDate,
                  {
                    color: getColor("dates"),
                    fontFamily: settings.experienceDateBold
                      ? boldFont
                      : settings.experienceDateItalic
                        ? italicFont
                        : baseFont,
                    fontWeight: settings.experienceDateBold ? "bold" : "normal",
                    fontStyle: settings.experienceDateItalic
                      ? "italic"
                      : "normal",
                  },
                ]}
              >
                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
              </Text>
            </View>
          </View>

          <View style={styles.entrySummary}>
            <PDFRichText
              text={exp.summary}
              style={{
                fontSize: fontSize,
                fontFamily: baseFont,
              }}
            />
          </View>
          {exp.highlights && exp.highlights.length > 0 && (
            <View style={styles.bulletList}>
              {exp.highlights.map((h, i) => (
                <View key={i} style={styles.bulletItem}>
                  {settings.experienceAchievementsListStyle === "bullet" && (
                    <Text style={styles.bullet}>•</Text>
                  )}
                  {settings.experienceAchievementsListStyle === "number" && (
                    <Text style={styles.bullet}>{i + 1}.</Text>
                  )}
                  <Text
                    style={[
                      styles.bulletText,
                      {
                        fontFamily: settings.experienceAchievementsBold
                          ? boldFont
                          : settings.experienceAchievementsItalic
                            ? italicFont
                            : baseFont,
                        fontWeight: settings.experienceAchievementsBold
                          ? "bold"
                          : "normal",
                        fontStyle: settings.experienceAchievementsItalic
                          ? "italic"
                          : "normal",
                      },
                    ]}
                  >
                    {h}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};
