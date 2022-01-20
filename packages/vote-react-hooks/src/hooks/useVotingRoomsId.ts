import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { useEffect, useRef, useState } from 'react'

export function useVotingRoomsId(wakuVoting: WakuVoting) {
  const [votes, setVotes] = useState<number[]>([])
  const votesLength = useRef(0)
  useEffect(() => {
    const interval = setInterval(async () => {
      const newRooms = (await wakuVoting.getProposals()).map((e) => e.id)
      if (newRooms.length != votesLength.current) {
        setVotes(newRooms)
        votesLength.current = newRooms.length
      }
    }, 10000)
    setVotes([])
    wakuVoting.getProposals().then((e) => {
      setVotes(e.map((vote) => vote.id))
      votesLength.current = e.length
    })
    return () => clearInterval(interval)
  }, [wakuVoting])
  return votes
}
