import { View, Text, StyleSheet, Link } from "@react-pdf/renderer";
import { ResumeBasics } from "@/db";

interface TimelineHeaderProps {
  basics: ResumeBasics;
  styles: any;
  settings: any;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
  fontSize: number;
}

export function TimelineHeader({
  basics,
  settings,
  getColor,
  boldFont,
  baseFont,
  fontSize,
}: TimelineHeaderProps) {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      borderBottomWidth: 0,
    },
    name: {
      fontSize: 24, // Large bold name
      fontFamily: boldFont,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: getColor("name", "#000"),
      marginBottom: 4,
    },
    label: {
      fontSize: 14,
      fontFamily: boldFont,
      fontWeight: "bold",
      color: getColor("primary", "#3b82f6"), // Use primary/accent color
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
      fontSize: fontSize,
      color: "#444",
      fontFamily: baseFont,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    link: {
      textDecoration: "none",
      color: "#444",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{basics.name}</Text>
      <Text style={styles.label}>{basics.label}</Text>

      <View style={styles.contactRow}>
        {basics.phone && <Text>{basics.phone}</Text>}
        {basics.email && <Text>{basics.email}</Text>}
        {basics.url && (
          <Link src={basics.url} style={styles.link}>
            {basics.url.replace(/^https?:\/\//, "")}
          </Link>
        )}
        {basics.location?.city && (
          <Text>
            {basics.location.city}
            {basics.location.region ? `, ${basics.location.region}` : ""}
          </Text>
        )}
        {basics.profiles?.map((p) => (
          <Link key={p.network} src={p.url} style={styles.link}>
            {p.username || p.network}
          </Link>
        ))}
      </View>
    </View>
  );
}
