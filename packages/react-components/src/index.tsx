import React, { useState, useEffect } from 'react'
import WakuVoting from '@status-waku-voting/core'
import { providers } from 'ethers'
import { PollList } from './PollList'
import styled from 'styled-components'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'

const provider = new providers.Web3Provider((window as any).ethereum)

type ExampleProps = {
  appName: string
}

function Example({ appName }: ExampleProps) {
  const [signer, setSigner] = useState(provider.getSigner())

  const [wakuVoting, setWakuVoting] = useState<WakuVoting | undefined>(undefined)

  const [answers, setAnswers] = useState<string[]>([''])
  const [question, setQuestion] = useState('')
  const [showNewPollBox, setShowNewPollBox] = useState(false)
  const [selectedType, setSelectedType] = useState(PollType.WEIGHTED)

  useEffect(() => {
    ;(window as any).ethereum.on('accountsChanged', async () => {
      provider.send('eth_requestAccounts', [])
      setSigner(provider.getSigner())
    })
    WakuVoting.create(appName, '0x01').then((e) => setWakuVoting(e))
    provider.send('eth_requestAccounts', [])
  }, [])
  return (
    <Wrapper onClick={() => showNewPollBox && setShowNewPollBox(false)}>
      {showNewPollBox && (
        <NewPollBoxWrapper onClick={(e) => e.stopPropagation()}>
          <NewPollBox>
            <NewPollBoxTitle>
              Question
              <CloseNewPollBoxButton onClick={() => setShowNewPollBox(false)}>X</CloseNewPollBoxButton>
            </NewPollBoxTitle>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} />
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
                await wakuVoting?.createTimedPoll(signer, question, answers, selectedType)
                setAnswers([])
              }}
            >
              Send
            </SendButton>
          </NewPollBox>
        </NewPollBoxWrapper>
      )}
      <button onClick={() => setShowNewPollBox(true)}>New Poll</button>
      <PollList wakuVoting={wakuVoting} signer={signer} />
    </Wrapper>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 435px;
  overflow: auto;
  border: 2px solid black;
  padding 10px;
  border-radius: 10px;
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

export { Example }
