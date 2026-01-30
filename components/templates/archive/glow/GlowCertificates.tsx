import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Resume } from "@/db";
import { formatSectionTitle } from "@/lib/template-utils";
import { LayoutSettings, TemplateStyles } from "@/components/design/types";

interface GlowCertificatesProps {
  certificates: Resume["certificates"];
  settings: LayoutSettings;
  styles: TemplateStyles;
  getColor: (target: string, fallback?: string) => string;
  fontSize: number;
  baseFont: string;
  boldFont: string;
  italicFont: string;
}

export const GlowCertificates: React.FC<GlowCertificatesProps> = ({
  certificates,
  settings,
  styles,
  getColor,
  fontSize,
  baseFont,
  boldFont,
  italicFont,
}) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <View key="certificates" style={styles.section}>
      {((settings.certificatesHeadingVisible ?? true) as boolean) && (
        <View style={styles.sectionTitleWrapper}>
          <Text style={[styles.sectionTitle, { color: getColor("headings") }]}>
            {formatSectionTitle(
              "CERTIFICATES",
              settings.sectionHeadingCapitalization,
            )}
          </Text>
        </View>
      )}
      {certificates.map((cert, index) => (
        <View key={cert.id} style={styles.entryBlock}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {settings.certificatesListStyle === "bullet" && (
                <Text
                  style={{
                    marginRight: 4,
                    fontSize: fontSize,
                    color: getColor("headings"),
                  }}
                >
                  •
                </Text>
              )}
              {settings.certificatesListStyle === "number" && (
                <Text
                  style={{
                    marginRight: 4,
                    fontSize: fontSize,
                    color: getColor("headings"),
                  }}
                >
                  {index + 1}.
                </Text>
              )}
              <Text
                style={{
                  fontSize: fontSize + 1,
                  fontFamily: settings.certificatesNameBold
                    ? boldFont
                    : settings.certificatesNameItalic
                      ? italicFont
                      : baseFont,
                  fontWeight: settings.certificatesNameBold ? "bold" : "normal",
                  fontStyle: settings.certificatesNameItalic
                    ? "italic"
                    : "normal",
                }}
              >
                {cert.name}
              </Text>
            </View>
            <Text
              style={{
                fontSize: fontSize,
                color: getColor("dates"),
                fontFamily: settings.certificatesDateBold
                  ? boldFont
                  : settings.certificatesDateItalic
                    ? italicFont
                    : baseFont,
                fontWeight: settings.certificatesDateBold ? "bold" : "normal",
                fontStyle: settings.certificatesDateItalic
                  ? "italic"
                  : "normal",
              }}
            >
              {cert.date}
            </Text>
          </View>
          <Text
            style={{
              fontSize: fontSize,
              fontFamily: settings.certificatesIssuerBold
                ? boldFont
                : settings.certificatesIssuerItalic
                  ? italicFont
                  : baseFont,
              fontWeight: settings.certificatesIssuerBold ? "bold" : "normal",
              fontStyle: settings.certificatesIssuerItalic
                ? "italic"
                : "normal",
            }}
          >
            {cert.issuer}
          </Text>
        </View>
      ))}
    </View>
  );
};
