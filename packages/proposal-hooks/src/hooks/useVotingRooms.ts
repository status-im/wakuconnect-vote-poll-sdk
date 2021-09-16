import { id } from '@ethersproject/hash'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import React, { useEffect, useRef, useState } from 'react'

export function useVotingRooms(wakuVoting: WakuVoting) {
  const [votes, setVotes] = useState<VotingRoom[]>([])
  const hash = useRef('')
  useEffect(() => {
    const interval = setInterval(async () => {
      const newRooms = await wakuVoting.getVotingRooms()
      const newHash = id(newRooms.map((votingRoom) => votingRoom.id.toString()).join(''))
      if (newHash != hash.current) {
        setVotes(newRooms)
        hash.current = newHash
      }
    }, 10000)
    wakuVoting.getVotingRooms().then((e) => {
      setVotes(e)
      hash.current = id(e.map((votingRoom) => votingRoom.id.toString()).join(''))
    })
    return () => clearInterval(interval)
  }, [])
  return votes
}
