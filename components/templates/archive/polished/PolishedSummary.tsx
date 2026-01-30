/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface PolishedSummaryProps {
  summary: string;
  settings: any;
  themeColor: string;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
  fontSize: number;
}

export function PolishedSummary({
  summary,
  baseFont,
  fontSize,
}: PolishedSummaryProps) {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    heading: {
      fontSize: fontSize + 2,
      fontFamily: baseFont,
      fontWeight: "normal",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingBottom: 4,
      color: "#333",
    },
    text: {
      fontSize: fontSize,
      fontFamily: baseFont,
      lineHeight: 1.5,
      color: "#444",
    },
  });

  if (!summary) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SUMMARY</Text>
      <Text style={styles.text}>{summary}</Text>
    </View>
  );
}
