import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface DeveloperProjectsProps {
  projects: Resume["projects"];
  themeColor: string;
}

export const DeveloperProjects = ({
  projects,
  themeColor,
}: DeveloperProjectsProps) => {
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
    bracket: { color: "#D4D4D4" },
    keyword: { color: "#569CD6" }, // Blue
    string: { color: "#CE9178" },
    comment: { color: "#6A9955" },
    property: { color: "#9CDCFE" },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#Projects</Text>
      <View style={styles.codeBlock}>
        {projects.map((proj, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={styles.bracket}>{"{"}</Text>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.comment}>
                {proj.startDate} - {proj.endDate || "Present"}
              </Text>

              <View style={{ marginTop: 2 }}>
                <Text style={styles.property}>name</Text>
                <Text style={styles.keyword}>: </Text>
                <Text style={styles.string}>&quot;{proj.name}&quot;</Text>
                <Text style={styles.bracket}>,</Text>
              </View>

              <View style={{ marginTop: 2 }}>
                <Text style={styles.property}>description</Text>
                <Text style={styles.keyword}>: </Text>
                <Text style={styles.string}>
                  &quot;{proj.description}&quot;
                </Text>
                <Text style={styles.bracket}>,</Text>
              </View>

              <View style={{ marginTop: 2 }}>
                <Text style={styles.property}>technologies</Text>
                <Text style={styles.keyword}>: </Text>
                <Text style={styles.bracket}>[</Text>
                {proj.keywords.map((k, i) => (
                  <Text key={i} style={{ marginLeft: 10 }}>
                    <Text style={styles.string}>&quot;{k}&quot;</Text>
                    {i < proj.keywords.length - 1 && (
                      <Text style={styles.bracket}>,</Text>
                    )}
                  </Text>
                ))}
                <Text style={styles.bracket}>]</Text>
              </View>

              {proj.url && (
                <View style={{ marginTop: 2 }}>
                  <Text style={styles.property}>url</Text>
                  <Text style={styles.keyword}>: </Text>
                  <Text style={styles.string}>&quot;{proj.url}&quot;</Text>
                </View>
              )}
            </View>
            <Text style={styles.bracket}>{"},"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
