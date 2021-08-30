import React, { useEffect, useState } from 'react'
import { WakuPolling } from '@status-waku-voting/react-components'
import styled from 'styled-components'
import { TopBar } from '../components/TopBar'
import pollingIcon from '../assets/images/pollingIcon.svg'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'

export function Polling() {
  const { account, library } = useEthers()
  const [signer, setSigner] = useState<undefined | JsonRpcSigner>(undefined)

  useEffect(() => {
    setSigner(library?.getSigner())
  }, [account])

  return (
    <Wrapper>
      <TopBar logo={pollingIcon} title={'Polling Dapp'} />
      <WakuPolling appName={'testApp_'} signer={signer} localhost={process.env.ENV === 'localhost'} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`
