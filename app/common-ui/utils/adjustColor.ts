import { ColorValue } from "react-native"

/**
 * A helpful function to adjust the color by making it lighter or darker.
 * @param color - The color to adjust.
 * @param amount - The amount to adjust the color by. (negative makes it darker, positive makes it lighter)
 * @returns color - The adjusted color.
 */

export function adjustColor(color: ColorValue | undefined, amount: number) {
  if (!color || typeof color !== "string") {
    return color
  }

  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2),
      )
  )
}
