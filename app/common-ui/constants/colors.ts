/**
 * A collection of colors available across the app.
 */

export enum Palette {
  transparent = "transparent",
  white = "#fff",

  black = "#18191F",
  black800 = "#474A57",
  black700 = "#969BAB",
  black400 = "#DADADA",
  black300 = "#D6D8D6",
  black200 = "#EEEFF4",
  black100 = "#F6F6F6",

  blue = "#1947E5",
  blue800 = "#8094FF",
  blue100 = "#E9E7FC",

  yellow = "#FFBD00",
  yellow800 = "#F9D262",
  yellow100 = "#FFE8B2",

  green = "#00C6AE",
  green800 = "#61E4C5",
  green100 = "#D6FCF7",

  red = "#F95A2C",
  red800 = "#FF9692",
  red100 = "#FFE8E8",

  pink = "#FF89BB",
  pink800 = "#FFC7DE",
  pink100 = "#FFF3F8",

  violette = "#925FF1",
}

export const Colors = {
  dark: Palette.black, // dark, used for blacks
  lightDark: Palette.black800, // light dark
  primary: Palette.violette, // dark blue
  danger: Palette.red, // red
  warning: Palette.yellow, // yellow
  success: Palette.green, // green
  info: Palette.pink, // light blue
  darkGrey: Palette.black700, // dark grey
  midGrey: Palette.black300, // mid grey
  lightGrey: Palette.black100, // light grey

  separator: Palette.black300, // separator color
  text: Palette.black, // text color
  tint: Palette.black300, // tint color
  background: Palette.white,
  grayBackground: Palette.black100, // background color

  tagBackground: Palette.red800, // tag background color
  tabBackground: Palette.white, // tab background color

  chartBarOver: Palette.yellow,
  chartBarNormal: Palette.yellow800,
  chartBarUnder: Palette.yellow100,

  sliderBackground: Palette.black400, // slider background color
  sliderFill: Palette.yellow800, // slider fill color
  
  // colors
  transparent: Palette.transparent,
  white: Palette.white,
}

/**
 * Primary ColorTypes that can be used in some components like Button or Label.
 */
export enum ColorTypes {
  primary = "primary",
  danger = "danger",
  warning = "warning",
  success = "success",
  info = "info",
}
