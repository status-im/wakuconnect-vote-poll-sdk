import React, { useState } from 'react'
import styled from 'styled-components'
import checkIcon from '../../assets/svg/checkIcon.svg'

type RadioButtonProps = {
  text: string
  setOption: () => void
}

export function RadioButton({ text, setOption }: RadioButtonProps) {
  const [icon, setIcon] = useState(false)
  return (
    <Wrapper onClick={() => setIcon(!icon)}>
      <Circle className={icon ? 'icon' : ''} />
      <TextWrapper>{text}</TextWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 48px;
`

const Circle = styled.div`
  border: 1px solid gray;
  border-radius: 50%;
  width: 24px;
  height: 24px;

  &.icon {
    border: 1px solid rgba(255, 255, 255, 1);
    background-image: url(${checkIcon});
    background-size: cover;
  }
`

const TextWrapper = styled.div`
  margin-left: 20px;
  font-size: 22px;
`
