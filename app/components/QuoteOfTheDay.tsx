import React, { useMemo } from "react"
import { useStores } from "@models/index"

import { Cell } from "@common-ui/components/Common"
import { LabelText, SmallText } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"

export default function QuoteOfTheDay() {
  const { quotesStore } = useStores()
  const quoteOfTheDay = useMemo(() => quotesStore.randomQuote, [])

  if (!quoteOfTheDay) return null

  return (
    <Cell innerHorizontal={Spacing.large} vertical={Spacing.medium}>
      <LabelText align="center">
        "{quoteOfTheDay?.quote}"
      </LabelText>
      <SmallText align="center" top={Spacing.small}>{quoteOfTheDay?.author}</SmallText>
    </Cell>
  )
}