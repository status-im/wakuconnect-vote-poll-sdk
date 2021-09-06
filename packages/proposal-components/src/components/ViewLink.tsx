import React from 'react'
import styled from 'styled-components'
import externalIcon from '../assets/svg/external.svg'

interface ViewLinkProps {
  address: string
}

export function ViewLink({ address }: ViewLinkProps) {
  return <Link href={address}>View on Etherscan</Link>
}

export const Link = styled.a`
  color: #4360df;
  position: relative;
  padding-right: 20px;
  font-size: 15px;
  line-height: 22px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    text-decoration: none;
  }

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-image: url(${externalIcon});
    background-size: contain;
  }
`
