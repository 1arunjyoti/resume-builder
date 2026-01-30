/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, View, StyleSheet } from "@react-pdf/renderer";

export function StylishLanguages({
  languages,
  settings,
  styles,
  getColor,
}: any) {
  if (!languages || languages.length === 0) return null;

  const barStyles = StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    name: {
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      fontWeight: "bold",
      width: "30%",
    },
    barContainer: {
      width: "65%",
      height: 4,
      backgroundColor: "#E5E7EB",
      borderRadius: 2,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      backgroundColor: getColor("primary", "#3B82F6"),
    },
  });

  const getFluencyPercent = (fluency: string) => {
    const lower = fluency.toLowerCase();
    if (lower.includes("native") || lower.includes("bilingual")) return "100%";
    if (lower.includes("advanced") || lower.includes("fluent")) return "80%";
    if (lower.includes("intermediate")) return "50%";
    if (lower.includes("beginner") || lower.includes("basic")) return "20%";
    return "0%";
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Languages</Text>
      {languages.map((lang: any, index: number) => (
        <View key={index} style={barStyles.row}>
          <Text style={barStyles.name}>{lang.language}</Text>
          <View style={barStyles.barContainer}>
            <View
              style={[
                barStyles.barFill,
                { width: getFluencyPercent(lang.fluency) },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
