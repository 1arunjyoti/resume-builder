/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Link,
} from "@react-pdf/renderer";
import { Resume } from "@/db";

interface WaveBackgroundProps {
  style: any;
  primaryColor: string;
}

const WaveBackground = ({ style, primaryColor }: WaveBackgroundProps) => (
  <Svg viewBox="0 0 600 140" style={style}>
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E0F2FE" stopOpacity="0.5" />
        <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </LinearGradient>
    </Defs>
    <Path d="M0,0 L600,0 L600,100 Q450,140 300,80 T0,100 Z" fill="url(#grad)" />
    <Path
      d="M0,0 L600,0 L600,80 Q450,120 300,60 T0,80 Z"
      fill={primaryColor}
      fillOpacity="0.05"
    />
  </Svg>
);

interface StylishHeaderProps {
  basics: Resume["basics"];
  settings: any;
  styles: any;
  getColor: (target: string, fallback?: string) => string;
}

export function StylishHeader({
  basics,
  settings,
  getColor,
}: StylishHeaderProps) {
  const { name, label, email, phone, url, location, profiles } = basics;

  // Dynamic container styles based on alignment
  // Prioritize headerPosition as it is the main "Position" control in the UI.
  // Map 'top' (Middle icon) to 'center'.

  const rawAlign = settings.headerPosition || settings.personalDetailsAlign;

  let effectiveAlign = "left";
  if (rawAlign === "right") effectiveAlign = "right";
  if (rawAlign === "center" || rawAlign === "middle" || rawAlign === "top")
    effectiveAlign = "center";
  if (rawAlign === "left") effectiveAlign = "left";

  const isRightAlign = effectiveAlign === "right";
  const isCenterAlign = effectiveAlign === "center";

  // Text alignment
  const textAlign = isCenterAlign ? "center" : isRightAlign ? "right" : "left";

  // Flex direction for the main container
  // If aligned right, we might want to swap image and text visually, or just justify-end.
  // However, the original design has image on right.
  // Let's keep image on right for Left align, image on left for Right align (mirror), or center image for Center.
  // For simplicity and keeping the "wave" look, let's adjust the content placement.

  const headerStyles = StyleSheet.create({
    container: {
      position: "relative",
      marginBottom:
        settings.headerBottomMargin !== undefined
          ? settings.headerBottomMargin
          : 20,
      width: "100%",
      height: 140, // Height for the wave background
      flexDirection: isRightAlign ? "row-reverse" : "row", // Swap text and image for Right align
      justifyContent: isCenterAlign ? "center" : "space-between",
      alignItems: "center",
      color: settings.color || "#333",
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      // Mirror wave for right alignment? Not strictly necessary but could be nice.
      transform: isRightAlign ? "scaleX(-1)" : undefined,
    },
    contentContent: {
      // wrapping text content
      marginLeft: isRightAlign ? 0 : settings.marginHorizontal,
      marginRight: isRightAlign ? settings.marginHorizontal : 0,
      marginTop: 0,
      flex: 1, // Let it take available space
      // Only limit width if image is present AND we are not centered.
      // Actually flex:1 handles it if imageContainer has fixed dimensions.
      alignItems: isCenterAlign
        ? "center"
        : isRightAlign
          ? "flex-end"
          : "flex-start",
      textAlign: textAlign,
    },
    name: {
      fontSize: settings.nameFontSize || 32,
      fontFamily:
        settings.nameFont === "creative" ? "Helvetica" : settings.fontFamily,
      fontWeight: settings.nameBold ? "bold" : "normal",
      color: getColor("primary", "#2563EB"),
      marginBottom: 5,
      lineHeight: settings.nameLineHeight || 1.2,
      textAlign: textAlign,
    },
    title: {
      fontSize: settings.titleFontSize || 14,
      fontFamily: settings.fontFamily,
      color: getColor("secondary", "#4B5563"),
      marginBottom: 10,
      fontWeight: settings.titleBold ? "bold" : "normal",
      fontStyle: settings.titleItalic ? "italic" : "normal",
      lineHeight: settings.titleLineHeight || 1.2,
      textAlign: textAlign,
    },
    contactRow: {
      flexDirection: "row",
      gap: 10,
      flexWrap: "wrap",
      justifyContent: isCenterAlign
        ? "center"
        : isRightAlign
          ? "flex-end"
          : "flex-start",
      marginTop: 5,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    contactText: {
      fontSize: settings.contactFontSize || 10,
      color: "#4B5563",
      fontWeight: settings.contactBold ? "bold" : "normal",
      fontStyle: settings.contactItalic ? "italic" : "normal",
    },
    imageContainer: {
      marginRight: isRightAlign ? 0 : settings.marginHorizontal,
      marginLeft: isRightAlign ? settings.marginHorizontal : 0,
      width:
        settings.profileImageSize === "S"
          ? 80
          : settings.profileImageSize === "L"
            ? 120
            : 100,
      height:
        settings.profileImageSize === "S"
          ? 80
          : settings.profileImageSize === "L"
            ? 120
            : 100,
      borderRadius: settings.profileImageShape === "square" ? 0 : 9999,
      overflow: "hidden",
      borderWidth: settings.profileImageBorder ? 3 : 0,
      borderColor: "#FFF",
      display: isCenterAlign ? "none" : "flex", // Hide side image if center, handle separately if needed
    },
    centerImageContainer: {
      // For center alignment
      width:
        settings.profileImageSize === "S"
          ? 80
          : settings.profileImageSize === "L"
            ? 120
            : 100,
      height:
        settings.profileImageSize === "S"
          ? 80
          : settings.profileImageSize === "L"
            ? 120
            : 100,
      borderRadius: settings.profileImageShape === "square" ? 0 : 9999,
      overflow: "hidden",
      borderWidth: settings.profileImageBorder ? 3 : 0,
      borderColor: "#FFF",
      marginBottom: 10,
      alignSelf: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  });

  const primaryColor = getColor("primary", "#2563EB");

  // Build Contact Items similar to GlowHeader
  const contactItems: { type: string; value: string; href?: string }[] = [];
  if (phone) contactItems.push({ type: "phone", value: phone });
  if (email)
    contactItems.push({ type: "email", value: email, href: `mailto:${email}` });
  if (url)
    contactItems.push({
      type: "website",
      value: url.replace(/^https?:\/\//, ""),
      href: url,
    });
  if (location && (location.city || (location as any).region)) {
    const loc = [location.city, (location as any).region]
      .filter(Boolean)
      .join(", ");
    contactItems.push({ type: "location", value: loc });
  }
  if (profiles && profiles.length > 0) {
    profiles.forEach((profile: any) => {
      contactItems.push({
        type: "profile",
        value: `${profile.network}: ${profile.username}`,
        href: profile.url,
      });
    });
  }

  return (
    <View style={headerStyles.container}>
      <WaveBackground
        style={headerStyles.background}
        primaryColor={primaryColor}
      />

      <View style={headerStyles.contentContent}>
        {/* Center Image if alignment is center */}
        {effectiveAlign === "center" &&
          settings.showProfileImage &&
          basics.image && (
            <View style={headerStyles.centerImageContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={basics.image} style={headerStyles.image} />
            </View>
          )}

        <Text style={headerStyles.name}>{name}</Text>
        <Text style={headerStyles.title}>{label}</Text>

        <View style={headerStyles.contactRow}>
          {contactItems.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {index > 0 && (
                <Text
                  style={{ ...headerStyles.contactText, marginHorizontal: 3 }}
                >
                  {settings.contactSeparator === "dash"
                    ? "-"
                    : settings.contactSeparator === "comma"
                      ? ","
                      : "|"}
                </Text>
              )}
              {item.href ? (
                <Link src={item.href} style={{ textDecoration: "none" }}>
                  <Text style={headerStyles.contactText}>{item.value}</Text>
                </Link>
              ) : (
                <Text style={headerStyles.contactText}>{item.value}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Side Image if alignment is NOT center */}
      {effectiveAlign !== "center" &&
        settings.showProfileImage &&
        basics.image && (
          <View style={headerStyles.imageContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={basics.image} style={headerStyles.image} />
          </View>
        )}
    </View>
  );
}
