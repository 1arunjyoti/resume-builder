/* eslint-disable jsx-a11y/alt-text */
import { View, Text, StyleSheet, Image, Link } from "@react-pdf/renderer";
import type { ResumeBasics } from "@/db";
import {
  type LayoutSettings,
  type TemplateStyles,
} from "@/components/design/types";

interface MulticolumnHeaderProps {
  basics: ResumeBasics;
  settings: LayoutSettings;
  styles: TemplateStyles; // Passing parent styles for consistency
  getColor: (target: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
}

export function MulticolumnHeader({
  basics,
  settings,
  getColor,
  baseFont,
  boldFont,
}: MulticolumnHeaderProps) {
  // Custom Styles for this header
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: settings.headerBottomMargin,
      borderBottomWidth: settings.sectionHeadingStyle === 1 ? 1 : 0, // Optional border based on settings
      borderBottomColor: "#ccc",
      paddingBottom: 0, // Removed extra padding to reduce space
    },
    textContainer: {
      flex: 1,
      paddingRight: 20,
    },
    name: {
      fontSize: settings.nameFontSize,
      lineHeight: settings.nameLineHeight || 1.2, // Ensure line height prevents overlap
      fontFamily: boldFont,
      fontWeight: "bold",
      color: getColor("name"),
      textTransform: "uppercase",
      marginBottom: 2, // Slight margin
    },
    title: {
      fontSize: settings.titleFontSize,
      lineHeight: settings.titleLineHeight || 1.2,
      fontFamily: baseFont,
      color: getColor("title") === "#000000" ? "#555" : getColor("title"),
      marginBottom: 6,
    },
    contactInfo: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 0, // We control spacing manually with separators
      fontSize: settings.contactFontSize,
      fontFamily: baseFont,
      color: "#444",
      alignItems: "center",
      lineHeight: 1.4,
    },
    link: {
      color: getColor("links"),
      textDecoration: "none",
    },
    separator: {
      marginHorizontal: 4,
      color: getColor("decorations"), // Use decorations color for separator
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: settings.profileImageShape === "circle" ? 40 : 4,
      overflow: "hidden",
      marginLeft: 10,
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  });

  // Helper to determine separator character
  const getSeparator = () => {
    switch (settings.contactSeparator) {
      case "pipe":
        return "|";
      case "dash":
        return "-";
      case "comma":
        return ",";
      default:
        return "|";
    }
  };

  const separatorChar = getSeparator();

  // Build contact items array
  const contactItems = [];

  if (basics.phone) {
    contactItems.push(<Text key="phone">{basics.phone}</Text>);
  }

  if (basics.email) {
    contactItems.push(<Text key="email">{basics.email}</Text>);
  }

  if (basics.location?.city) {
    contactItems.push(
      <Text key="location">
        {basics.location.city}
        {basics.location.country ? `, ${basics.location.country}` : ""}
      </Text>,
    );
  }

  if (basics.url) {
    // Format URL for display (remove protocol)
    const displayUrl = basics.url
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");
    contactItems.push(
      <Link key="url" src={basics.url} style={styles.link}>
        {displayUrl}
      </Link>,
    );
  }

  // Add Profiles
  if (basics.profiles && basics.profiles.length > 0) {
    basics.profiles.forEach((profile) => {
      const network = profile.network;
      const linkText =
        profile.username ||
        profile.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

      if (network) {
        contactItems.push(
          <Text key={profile.url}>
            <Text style={{ fontFamily: boldFont }}>{network}</Text>
            <Text> - </Text>
            <Link src={profile.url} style={styles.link}>
              {linkText}
            </Link>
          </Text>,
        );
      } else {
        contactItems.push(
          <Link key={profile.url} src={profile.url} style={styles.link}>
            {linkText}
          </Link>,
        );
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{basics.name}</Text>
        <Text style={styles.title}>{basics.label}</Text>

        <View style={styles.contactInfo}>
          {contactItems.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {item}
              {index < contactItems.length - 1 && (
                <Text style={styles.separator}>{separatorChar}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {settings.showProfileImage && basics.image && (
        <View style={styles.imageContainer}>
          {typeof basics.image === "string" ? (
            <Image src={basics.image} style={styles.image} />
          ) : null}
        </View>
      )}
    </View>
  );
}
