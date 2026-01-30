import { Text, View } from "@react-pdf/renderer";

export function StylishSummary({ summary, settings, styles, getColor }: any) {
  if (!summary) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Summary</Text>
      <Text style={styles.entrySummary}>{summary}</Text>
    </View>
  );
}
