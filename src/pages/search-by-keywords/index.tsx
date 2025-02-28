import React from 'react'
import { SubjectTypes } from 'src/types/acl/subjectTypes'
import MarketIntelligence from 'src/views/apps/market-intelligence/MarketIntelligence'

const MarketIntelligencePage = () => {
  return <MarketIntelligence />
}

MarketIntelligencePage.acl = {
  action: 'read',
  subject: SubjectTypes.MarketIntelligencePage
}

export default MarketIntelligencePage
