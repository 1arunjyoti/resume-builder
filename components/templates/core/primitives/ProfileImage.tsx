/**
 * ProfileImage - Universal profile image component
 * 
 * Supports:
 * - Three sizes: S (50pt), M (80pt), L (120pt)
 * - Two shapes: circle, square
 * - Optional border
 */

import React from "react";
import { Image, StyleSheet } from "@react-pdf/renderer";

export interface ProfileImageProps {
  /** Image source (base64, URL, or Blob converted to base64) */
  src: string;
  /** Size preset */
  size?: "S" | "M" | "L";
  /** Custom size in points (overrides size preset) */
  customSize?: number;
  /** Shape of the image */
  shape?: "circle" | "square";
  /** Show border */
  border?: boolean;
  /** Border color */
  borderColor?: string;
  /** Border width */
  borderWidth?: number;
  /** Additional styles */
  style?: object;
}

// Size mappings in points
const SIZE_MAP = {
  S: 50,
  M: 80,
  L: 120,
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  size = "M",
  customSize,
  shape = "circle",
  border = false,
  borderColor = "#000000",
  borderWidth = 1,
  style,
}) => {
  if (!src) return null;

  const dimension = customSize ?? SIZE_MAP[size];

  const styles = StyleSheet.create({
    image: {
      width: dimension,
      height: dimension,
      borderRadius: shape === "circle" ? dimension / 2 : 0,
      borderWidth: border ? borderWidth : 0,
      borderColor: border ? borderColor : "transparent",
      objectFit: "cover",
      ...style,
    },
  });

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image src={src} style={styles.image} />
  );
};

export default ProfileImage;
