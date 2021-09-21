import React, { useEffect, useState, useRef } from 'react'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

export function useVotingRoom(id: number, wakuVoting: WakuVoting) {
  const [votingRoom, setVotingRoom] = useState<VotingRoom | undefined>(undefined)
  const lastTimeLeft = useRef(1)
  useEffect(() => {
    const updateFunction = async () => {
      if (lastTimeLeft.current > 0) {
        const votingRoom = await wakuVoting.getVotingRoom(id)
        setVotingRoom(votingRoom)
        lastTimeLeft.current = votingRoom?.timeLeft ?? 1
      }
    }
    updateFunction()
    const interval = setInterval(updateFunction, 1000)
    return () => clearInterval(interval)
  }, [id, wakuVoting])

  return votingRoom
}
