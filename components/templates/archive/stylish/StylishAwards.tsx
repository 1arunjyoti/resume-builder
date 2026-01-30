/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View, StyleSheet, Svg, Path } from "@react-pdf/renderer";

export function StylishAwards({ awards, settings, styles, getColor }: any) {
  if (!awards || awards.length === 0) return null;

  // Simple icon for awards (Trophy-like)
  const AwardIcon = () => (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill={getColor("primary", "#3B82F6")}
    >
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    </Svg>
  );

  const awardStyles = StyleSheet.create({
    item: {
      marginBottom: 6,
      flexDirection: "row",
      gap: 6,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: settings.fontSize,
      fontWeight: "bold",
      color: "#333",
    },
    awarder: {
      fontSize: settings.fontSize - 1,
      fontStyle: "italic",
      color: "#666",
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Key Achievements</Text>
      {awards.map((award: any, index: number) => (
        <View key={index} style={awardStyles.item}>
          <View style={{ marginTop: 2 }}>
            <AwardIcon />
          </View>
          <View style={awardStyles.content}>
            <Text style={awardStyles.title}>{award.title}</Text>
            {award.awarder && (
              <Text style={awardStyles.awarder}>{award.awarder}</Text>
            )}
            {award.summary && (
              <Text style={styles.entrySummary}>{award.summary}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
