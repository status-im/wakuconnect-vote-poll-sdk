import React, { useState, useRef, useEffect } from 'react'
import { WakuVoting } from '@status-waku-voting/core'
import { VoteMsg } from '@status-waku-voting/core/dist/esm/src/models/VoteMsg'
import { utils, BigNumber } from 'ethers'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

export function useRoomWakuVotes(votingRoom: VotingRoom | undefined, wakuVoting: WakuVoting) {
  const [votes, setVotes] = useState<VoteMsg[]>([])
  const [sum, setSum] = useState(BigNumber.from(0))
  const [modifiedVotingRoom, setModifiedVotingRoom] = useState(votingRoom)
  const hash = useRef('')

  useEffect(() => {
    const updateVotes = async () => {
      if (!votingRoom) {
        return
      }
      const newVotes = await wakuVoting.getRoomWakuVotes(votingRoom.id)
      if (newVotes) {
        const newHash = utils.id(newVotes.wakuVotes.map((vote) => vote.id).join(''))
        if (newHash != hash.current) {
          hash.current = newHash
          setVotes(newVotes.wakuVotes)
          setSum(newVotes.sum)
          setModifiedVotingRoom(newVotes.newVotingRoom)
        }
      }
    }
    updateVotes()
    const interval = setInterval(updateVotes, 1000)
    return () => clearInterval(interval)
  }, [wakuVoting, votingRoom])

  return { votes, sum, modifiedVotingRoom }
}
