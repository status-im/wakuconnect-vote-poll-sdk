declare module 'protons' {
    export enum PollType {
        WEIGHTED = 0,
        NON_WEIGHTED = 1
    }
    export type PollInit = {
        owner: Uint8Array
        timestamp: number
        question: string
        answers: string[]
        pollType: PollType
        minToken?: Uint8Array
        endTime: number
        signature: Uint8Array
    }

    export type TimedPollVote = {
        pollId: Uint8Array
        voter: Uint8Array
        timestamp: number
        answer: number
        tokenAmount?: Uint8Array
        signature: Uint8Array
    }

    function protons(init: string): {
        PollInit: {
            encode: (pollInit: PollInit) => Uint8Array,
            decode: (payload: Uint8Array | undefined) => PollInit
        }
        TimedPollVote:{
            encode: (timedPollVote: TimedPollVote) => Uint8Array,
            decode: (payload: Uint8Array | undefined) => TimedPollVote
        }
    }
    export = protons
}