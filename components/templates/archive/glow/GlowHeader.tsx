import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { PROFILE_IMAGE_SIZES, mmToPt } from "@/lib/template-utils";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowHeaderProps {
  basics: Resume["basics"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  baseFont: string;
  boldFont: string;
  italicFont: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
}

const ProfileImage = ({
  image,
  settings,
  borderColor,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: string | any;
  settings: LayoutSettings;
  borderColor: string;
}) => {
  if (!image || !settings.showProfileImage) return null;

  const size = PROFILE_IMAGE_SIZES[settings.profileImageSize] || 100;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      src={image}
      style={{
        width: size,
        height: size,
        borderRadius: settings.profileImageShape === "square" ? 0 : size / 2,
        borderWidth: settings.profileImageBorder ? 2 : 0,
        borderColor: borderColor,
        objectFit: "cover",
        marginBottom: 10,
      }}
    />
  );
};

export const GlowHeader: React.FC<GlowHeaderProps> = ({
  basics,
  settings,
  styles,
  getColor,
  baseFont,
  boldFont,
  italicFont,
  headerBackgroundColor = "#202020",
  headerTextColor = "#FFFFFF",
}) => {
  const contactStyle = {
    fontWeight: (settings.contactBold ? "bold" : "normal") as "bold" | "normal",
    fontStyle: (settings.contactItalic ? "italic" : "normal") as
      | "italic"
      | "normal",
    fontFamily: settings.contactBold
      ? boldFont
      : settings.contactItalic
        ? italicFont
        : baseFont,
  };

  const layoutHeaderPos = settings.headerPosition;
  const headerAlign =
    layoutHeaderPos === "left" || layoutHeaderPos === "right"
      ? layoutHeaderPos
      : "center"; // Default to center (top) if not left/right

  const contactLayout = settings.personalDetailsArrangement;

  const mapAlignToFlex = (align: string) => {
    switch (align) {
      case "right":
        return "flex-end";
      case "center":
        return "center";
      case "left":
      default:
        return "flex-start";
    }
  };

  const headerFlexAlign = mapAlignToFlex(headerAlign);

  const renderContactItem = (
    value: string,
    isLink: boolean = false,
    href?: string,
  ) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {href ? (
          <Link src={href} style={{ textDecoration: "none" }}>
            <Text
              style={[
                contactStyle,
                isLink
                  ? { color: getColor("links", headerTextColor) }
                  : { color: headerTextColor },
              ]}
            >
              {value}
            </Text>
          </Link>
        ) : (
          <Text
            style={[
              contactStyle,
              isLink ? { color: getColor("links", headerTextColor) } : {},
            ]}
          >
            {value}
          </Text>
        )}
      </View>
    );
  };

  // Build Contact Items
  const contactItems = [];
  if (basics.email)
    contactItems.push({
      type: "email",
      value: basics.email,
      href: `mailto:${basics.email}`,
    });
  if (basics.phone)
    contactItems.push({
      type: "phone",
      value: basics.phone,
      href: `tel:${basics.phone}`,
    });
  if (basics.location && (basics.location.city || basics.location.country)) {
    const loc = [basics.location.city, basics.location.country]
      .filter(Boolean)
      .join(", ");
    contactItems.push({ type: "location", value: loc });
  }
  if (basics.url)
    contactItems.push({ type: "website", value: basics.url, href: basics.url });

  // Add profiles
  if (basics.profiles && basics.profiles.length > 0) {
    basics.profiles.forEach((p) => {
      contactItems.push({
        type: "profile",
        value: p.username || p.network,
        href: p.url,
      });
    });
  }

  return (
    <View
      style={[
        styles.header,
        {
          position: "relative",
          marginBottom: settings.headerBottomMargin,
          paddingTop: 0,
          paddingBottom: 20,
          paddingHorizontal: mmToPt(settings.marginHorizontal),
          color: headerTextColor, // inherited by children
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: -mmToPt(settings.marginVertical),
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: headerBackgroundColor,
        }}
      />
      <View
        style={{
          flexDirection: headerAlign === "right" ? "row-reverse" : "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <ProfileImage
          image={basics.image}
          settings={settings}
          borderColor={getColor("name")} // Use accent color for border
        />

        <View style={{ flex: 1, alignItems: headerFlexAlign }}>
          <View
            style={{
              flexDirection:
                headerAlign === "center"
                  ? "column"
                  : headerAlign === "right"
                    ? "row-reverse"
                    : "row",
              alignItems: headerAlign === "center" ? "center" : "baseline",
              // Gap is sometimes flaky in react-pdf with mixed directions/wrapping. Using explicit margins.
              gap: headerAlign === "center" ? 0 : 15,
              flexWrap: headerAlign === "center" ? "nowrap" : "wrap",
            }}
          >
            <Text
              style={[
                styles.name,
                {
                  color: getColor("name", headerTextColor),
                  marginBottom: headerAlign === "center" ? 4 : 0,
                  fontFamily:
                    settings.nameFont === "creative"
                      ? "Helvetica"
                      : settings.nameBold
                        ? boldFont
                        : baseFont,
                  fontWeight:
                    settings.nameBold || settings.nameFont === "creative"
                      ? "bold"
                      : "normal",
                },
              ]}
            >
              {basics.name}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: getColor("title", headerTextColor),
                  opacity: 0.9,
                  marginBottom: 0,
                  marginTop: 0, // Reset, handled by name's marginBottom or container gap if it works, or just flow
                  textAlign: headerAlign,
                },
              ]}
            >
              {basics.label}
            </Text>
          </View>

          <View
            style={[
              styles.contactRow,
              {
                justifyContent: headerFlexAlign,
                marginTop: 8,
                columnGap: 0, // Override template default gap to handle separators manually
              },
            ]}
          >
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderContactItem(
                  item.value,
                  !!item.href || item.type === "location",
                  item.href,
                )}
                {index < contactItems.length - 1 && (
                  <Text
                    style={{
                      color: getColor("decorations"),
                      marginLeft: settings.contactSeparator === "comma" ? 0 : 5,
                      marginRight: 5, // Consistent spacing after separator
                    }}
                  >
                    {contactLayout === 2
                      ? ""
                      : settings.contactSeparator === "dash"
                        ? "-"
                        : settings.contactSeparator === "comma"
                          ? ","
                          : "|"}
                  </Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
