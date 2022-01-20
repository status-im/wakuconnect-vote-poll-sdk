import { useEffect, useState } from 'react'
import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { VotingRoom } from '@waku/vote-poll-sdk-core/dist/esm/src/types/PollType'

export function useVotingRoom(id: number, wakuVoting: WakuVoting) {
  const [votingRoom, setVotingRoom] = useState<VotingRoom | undefined>(undefined)
  useEffect(() => {
    const updateFunction = async () => {
      const votingRoom = await wakuVoting.getProposal(id)
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
