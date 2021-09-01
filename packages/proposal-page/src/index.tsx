import React from 'react'
import { useTest } from '@status-waku-voting/proposal-hooks'
import { Proposal } from '@status-waku-voting/proposal-components'

export function ProposalPage() {
  useTest()
  return (
    <div>
      <Proposal />
    </div>
  )
}
