import React, { useState, useEffect } from 'react'
import WakuVoting from '@status-waku-voting/core'
import { useEthers } from '@usedapp/core'
import { providers } from 'ethers'
import { PollList } from './PollList'
import styled from 'styled-components'
import { PollCreation } from './PollCreation'
import { Button } from '../components/misc/Buttons'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Modal } from '../components/Modal'
import { Networks } from '../components/Networks'

type WakuPollingProps = {
  appName: string
  signer: JsonRpcSigner | undefined
  localhost?: boolean
}

function WakuPolling({ appName, signer, localhost }: WakuPollingProps) {
  const { activateBrowserWallet, account } = useEthers()
  const [wakuVoting, setWakuVoting] = useState<WakuVoting | undefined>(undefined)
  const [showPollCreation, setShowPollCreation] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)

  let waku: any | undefined = undefined
  if (localhost) {
    waku = {
      messages: {},
      relay: {
        send(msg: any) {
          if (!(this as any).messages[msg.contentTopic]) {
            ;(this as any).messages[msg.contentTopic] = []
          }
          ;(this as any).messages[msg.contentTopic] = [...(this as any).messages[msg.contentTopic], msg]
        },
      },
      store: {
        queryHistory(topic: any) {
          return (this as any).messages[topic[0]]
        },
      },
    }
    waku.relay.send = waku.relay.send.bind(waku)
    waku.store.queryHistory = waku.store.queryHistory.bind(waku)
  }
  useEffect(() => {
    WakuVoting.create(appName, '0x01', waku).then((e) => setWakuVoting(e))
  }, [])

  return (
    <Wrapper>
      {showPollCreation && signer && (
        <PollCreation signer={signer} wakuVoting={wakuVoting} setShowPollCreation={setShowPollCreation} />
      )}
      {account ? (
        <CreatePollButton disabled={!signer} onClick={() => setShowPollCreation(true)}>
          Create a poll
        </CreatePollButton>
      ) : (
        <CreatePollButton
          onClick={() => {
            if ((window as any).ethereum) {
              activateBrowserWallet()
            } else setSelectConnect(true)
          }}
        >
          Connect to vote
        </CreatePollButton>
      )}
      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect}>
          <Networks />
        </Modal>
      )}

      <PollList wakuVoting={wakuVoting} signer={signer} />
    </Wrapper>
  )
}

const CreatePollButton = styled(Button)`
  width: 343px;
  background-color: #ffb571;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  margin-bottom: 48px;

  &:not(:disabled):hover {
    background: #a53607;
  }

  &:not(:disabled):active {
    background: #f4b77e;
  }

  @media (max-width: 425px) {
    position: fixed;
    bottom: 0;
    z-index: 10;
    margin-bottom: 16px;
    width: calc(100% - 32px);
    padding: 0;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1146px;
  position: relative;
  margin: 0 auto;
  padding: 150px 32px 50px;
  width: 100%;

  @media (max-width: 1146px) {
    max-width: 780px;
  }

  @media (max-width: 600px) {
    padding: 132px 16px 32px;
  }

  @media (max-width: 425px) {
    padding: 96px 16px 84px;
  }
`

export default WakuPolling
