import React, { useState } from 'react'
import { Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import WakuVoting from '@status-waku-voting/core'
import { Input } from '../components/Input'
import addIcon from '../assets/svg/addIcon.svg'
import { SmallButton } from '../components/misc/Buttons'

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
  const [answers, setAnswers] = useState<string[]>(['', ''])
  const [question, setQuestion] = useState('')
  const [selectedType, setSelectedType] = useState(PollType.NON_WEIGHTED)
  const [endTimePicker, setEndTimePicker] = useState(new Date(new Date().getTime() + 10000000))

  return (
    <NewPollBoxWrapper onClick={(e) => e.stopPropagation()}>
      <BoxWrapper>
        <NewPollBox>
          <NewPollBoxTitle>
            Create a poll
            <CloseNewPollBoxButton onClick={() => setShowPollCreation(false)}>X</CloseNewPollBoxButton>
          </NewPollBoxTitle>
          <Input
            label={'Question or title of the poll'}
            placeholder={'E.g. What is your favourite color?'}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <AnswersWraper>
            {answers.map((answer, idx) => (
              <Input
                key={idx}
                label={`Option ${idx + 1}`}
                value={answer}
                onChange={(e) =>
                  setAnswers((answers) => {
                    const newAnswers = [...answers]
                    newAnswers[idx] = e.target.value
                    return newAnswers
                  })
                }
              />
            ))}
          </AnswersWraper>
          <NewOptionButton onClick={() => setAnswers((answers) => [...answers, ''])}>
            Add another option
            <AddIcon />
          </NewOptionButton>
          <SmallButton
            onClick={async () => {
              await wakuVoting?.createTimedPoll(
                signer,
                question,
                answers,
                selectedType,
                undefined,
                endTimePicker.getTime()
              )
              setShowPollCreation(false)
            }}
          >
            Send
          </SmallButton>
        </NewPollBox>
      </BoxWrapper>
    </NewPollBoxWrapper>
  )
}

const AddIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url(${addIcon});
  margin-left: 10px;
`

const CloseNewPollBoxButton = styled.div`
  width: 5px;
  margin-right: 5px;
  margin-left: auto;
  font-weight: bold;
  color: red;
`

const NewPollBoxTitle = styled.div`
  display: flex;
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
`

const NewOptionButton = styled.div`
  margin-top: 33px;
  margin-bottom: 33px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  font-family: 'Inter, sans-serif';
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
`

const AnswersWraper = styled.div`
  margin-left: 64px;
  margin-right: 64px;
`

const NewPollBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  box-shadow: 10px 10px 31px -2px #a3a1a1;
  border-radius: 5px;
  overflow: auto;
  z-index: 8;
  width: 468px;
`

const BoxWrapper = styled.div`
  position: absolute;
  marign-bottom: 100px;
  left: 0px;
  top: 0px;
`

const NewPollBoxWrapper = styled.div`
  position: relative;
  top: 10px;
  left: 10px;
`
