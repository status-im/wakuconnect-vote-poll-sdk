import React, { useState } from 'react'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { CloseButton } from '@status-waku-voting/react-components/dist/esm/src/components/misc/Buttons'
import styled from 'styled-components'
import { NotificationLink } from './ViewLink'

interface NotificationItemProps {
  text: string
  address: string
}

export function NotificationItem({ address, text }: NotificationItemProps) {
  const [show, setShow] = useState(true)

  if (show) {
    return (
      <NotificationBlock>
        <NotificationContent>
          <NotificationText>{text}</NotificationText>
          <NotificationLink address={address} />
        </NotificationContent>
        <CloseButton theme={blueTheme} onClick={() => setShow(false)} />
      </NotificationBlock>
    )
  }
  return null
}

const NotificationBlock = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px;
  width: 252px;
  border-radius: 16px;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15));
  position: absolute;
  top: 120px;
  right: 24px;
  z-index: 9999;

  @media (max-width: 768px) {
    right: 32px;
  }

  @media (max-width: 600px) {
    top: 74px;
    right: 16px;
  }
`

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const NotificationText = styled.p`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  margin: 0;
  margin-bottom: 16px;
`
