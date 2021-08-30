import React, { useState } from 'react'
import { Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import WakuVoting from '@status-waku-voting/core'
import { Input } from '../components/Input'
import addIcon from '../assets/svg/addIcon.svg'
import closeButton from '../assets/svg/close.svg'
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
      <NewPollBox>
        <NewPollBoxTitle>
          Create a poll
          <CloseNewPollBoxButton onClick={() => setShowPollCreation(false)} />
        </NewPollBoxTitle>
        <PollForm>
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
          <NewOptionButton
            onClick={(e) => {
              e.preventDefault()
              setAnswers((answers) => [...answers, ''])
            }}
          >
            Add another option
          </NewOptionButton>
          <SmallButton
            onClick={async (e) => {
              e.preventDefault()
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
            Create a poll
          </SmallButton>
        </PollForm>
      </NewPollBox>
    </NewPollBoxWrapper>
  )
}

const CloseNewPollBoxButton = styled.button`
  width: 24px;
  height: 24px;
  background-image: url(${closeButton});
  background-color: transparent;
  border: none;
`

const NewPollBoxTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
`

const NewOptionButton = styled.button`
  display: flex;
  position: relative;
  font-size: 15px;
  line-height: 22px;
  margin: 32px 0;
  padding-right: 30px;
  color: #a53607;
  background-color: transparent;
  border: none;

  &:hover {
    color: #f4b77e;
  }

  &:active {
    color: #a53607;
  }

  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
    width: 20px;
    background-color: #a53607;
    -webkit-mask-size: cover;
    mask-size: cover;
    background-image: none;
    -webkit-mask-image: url(${addIcon});
    mask-image: ${addIcon};
  }

  &:hover::after {
    background-color: #f4b77e;
  }
`

const AnswersWraper = styled.div`
  max-width: 340px;
  width: 100%;
`

const NewPollBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  padding: 24px 24px 32px;
  box-shadow: 10px 10px 31px -2px #a3a1a1;
  border-radius: 5px;
  overflow: auto;
  z-index: 9998;
  width: 468px;

  @media (max-width: 600px) {
    padding: 16px 16px 32px;
  }
`

const NewPollBoxWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transition: all 0.3s;
  overflow: auto;

  @media (max-width: 600px) {
    padding: 16px;
  }
`
const PollForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  line-height: 22px;
`
