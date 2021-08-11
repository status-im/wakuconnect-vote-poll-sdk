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

  const [answers, setAnswers] = useState<string[]>([])
  const [question, setQuestion] = useState('')

  const [selectedType, setSelectedType] = useState(PollType.WEIGHTED)

  useEffect(() => {
    ;(window as any).ethereum.on('accountsChanged', async () => setSigner(provider.getSigner()))
    WakuVoting.create(appName, '0x01').then((e) => setWakuVoting(e))
  }, [])

  return (
    <Wrapper>
      <PollList wakuVoting={wakuVoting} signer={signer} />
      <NewPollBox>
        Question
        <input value={question} onChange={(e) => setQuestion(e.target.value)} />
        Answers
        <button onClick={() => setAnswers((answers) => [...answers, ''])}>Add answer</button>
        {answers.map((answer, idx) => (
          <input
            key={idx}
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
        <div onChange={(e) => setSelectedType(Number.parseInt((e.target as any).value))}>
          <input type="radio" value={PollType.WEIGHTED} name="newPollType" /> Weighted
          <input type="radio" value={PollType.NON_WEIGHTED} name="newPollType" /> Non weighted
        </div>
        <button
          onClick={async () => {
            await wakuVoting?.createTimedPoll(signer, question, answers, selectedType)
            setAnswers([])
          }}
        >
          Send
        </button>
      </NewPollBox>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
`

const NewPollBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding: 20px;
  box-shadow: 10px 10px 31px -2px #a3a1a1;
`

export { Example }
