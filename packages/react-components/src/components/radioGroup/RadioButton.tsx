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
  box-shadow: 0px 1px 2px rgba(31, 41, 55, 0.08);
  flex-shrink: 0;

  &.icon {
    background-image: url(${checkIcon});
    background-size: cover;
    border: 1px solid #ffb571;
  }

  &:hover {
    border: 1px solid #ffb571;
    border-radius: 50%;
  }
`

const TextWrapper = styled.div`
  margin-left: 16px;
  font-size: 22px;
  line-height: 24px;
`
