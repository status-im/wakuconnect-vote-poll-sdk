import React, { useEffect, useState } from 'react'
import { Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import WakuVoting from '@status-waku-voting/core'
import { Input, addIcon, SmallButton, Modal } from '@status-waku-voting/react-components'

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
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false)
  const [selectedType, setSelectedType] = useState(PollType.NON_WEIGHTED)
  const [endTimePicker, setEndTimePicker] = useState(new Date(new Date().getTime() + 10000000))

  return (
    <Modal heading="Create a poll" setShowModal={setShowPollCreation}>
      <NewPollBox>
        {!showCreateConfirmation && (
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
                setShowCreateConfirmation(true)
              }}
            >
              Create a poll
            </SmallButton>
          </PollForm>
        )}

        {showCreateConfirmation && (
          <Confirmation>
            <ConfirmationText>
              Your poll has been created!
              <br />
              It will appear at the top of the poll list.
            </ConfirmationText>
            <SmallButton
              onClick={(e) => {
                e.preventDefault()
                setShowPollCreation(false)
              }}
            >
              Close
            </SmallButton>
          </Confirmation>
        )}
      </NewPollBox>{' '}
    </Modal>
  )
}

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
`

const PollForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  line-height: 22px;
  width: 100%;
`
const Confirmation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const ConfirmationText = styled.div`
  text-align: center;
  margin: 32px 0;
`