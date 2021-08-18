import React, { useState } from 'react'
import { Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import WakuVoting from '@status-waku-voting/core'

function getLocaleIsoTime(dateTime: Date) {
  const MS_PER_MINUTE = 60000
  const milliseconds = dateTime.getTime() - dateTime.getTimezoneOffset() * MS_PER_MINUTE
  const newDate = new Date(milliseconds)
  return newDate.toISOString().slice(0, -8)
}

type PollCreationProps = {
  signer: JsonRpcSigner | Wallet
  wakuVoting: WakuVoting | undefined
  setShowPollCreation: (val: boolean) => void
}

export function PollCreation({ signer, wakuVoting, setShowPollCreation }: PollCreationProps) {
  const [answers, setAnswers] = useState<string[]>([''])
  const [question, setQuestion] = useState('')
  const [selectedType, setSelectedType] = useState(PollType.WEIGHTED)
  const [endTimePicker, setEndTimePicker] = useState(new Date(new Date().getTime() + 10000000))

  return (
    <NewPollBoxWrapper onClick={(e) => e.stopPropagation()}>
      <NewPollBox>
        <NewPollBoxTitle>
          Question
          <CloseNewPollBoxButton onClick={() => setShowPollCreation(false)}>X</CloseNewPollBoxButton>
        </NewPollBoxTitle>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} />
        Poll end time
        <input
          type="datetime-local"
          value={getLocaleIsoTime(endTimePicker)}
          onChange={(e) => setEndTimePicker(new Date(e.target.value))}
        />
        Answers
        <button onClick={() => setAnswers((answers) => [...answers, ''])}>Add answer</button>
        {answers.map((answer, idx) => (
          <AnswerWraper key={idx}>
            <AnswerInput
              value={answer}
              onChange={(e) =>
                setAnswers((answers) => {
                  const newAnswers = [...answers]
                  newAnswers[idx] = e.target.value
                  return newAnswers
                })
              }
            />
            <RemoveAnswerButton
              onClick={() =>
                setAnswers((answers) => {
                  const newAnswers = [...answers]
                  if (newAnswers.length > 1) {
                    newAnswers.splice(idx, 1)
                  }
                  return newAnswers
                })
              }
            >
              -
            </RemoveAnswerButton>
          </AnswerWraper>
        ))}
        <div onChange={(e) => setSelectedType(Number.parseInt((e.target as any).value))}>
          <input type="radio" value={PollType.WEIGHTED} name="newPollType" /> Weighted
          <input type="radio" value={PollType.NON_WEIGHTED} name="newPollType" /> Non weighted
        </div>
        <SendButton
          onClick={async () => {
            await wakuVoting?.createTimedPoll(
              signer,
              question,
              answers,
              selectedType,
              undefined,
              endTimePicker.getTime()
            )
            setAnswers([''])
            setShowPollCreation(false)
          }}
        >
          Send
        </SendButton>
      </NewPollBox>
    </NewPollBoxWrapper>
  )
}
const CloseNewPollBoxButton = styled.div`
  width: 5px;
  margin-right: 5px;
  margin-left: auto;
  font-weight: bold;
`

const NewPollBoxTitle = styled.div`
  display: flex;
`

const AnswerInput = styled.input`
  margin-right: 5px;
  width: 200px;
`

const RemoveAnswerButton = styled.button`
  margin-right: 5px;
  margin-left: auto;
`

const SendButton = styled.button`
  margin: 10px;
`

const AnswerWraper = styled.div`
  display: flex;
  margin: 5px;
  width: 250px;
`

const NewPollBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 20px;
  padding: 20px;
  box-shadow: 10px 10px 31px -2px #a3a1a1;
  border-radius: 5px;
  overflow: auto;
  z-index: 1;
  width: 300px;
  height: 300px;
  position: absolute;
  left: 0px;
  top: 0px;
`

const NewPollBoxWrapper = styled.div`
  position: relative;
  top: 10px;
  left: 10px;
`
