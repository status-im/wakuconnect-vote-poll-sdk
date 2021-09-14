import React, { useEffect, useState } from 'react'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

export function useVotingRoom(id: number, wakuVoting: WakuVoting) {
  const [votingRoom, setVotingRoom] = useState<VotingRoom | undefined>(undefined)

  useEffect(() => {
    const updateFunction = async () => {
      setVotingRoom(await wakuVoting.getVotingRoom(id))
    }
    updateFunction()
    const interval = setInterval(updateFunction, 10000)
    return () => clearInterval(interval)
  }, [id])

  return votingRoom
}
