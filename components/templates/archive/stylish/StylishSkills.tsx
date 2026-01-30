import { Text, View, StyleSheet } from "@react-pdf/renderer";

export function StylishSkills({ skills, settings, styles, getColor }: any) {
  if (!skills || skills.length === 0) return null;

  const chipStyles = StyleSheet.create({
    chip: {
      backgroundColor: "#E0E7FF",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      fontSize: settings.fontSize - 1,
      color: "#1E40AF",
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.gridContainer}>
        {skills.map((skill: any, index: number) =>
          // Flatten keywords or just show skill name. Assuming skill.name is the category or the skill itself.
          // If keywords exist, show those as chips. If not, show name as chip.
          skill.keywords && skill.keywords.length > 0 ? (
            skill.keywords.map((kw: string, idx: number) => (
              <Text key={`${index}-${idx}`} style={chipStyles.chip}>
                {kw}
              </Text>
            ))
          ) : (
            <Text key={index} style={chipStyles.chip}>
              {skill.name}
            </Text>
          ),
        )}
      </View>
    </View>
  );
}
