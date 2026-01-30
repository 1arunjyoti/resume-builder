import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface Developer2CertificationsProps {
  certificates: Resume["certificates"];
  fontFamily?: string;
}

export const Developer2Certifications = ({
  certificates,
  fontFamily = "Helvetica",
}: Developer2CertificationsProps) => {
  const styles = StyleSheet.create({
    item: {
      marginBottom: 5,
      flexDirection: "row",
    },
    bullet: {
      width: 3,
      height: 3,
      backgroundColor: "#CCCCCC",
      borderRadius: 2,
      marginRight: 5,
      marginTop: 4,
    },
    name: {
      fontSize: 10,
      color: "#FFFFFF",
      fontFamily: fontFamily,
    },
  });

  return (
    <View>
      {certificates.map((cert, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.bullet} />
          <Text style={styles.name}>{cert.name}</Text>
        </View>
      ))}
    </View>
  );
};
