import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { PDFRichText } from "../../PDFRichText";
import { formatSectionTitle } from "@/lib/template-utils";

import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowProjectsProps {
  projects: Resume["projects"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowProjects: React.FC<GlowProjectsProps> = ({
  projects,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!projects || projects.length === 0) return null;

  return (
    <View key="projects" style={styles.section}>
      {((settings.projectsHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "PROJECTS",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {projects.map((project, index) => (
        <View key={project.id} style={styles.entryBlock}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                {settings.projectsListStyle === "bullet" && (
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
                {settings.projectsListStyle === "number" && (
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
                      fontFamily: settings.projectsNameBold
                        ? boldFont
                        : settings.projectsNameItalic
                          ? italicFont
                          : baseFont,
                      fontWeight: settings.projectsNameBold ? "bold" : "normal",
                      fontStyle: settings.projectsNameItalic
                        ? "italic"
                        : "normal",
                    },
                  ]}
                >
                  {project.name}
                </Text>
                {project.url && (
                  <Link src={project.url} style={{ textDecoration: "none" }}>
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
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.entryDate,
                  {
                    color: getColor("dates"),
                    fontFamily: settings.projectsDateBold
                      ? boldFont
                      : settings.projectsDateItalic
                        ? italicFont
                        : baseFont,
                    fontWeight: settings.projectsDateBold ? "bold" : "normal",
                    fontStyle: settings.projectsDateItalic
                      ? "italic"
                      : "normal",
                  },
                ]}
              >
                {project.startDate}{" "}
                {project.endDate ? `– ${project.endDate}` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.entrySummary}>
            {project.description && (
              <PDFRichText
                text={project.description}
                style={{
                  fontSize: fontSize,
                  fontFamily: baseFont,
                  marginBottom: 4,
                }}
              />
            )}

            {/* Technologies Used */}
            {project.keywords && project.keywords.length > 0 && (
              <Text
                style={{
                  fontSize: fontSize,
                  marginTop: 2,
                  marginBottom: 2,
                  color: "#333",
                  fontFamily: settings.projectsTechnologiesBold
                    ? boldFont
                    : settings.projectsTechnologiesItalic
                      ? italicFont
                      : baseFont,
                  fontWeight: settings.projectsTechnologiesBold
                    ? "bold"
                    : "normal",
                  fontStyle: settings.projectsTechnologiesItalic
                    ? "italic"
                    : "normal",
                }}
              >
                Technologies: {project.keywords.join(", ")}
              </Text>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <View style={styles.bulletList}>
                {project.highlights.map((h, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    {settings.projectsAchievementsListStyle === "bullet" && (
                      <Text style={styles.bullet}>•</Text>
                    )}
                    {settings.projectsAchievementsListStyle === "number" && (
                      <Text style={styles.bullet}>{idx + 1}.</Text>
                    )}
                    <Text
                      style={[
                        styles.bulletText,
                        {
                          fontSize,
                          fontFamily: settings.projectsFeaturesBold
                            ? boldFont
                            : settings.projectsFeaturesItalic
                              ? italicFont
                              : baseFont,
                          fontWeight: settings.projectsFeaturesBold
                            ? "bold"
                            : "normal",
                          fontStyle: settings.projectsFeaturesItalic
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
        </View>
      ))}
    </View>
  );
};
