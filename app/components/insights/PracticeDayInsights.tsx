import React from "react"

import { Card } from "@common-ui/components/Card"
import { Cell, Row } from "@common-ui/components/Common"
import { HugeTitle, MediumText, MediumTitle } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { translate } from "@i18n/translate"

type PracticeDayInsightsProps = {
  insights: [number, number, number]
}

export default function PracticeDayInsights(props: PracticeDayInsightsProps) {
  const { insights } = props
  const [lastWeekDays] = insights

  return (
    <Card bottom={Spacing.medium}>
      <Row wrap>
        <Cell right={Spacing.large}>
          <HugeTitle align="center">
            {lastWeekDays}
          </HugeTitle>
          <MediumTitle align="center">
            {translate("insights.days", { count: lastWeekDays })}
          </MediumTitle>
        </Cell>
        <Cell flex>
          <MediumText muted bottom={Spacing.small}>
            {translate("insights.daysPracticedText")}
          </MediumText>
        </Cell>
      </Row>
    </Card>
  )
}