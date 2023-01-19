/**
 * A collection of colors available across the app.
 */

enum Palette {
  transparent = "transparent",
  white = "#fff",

  black = "#318191F",
  black800 = "#474A57",
  black700 = "#969BAB",
  black300 = "#9FA4B4",
  black200 = "#EEEFF4",
  black100 = "#F4F5F7",

  blue = "#1947E5",
  blue800 = "#8094FF",
  blue100 = "#E9E7FC",

  yellow = "#FFBD12",
  yellow800 = "#FFD465",
  yellow100 = "#FFF4CC",

  green = "#00C6AE",
  green800 = "#61E4C5",
  green100 = "#D6FCF7",

  red = "#F95A2C",
  red800 = "#FF9692",
  red100 = "#FFE8E8",

  pink = "#FF89BB",
  pink800 = "#FFC7DE",
  pink100 = "#FFF3F8",
}

export const Colors = {
  dark: Palette.black, // dark, used for blacks
  lightDark: Palette.black800, // light dark
  primary: Palette.blue, // dark blue
  danger: Palette.red, // red
  warning: Palette.yellow, // yellow
  success: Palette.green, // green
  info: Palette.pink, // light blue
  darkGrey: Palette.black700, // dark grey
  midGrey: Palette.black300, // mid grey
  lightGrey: Palette.black200, // light grey used for muted text

  separator: Palette.black300, // separator color
  text: Palette.black, // text color
  tint: Palette.black300, // tint color
  background: Palette.white,
  
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
  support = "support",
}
