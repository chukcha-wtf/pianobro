import React from "react"
import { View, ViewStyle } from "react-native"

import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"

type RowProps = {
  children: React.ReactNode
  wrap?: boolean
  flex?: boolean
  align?: "center" | "space-between" | "space-around" | "space-evenly" | "flex-start" | "flex-end"
} & OffsetProps

type CellProps = {
  children: React.ReactNode
  flex?: boolean
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
} & OffsetProps

/**
 * Row is a flexbox container that lays out its children in a row.
 * @param {React.ReactNode} children - The children to render.
 * @param {boolean} wrap - Whether to wrap the children if they don't fit in a row.
 * @param {boolean} flex - Whether to use flexbox to layout the children.
 * @param {"center" | "space-between" | "space-around" | "space-evenly" | "flex-start" | "flex-end"} align - How to align the children in the row.
 * @param {OffsetProps} props - The offset props.
 * @example
 * <Row align="space-between">
 *   <Text>Text</Text>
 * </Row>
 */
export const Row = ({ children, align, flex, wrap, ...offsetProps }: RowProps) => {
  let styles: ViewStyle[] = [{ flexDirection: "row", alignItems: "center" }]

  styles = useOffsetStyles(styles, offsetProps)

  if (align) {
    styles.push({ justifyContent: align })
  }

  if (flex) {
    styles.push({ flex: 1 })
  }

  if (wrap) {
    styles.push({ flexWrap: "wrap" })
  }

  return <View style={styles}>{children}</View>
}

/**
 * Separator is a thin horizontal line that can be used to separate content.
 * @example
 * <Separator />
 */
const $seprator = { height: 1, width: "100%", backgroundColor: Colors.lightGrey }
export const Separator = () => <View style={$seprator} />

/**
 * Spacer is an empty block that can be used to add space between content.
 * @param {number} height - The height of the spacer (default 16px).
 * @example
 * <Spacer height={Spacing.medium} />
 */
export const Spacer = ({ height }: { height?: number }) => <View style={{ height: height || Spacing.medium }} />

/**
 * Cell is a flexbox container lays out children in a stack
 * @param {React.ReactNode} children - The children to render.
 * @param {boolean} flex - Whether to use flexbox to layout the children.
 * @param {"center" | "flex-start" | "flex-end" | "stretch" | "baseline"} align - How to align the children in the row.
 * @param {OffsetProps} props - The offset props.
 * @example
 * <Row align="space-between">
 *   <Text>Text</Text>
 * </Row>
 */
export const Cell = ({ children, align, flex, ...offsetProps }: CellProps) => {
  let styles: ViewStyle[] = [{ flexDirection: "column", justifyContent: "center" }]

  styles = useOffsetStyles(styles, offsetProps)

  if (align) {
    styles.push({ alignItems: align })
  }

  if (flex) {
    styles.push({ flex: 1 })
  }

  return <View style={styles}>{children}</View>
}
