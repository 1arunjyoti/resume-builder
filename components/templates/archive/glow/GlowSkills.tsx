import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { getLevelScore, formatSectionTitle } from "@/lib/template-utils";

import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowSkillsProps {
  skills: Resume["skills"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
  lineHeight: number;
}

const RenderLevel = ({
  level,
  levelStyle,
  decorationColor,
  fontSize,
}: {
  level: string;
  levelStyle: number;
  decorationColor: string;
  fontSize: number;
}) => {
  if (!level || levelStyle === 0) return null;
  const score = getLevelScore(level); // 1-5
  const max = 5;

  // Style 1: Dots
  if (levelStyle === 1) {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          marginLeft: 6,
        }}
      >
        {[...Array(max)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i < score ? decorationColor : "#ddd",
            }}
          />
        ))}
      </View>
    );
  }

  // Style 3: Signal Bars
  if (levelStyle === 3) {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          alignItems: "flex-end",
          height: 10,
          marginLeft: 6,
        }}
      >
        {[...Array(max)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 4,
              height: (i + 1) * 2,
              backgroundColor: i < score ? decorationColor : "#ddd",
            }}
          />
        ))}
      </View>
    );
  }
  // Style 4: Text
  return (
    <Text
      style={{
        fontSize: fontSize - 1,
        color: "#333",
        fontStyle: "italic",
        marginLeft: 6,
      }}
    >
      ({level})
    </Text>
  );
};

export const GlowSkills: React.FC<GlowSkillsProps> = ({
  skills,
  settings,
  styles,
  getColor,
  fontSize,
  lineHeight,
  boldFont,
  // italicFont,
}) => {
  if (!skills || skills.length === 0) return null;

  const listStyle = settings.skillsListStyle; // "bullet", "number", "inline", "blank"
  const levelStyle = settings.skillsLevelStyle ?? 0;

  const isGrid = !listStyle || listStyle === "blank";

  return (
    <View key="skills" style={styles.section}>
      {((settings.skillsHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "SKILLS",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}

      {listStyle === "inline" ? (
        <Text style={{ fontSize: fontSize, lineHeight: lineHeight }}>
          {skills.map((skill, index) => (
            <Text key={skill.id}>
              {index > 0 && " | "}
              <Text style={{ fontFamily: boldFont, fontWeight: "bold" }}>
                {skill.name}
              </Text>
              {skill.keywords && skill.keywords.length > 0 && (
                <Text>: {skill.keywords.join(", ")}</Text>
              )}
            </Text>
          ))}
        </Text>
      ) : isGrid ? (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          {skills.map((skill) => (
            <View key={skill.id} style={{ width: "48%", marginBottom: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: fontSize,
                    fontFamily: boldFont,
                    fontWeight: "bold",
                  }}
                >
                  {skill.name}
                </Text>
                <RenderLevel
                  level={skill.level}
                  levelStyle={levelStyle}
                  decorationColor={getColor("decorations")}
                  fontSize={fontSize}
                />
                {levelStyle === 0 && skill.level && (
                  <Text
                    style={{
                      fontSize: fontSize - 1,
                      color: "#333",
                      marginLeft: 6,
                    }}
                  >
                    ({skill.level})
                  </Text>
                )}
              </View>

              {skill.keywords && skill.keywords.length > 0 && (
                <Text
                  style={{ fontSize: fontSize, color: "#333", lineHeight: 1.3 }}
                >
                  {skill.keywords.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        /* Bullet / Number List (Vertical) */
        skills.map((skill, index) => (
          <View
            key={skill.id}
            style={{
              marginBottom: 2,
              flexDirection: "row",
              marginLeft: 10,
              alignItems: "flex-start",
            }}
          >
            <Text style={{ marginRight: 4, fontSize: fontSize }}>
              {listStyle === "bullet"
                ? "•"
                : listStyle === "number"
                  ? `${index + 1}.`
                  : "-"}
            </Text>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: fontSize }}>
                  <Text style={{ fontFamily: boldFont, fontWeight: "bold" }}>
                    {skill.name}
                  </Text>
                </Text>
                <RenderLevel
                  level={skill.level}
                  levelStyle={levelStyle}
                  decorationColor={getColor("decorations")}
                  fontSize={fontSize}
                />
                {levelStyle === 0 && skill.level && (
                  <Text
                    style={{
                      fontSize: fontSize - 1,
                      color: "#555",
                      marginLeft: 6,
                    }}
                  >
                    ({skill.level})
                  </Text>
                )}
                {skill.keywords && skill.keywords.length > 0 && (
                  <Text style={{ fontSize: fontSize }}>
                    : {skill.keywords.join(", ")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};
