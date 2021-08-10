import protons, { TimedPollVote } from 'protons'
import { utils } from 'ethers'
import { TimedPollVoteMsg } from '../../models/TimedPollVoteMsg'

const proto = protons(`
message TimedPollVote {
    bytes id = 1; // id of a poll
    bytes voter = 2; // Address of a voter
    int64 timestamp = 3; // Timestamp of a waku message
    int64 answer = 4; // specified poll answer
    optional bytes tokenAmount = 5; // amount of token used for WEIGHTED voting
    bytes signature = 6; // signature of all above fields
}
`)

export function encode(timedPollVote: TimedPollVoteMsg) {
  try {
    const arrayify = utils.arrayify
    const voteProto: TimedPollVote = {
      id: arrayify(timedPollVote.id),
      voter: arrayify(timedPollVote.voter),
      timestamp: timedPollVote.timestamp,
      answer: timedPollVote.answer,
      tokenAmount: timedPollVote.tokenAmount ? arrayify(timedPollVote.tokenAmount) : undefined,
      signature: arrayify(timedPollVote.signature),
    }

    return proto.TimedPollVote.encode(voteProto)
  } catch {
    return undefined
  }
}

export function decode(payload: Uint8Array, timestamp: Date | undefined) {
  try {
    const msg = proto.TimedPollVote.decode(payload)
    if (!timestamp || timestamp.getTime() != msg.timestamp) {
      return undefined
    }
    if (msg.id && msg.voter && msg.timestamp && msg.answer != undefined && msg.signature) {
      return TimedPollVoteMsg.fromProto(msg)
    }
  } catch {
    return undefined
  }

  return undefined
}

export default { encode, decode }
