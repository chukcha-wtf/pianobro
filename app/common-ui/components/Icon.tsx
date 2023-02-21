import React from "react"

import { ColorValue, TextStyle } from "react-native"

import { Feather } from "@expo/vector-icons"

import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"
import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"
import Svg, { Path } from "react-native-svg"

type IconProps = {
  name: keyof typeof Feather.glyphMap
  size?: number
  color?: ColorValue
  style?: TextStyle
} & OffsetProps

/**
 * Icon - is a common component to use icons in the app. It is based on Feather https://materialdesignicons.com/
 * @param {keyof typeof Feather.glyphMap} name - icon name
 * @param {number} size - size of the icon
 * @param {string} color - color of the icon
 * @example
 * <Icon name="alien-outline" size={24} />
 */
export default function Icon({ name, size, color, style, ...props }: IconProps) {
  const styles = useOffsetStyles([style], props)

  return <Feather
    name={name}
    size={size || Spacing.large}
    color={color}
    style={styles} />
}

/**
 * StarFilled - is an svg component to render star icon with the background
 */
export function StarFilled({ size, color = Colors.warning }: Pick<IconProps, "size" | "color">) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 12 11`}
      fill="none">
      <Path
        d="M6.38824 1.0617L7.61421 3.53676C7.64209 3.59958 7.68595 3.654 7.74142 3.69459C7.79689 3.73517 7.86202 3.76051 7.93034 3.76808L10.6367 4.16902C10.7151 4.1791 10.789 4.21126 10.8497 4.26175C10.9105 4.31224 10.9556 4.37898 10.9799 4.45417C11.0041 4.52936 11.0065 4.6099 10.9867 4.68638C10.9669 4.76286 10.9257 4.83213 10.868 4.8861L8.91728 6.82143C8.86749 6.86794 8.83012 6.92617 8.80858 6.99081C8.78703 7.05545 8.78199 7.12445 8.79391 7.19153L9.26425 9.91333C9.27787 9.99154 9.26926 10.072 9.2394 10.1456C9.20955 10.2191 9.15965 10.2828 9.09538 10.3294C9.03111 10.376 8.95505 10.4036 8.87585 10.4091C8.79666 10.4146 8.71751 10.3978 8.64741 10.3605L6.2109 9.07289C6.14851 9.04226 6.07993 9.02633 6.01043 9.02633C5.94092 9.02633 5.87234 9.04226 5.80995 9.07289L3.37344 10.3605C3.30334 10.3978 3.2242 10.4146 3.145 10.4091C3.06581 10.4036 2.98975 10.376 2.92547 10.3294C2.8612 10.2828 2.8113 10.2191 2.78145 10.1456C2.75159 10.072 2.74299 9.99154 2.7566 9.91333L3.22694 7.16069C3.23886 7.09361 3.23382 7.02461 3.21227 6.95997C3.19073 6.89533 3.15336 6.8371 3.10357 6.79059L1.12969 4.8861C1.07129 4.83066 1.03023 4.75947 1.01146 4.68116C0.992698 4.60286 0.997043 4.52079 1.02397 4.4449C1.0509 4.36902 1.09925 4.30256 1.16318 4.2536C1.2271 4.20463 1.30386 4.17526 1.38414 4.16902L4.09052 3.76808C4.15883 3.76051 4.22397 3.73517 4.27943 3.69459C4.3349 3.654 4.37876 3.59958 4.40665 3.53676L5.63261 1.0617C5.666 0.989613 5.71931 0.928583 5.78625 0.885811C5.8532 0.84304 5.93098 0.820313 6.01043 0.820312C6.08987 0.820312 6.16765 0.84304 6.2346 0.885811C6.30154 0.928583 6.35485 0.989613 6.38824 1.0617Z"
        fill={color}
        stroke="#18191F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
