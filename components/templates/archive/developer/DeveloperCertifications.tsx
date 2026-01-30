import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface DeveloperCertificationsProps {
  certificates: Resume["certificates"];
  themeColor: string;
}

export const DeveloperCertifications = ({
  certificates,
  themeColor,
}: DeveloperCertificationsProps) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: "#252526",
      borderRadius: 5,
      borderLeftWidth: 2,
      borderLeftColor: themeColor,
    },
    heading: {
      fontSize: 14,
      color: themeColor,
      fontFamily: "Courier",
      marginBottom: 5,
    },
    codeBlock: {
      fontFamily: "Courier",
      fontSize: 9,
      color: "#D4D4D4",
    },
    bracket: { color: "#F1D700" },
    keyword: { color: "#569CD6" },
    string: { color: "#CE9178" },
    comma: { color: "#D4D4D4" },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#Certifications</Text>
      <View style={styles.codeBlock}>
        <Text style={styles.bracket}>{"{"}</Text>
        <View style={{ marginLeft: 15 }}>
          {certificates.map((cert, index) => (
            <View key={index} style={{ marginBottom: 2 }}>
              <Text>
                <Text style={styles.string}>&quot;{cert.name}&quot;</Text>
                {index < certificates.length - 1 && (
                  <Text style={styles.comma}>,</Text>
                )}
              </Text>
            </View>
          ))}
          <Text style={{ color: "#6A9955" }}>...</Text>
        </View>
        <Text style={styles.bracket}>{"}"}</Text>
      </View>
    </View>
  );
};
