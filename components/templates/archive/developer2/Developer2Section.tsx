import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface Developer2SectionProps {
  number: string;
  title: string;
  themeColor: string;
  children: React.ReactNode;
  fontFamily?: string;
}

export const Developer2Section = ({
  number,
  title,
  themeColor,
  children,
  fontFamily = "Helvetica",
}: Developer2SectionProps) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      flexDirection: "column",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-end", // Align text bottom potentially
      marginBottom: 10,
    },
    number: {
      fontSize: 24,
      color: themeColor,
      fontFamily: fontFamily,
      marginRight: 10,
      fontWeight: "bold",
    },
    title: {
      fontSize: 18,
      color: "#FFFFFF",
      fontFamily: fontFamily,
      marginBottom: 4, // Visual adjustment
    },
    contentBox: {
      backgroundColor: "#2d2d2d", // Slightly lighter than background
      borderColor: "#3e3e3e",
      borderWidth: 1,
      borderRadius: 8,
      padding: 15,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.contentBox}>{children}</View>
    </View>
  );
};
