import React, { useEffect, useState, useRef } from 'react'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

export function useVotingRoom(id: number, wakuVoting: WakuVoting) {
  const [votingRoom, setVotingRoom] = useState<VotingRoom | undefined>(undefined)
  useEffect(() => {
    const updateFunction = async () => {
      const votingRoom = await wakuVoting.getVotingRoom(id)
      setVotingRoom(votingRoom)
      if (votingRoom?.timeLeft && votingRoom.timeLeft < 0) {
        clearInterval(interval)
      }
    }
    updateFunction()
    const interval = setInterval(updateFunction, 2000)
    return () => clearInterval(interval)
  }, [id, wakuVoting])

  return votingRoom
}
