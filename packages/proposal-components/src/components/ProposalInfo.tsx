import React from 'react'
import styled from 'styled-components'
import { ViewLink } from './ViewLink'

type ProposalInfoProps = {
  heading: string
  text: string
  address: string
}

export function ProposalInfo({ heading, text, address }: ProposalInfoProps) {
  return (
    <Card>
      <CardHeading>{heading}</CardHeading>
      <CardText>{text}</CardText>
      <ViewLink address={address} />
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px 0px 0px 6px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    padding-bottom: 0;
  }
  @media (max-width: 600px) {
    padding: 0;
  }
`

const CardHeading = styled.div`
  height: 56px;
  font-weight: bold;
  font-size: 22px;
  line-height: 24px;
  margin-bottom: 8px;
`

const CardText = styled.div`
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 16px;
`
