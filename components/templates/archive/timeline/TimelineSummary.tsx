import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface TimelineSummaryProps {
  summary?: string;
  settings: any;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  boldFont: string;
}

export function TimelineSummary({
  summary,
  settings,
  getColor,
  fontSize,
  boldFont,
}: TimelineSummaryProps) {
  if (!summary) return null;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    title: {
      fontSize: fontSize + 2,
      fontFamily: boldFont,
      fontWeight: "bold",
      color: getColor("headings", "#000"),
      textTransform: "uppercase",
      marginBottom: 6,
    },
    body: {
      fontSize: fontSize,
      lineHeight: settings.lineHeight || 1.4,
      textAlign: "justify",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUMMARY</Text>
      <Text style={styles.body}>{summary}</Text>
    </View>
  );
}
