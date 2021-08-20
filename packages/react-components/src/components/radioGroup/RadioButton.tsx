import React from 'react'
import styled from 'styled-components'
import checkIcon from '../../assets/svg/checkIcon.svg'

type RadioButtonProps = {
  text: string
  setOption: (id: number) => void
  selected: boolean
  id: number
}

export function RadioButton({ text, setOption, id, selected }: RadioButtonProps) {
  return (
    <Wrapper onClick={() => setOption(id)}>
      <Circle className={selected ? 'icon' : ''} />
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

  &:hover {
    border: 1px solid #a53607;
  }
`

const TextWrapper = styled.div`
  margin-left: 20px;
  width: 300px;
  font-size: 22px;
`
