import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface DeveloperEducationProps {
  education: Resume["education"];
  themeColor: string;
}

export const DeveloperEducation = ({
  education,
  themeColor,
}: DeveloperEducationProps) => {
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
      color: "#6A9955", // All comments
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#Education</Text>
      <View style={styles.codeBlock}>
        {education.map((edu, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text>
              {edu.startDate} - {edu.endDate || "Present"}
            </Text>
            <Text>
              {edu.area} in {edu.studyType}
            </Text>
            <Text>{edu.institution}</Text>
            {edu.score && <Text>Grade: {edu.score}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};
