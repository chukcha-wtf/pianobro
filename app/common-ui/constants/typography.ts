/* eslint-disable camelcase */
import { TextStyle } from "react-native"
import { Colors } from "./colors"

import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk"

import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat"

export const customFontsToLoad = {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
}

export const Fonts = {
  spaceGrotesk: {
    // Cross-platform Google font.
    light: "SpaceGrotesk_300Light",
    normal: "SpaceGrotesk_400Regular",
    medium: "SpaceGrotesk_500Medium",
    semiBold: "SpaceGrotesk_600SemiBold",
    bold: "SpaceGrotesk_700Bold",
  },
  montserrat: {
    // Main Google font.
    normal: "Montserrat_400Regular",
    medium: "Montserrat_500Medium",
    semibold: "Montserrat_600SemiBold",
    bold: "Montserrat_700Bold",
  },
}

/**
 * Collection of text styles used in Text components.
 */

type TypographyType = {
  [key: string]: TextStyle
}

export const Typography: TypographyType = {
  hugeTitle: {
    fontFamily: Fonts.montserrat.bold,
    fontWeight: "700",
    fontSize: 32,
    lineHeight: 36,
    color: Colors.dark,
  },

  extraLargeTitle: {
    fontFamily: Fonts.montserrat.bold,
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    color: Colors.dark,
  },

  largeTitle: {
    fontFamily: Fonts.montserrat.semibold,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 20,
    color: Colors.dark,
  },

  mediumTitle: {
    fontFamily: Fonts.montserrat.semibold,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 18,
    color: Colors.dark,
  },

  smallTitle: {
    fontFamily: Fonts.montserrat.bold,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16,
    color: Colors.dark,
  },

  mediumText: {
    fontFamily: Fonts.spaceGrotesk.bold,
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 16,
    color: Colors.dark,
  },

  regularLargeText: {
    fontFamily: Fonts.spaceGrotesk.normal,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 18,
    color: Colors.dark,
  },

  regularText: {
    fontFamily: Fonts.spaceGrotesk.normal,
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 16,
    color: Colors.dark,
  },

  smallerText: {
    fontFamily: Fonts.spaceGrotesk.normal,
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 14,
    color: Colors.dark,
  },

  smallText: {
    fontFamily: Fonts.spaceGrotesk.normal,
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 12,
    color: Colors.dark,
  },

  tinyText: {
    fontFamily: Fonts.spaceGrotesk.normal,
    fontWeight: "300",
    fontSize: 8,
    lineHeight: 10,
    color: Colors.dark,
  },

  labelText: {
    fontFamily: Fonts.spaceGrotesk.bold,
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14,
    color: Colors.darkGrey,
  },

  noLineHeight: {
    lineHeight: 1,
  },

  textLeft: {
    textAlign: "left",
  },

  textRight: {
    textAlign: "right",
  },

  textCenter: {
    textAlign: "center",
  },

  mutedText: {
    color: Colors.darkGrey,
  },

  disabledText: {
    color: Colors.darkGrey,
    opacity: 0.5,
  },
}
