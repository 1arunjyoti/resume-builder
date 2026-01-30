import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface Developer2EducationProps {
  education: Resume["education"];
  fontFamily?: string;
}

export const Developer2Education = ({
  education,
  fontFamily = "Helvetica",
}: Developer2EducationProps) => {
  const styles = StyleSheet.create({
    item: {
      marginBottom: 10,
    },
    degree: {
      fontSize: 12,
      color: "#FFFFFF",
      fontFamily: fontFamily,
      fontWeight: "bold",
    },
    institution: {
      fontSize: 10,
      color: "#CCCCCC",
      fontFamily: fontFamily,
    },
    date: {
      fontSize: 10,
      color: "#AAAAAA",
      fontFamily: fontFamily,
    },
  });

  return (
    <View>
      {education.map((edu, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.degree}>
            {edu.studyType} in {edu.area}
          </Text>
          <Text style={styles.institution}>{edu.institution}</Text>
          <Text style={styles.date}>Graduated: {edu.endDate}</Text>
        </View>
      ))}
    </View>
  );
};
