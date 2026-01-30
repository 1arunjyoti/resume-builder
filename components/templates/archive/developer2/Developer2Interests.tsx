import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface Developer2InterestsProps {
  interests: Resume["interests"];
  fontFamily?: string;
}

export const Developer2Interests = ({
  interests,
  fontFamily = "Helvetica",
}: Developer2InterestsProps) => {
  const styles = StyleSheet.create({
    item: {
      marginBottom: 5,
      flexDirection: "row",
    },
    bullet: {
      width: 3,
      height: 3,
      backgroundColor: "#CCCCCC", // Grey bullet
      borderRadius: 2,
      marginRight: 5,
      marginTop: 4,
    },
    name: {
      fontSize: 10,
      color: "#CCCCCC",
      fontFamily: fontFamily,
    },
  });

  return (
    <View>
      {interests.map((interest, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.bullet} />
          <Text style={styles.name}>{interest.name}</Text>
        </View>
      ))}
    </View>
  );
};
