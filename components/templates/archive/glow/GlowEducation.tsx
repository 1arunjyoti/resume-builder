import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { formatDate, formatSectionTitle } from "@/lib/template-utils";

import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowEducationProps {
  education: Resume["education"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowEducation: React.FC<GlowEducationProps> = ({
  education,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!education || education.length === 0) return null;

  return (
    <View key="education" style={styles.section}>
      {((settings.educationHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>
            {formatSectionTitle(
              "EDUCATION",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {education.map((edu, index) => (
        <View key={edu.id} style={styles.entryBlock}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                {settings.educationInstitutionListStyle === "bullet" && (
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
                {settings.educationInstitutionListStyle === "number" && (
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
                {/* Glow puts Degree (studyType) as main title usually, but let's check what 'settings.educationInstitutionBold' implies.
                    Usually Institution = School. Degree = StudyType.
                    If Glow currently puts StudyType as title, we should probably stick to that structure but use correct settings?
                    Or swap them to match Classic?
                    The user requested "customization supports", not "layout change".
                    I will keep StudyType as Title, but use `educationDegree*` settings for it.
                    And Institution as Subtitle, using `educationInstitution*` settings.
                */}
                <Text
                  style={[
                    styles.entryTitle,
                    {
                      fontSize: fontSize + 1,
                      fontFamily: settings.educationDegreeBold
                        ? boldFont
                        : settings.educationDegreeItalic
                          ? italicFont
                          : baseFont,
                      fontWeight: settings.educationDegreeBold
                        ? "bold"
                        : "normal",
                      fontStyle: settings.educationDegreeItalic
                        ? "italic"
                        : "normal",
                    },
                  ]}
                >
                  {edu.studyType}
                </Text>
              </View>

              <Text
                style={[
                  styles.entrySubtitle,
                  {
                    marginTop: 1,
                    fontFamily: settings.educationInstitutionBold
                      ? boldFont
                      : settings.educationInstitutionItalic
                        ? italicFont
                        : baseFont,
                    fontWeight: settings.educationInstitutionBold
                      ? "bold"
                      : "normal",
                    fontStyle: settings.educationInstitutionItalic
                      ? "italic"
                      : "normal",
                    color: "#333",
                  },
                ]}
              >
                {edu.institution}
              </Text>
              {edu.area && (
                <Text
                  style={{
                    fontSize: fontSize,
                    fontFamily: settings.educationAreaBold
                      ? boldFont
                      : settings.educationAreaItalic
                        ? italicFont
                        : baseFont,
                    fontWeight: settings.educationAreaBold ? "bold" : "normal",
                    fontStyle: settings.educationAreaItalic
                      ? "italic"
                      : "normal",
                    color: "#333",
                  }}
                >
                  {edu.area}
                </Text>
              )}
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.entryDate,
                  {
                    color: getColor("dates"),
                    fontFamily: settings.educationDateBold
                      ? boldFont
                      : settings.educationDateItalic
                        ? italicFont
                        : baseFont,
                    fontWeight: settings.educationDateBold ? "bold" : "normal",
                    fontStyle: settings.educationDateItalic
                      ? "italic"
                      : "normal",
                  },
                ]}
              >
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </Text>
            </View>
          </View>

          {edu.score && (
            <Text
              style={{
                fontSize: fontSize,
                marginTop: 1,
                fontFamily: settings.educationGpaBold
                  ? boldFont
                  : settings.educationGpaItalic
                    ? italicFont
                    : baseFont,
                fontWeight: settings.educationGpaBold ? "bold" : "normal",
                fontStyle: settings.educationGpaItalic ? "italic" : "normal",
              }}
            >
              GPA: {edu.score}
            </Text>
          )}

          {edu.courses && edu.courses.length > 0 && (
            <View style={{ marginTop: 2 }}>
              <Text
                style={{
                  fontSize: fontSize,
                  fontFamily: settings.educationCoursesBold
                    ? boldFont
                    : settings.educationCoursesItalic
                      ? italicFont
                      : baseFont,
                  fontWeight: settings.educationCoursesBold ? "bold" : "normal",
                  fontStyle: settings.educationCoursesItalic
                    ? "italic"
                    : "normal",
                }}
              >
                Courses: {edu.courses.join(", ")}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};
