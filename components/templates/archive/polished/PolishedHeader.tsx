/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface PolishedHeaderProps {
  basics: Resume["basics"];
  settings: any;
  themeColor: string;
  globalStyles?: any;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
}

export function PolishedHeader({
  basics,
  themeColor,
  getColor,
  baseFont,
  boldFont,
}: PolishedHeaderProps) {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontFamily: boldFont,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: getColor("name", "#333333"), // Dark Grey default
      marginBottom: 4,
    },
    label: {
      fontSize: 12,
      color: themeColor,
      fontFamily: baseFont,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    contactText: {
      fontSize: 9,
      color: "#555",
      fontFamily: baseFont,
    },
    icon: {
      // Placeholder for icons if we have them, else text
      fontSize: 9,
      color: "#555",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{basics.name}</Text>
      <Text style={styles.label}>{basics.label}</Text>

      <View style={styles.contactRow}>
        {basics.phone && <Text style={styles.contactText}>{basics.phone}</Text>}
        {basics.email && <Text style={styles.contactText}>{basics.email}</Text>}
        {basics.url && (
          <Text style={styles.contactText}>
            {basics.url.replace(/^https?:\/\//, "")}
          </Text>
        )}
        {basics.location && basics.location.city && (
          <Text style={styles.contactText}>
            {basics.location.city}, {basics.location.region}
          </Text>
        )}
      </View>
    </View>
  );
}
