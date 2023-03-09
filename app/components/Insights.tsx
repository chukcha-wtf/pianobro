import React from "react"
import { observer } from "mobx-react-lite"

import ActivitiesInsights from "./insights/ActivitiesInsights"
import PracticeDayInsights from "./insights/PracticeDayInsights"
import PracticeTimeInsights from "./insights/PracticeTimeInsights"
import { useStores } from "@models/index"

const Insights = observer(
  function Insights() {
    const { statisticsStore } = useStores()

    const insights = statisticsStore.insights

    return (
      <>
        <PracticeDayInsights insights={insights.days} />
        <ActivitiesInsights insights={insights.activities} />
        <PracticeTimeInsights insights={insights.time} />
      </>
    )
  }
)

export default Insights
