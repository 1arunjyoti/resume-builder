/* eslint-disable jsx-a11y/alt-text */
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface Developer2HeaderProps {
  basics: Resume["basics"];
  themeColor: string;
  fontFamily?: string;
}

export const Developer2Header = ({
  basics,
  themeColor,
  fontFamily = "Helvetica",
}: Developer2HeaderProps) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 30,
      alignItems: "center",
      // paddingRight is handled by parent column
    },
    imageContainer: {
      marginBottom: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      objectFit: "cover",
      borderWidth: 2,
      borderColor: themeColor, // Green ring
    },
    nameContainer: {
      backgroundColor: "#2d2d2d",
      padding: 10,
      borderRadius: 8,
      width: "100%",
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#3e3e3e",
    },
    name: {
      fontSize: 20,
      color: "#FFFFFF",
      fontFamily: fontFamily,
      marginBottom: 2,
    },
    label: {
      fontSize: 10,
      color: "#AAAAAA",
      fontFamily: fontFamily,
    },
    contactContainer: {
      backgroundColor: "#2d2d2d",
      padding: 10,
      borderRadius: 8,
      width: "100%",
      borderWidth: 1,
      borderColor: "#3e3e3e",
    },
    contactText: {
      fontSize: 9,
      color: "#CCCCCC",
      marginBottom: 2,
      fontFamily: fontFamily,
    },
  });

  return (
    <View style={styles.container}>
      {/* Profile Image (Radial design in image is artistic, we'll just use the profile image) */}
      <View style={styles.imageContainer}>
        {basics.image ? (
          <Image src={basics.image} style={styles.image} />
        ) : (
          // Placeholder circle if no image
          <View style={{ ...styles.image, backgroundColor: "#333" }} />
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.name}>{basics.name}</Text>
        <Text style={styles.label}>{basics.label}</Text>
      </View>

      <View style={styles.contactContainer}>
        {basics.location && (
          <Text style={styles.contactText}>
            {basics.location.address ? basics.location.address + ", " : ""}
            {basics.location.city}, {basics.location.region}
          </Text>
        )}
        {basics.phone && <Text style={styles.contactText}>{basics.phone}</Text>}
        {basics.email && <Text style={styles.contactText}>{basics.email}</Text>}
        {basics.url && <Text style={styles.contactText}>{basics.url}</Text>}
      </View>
    </View>
  );
};
