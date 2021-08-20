import React from 'react'
import styled from 'styled-components'
import { RadioButton } from './RadioButton'

type RadioGroupProps = {
  options: string[]
  setSelectedOption: (option: number) => void
  selectedOption: number | undefined
}

export function RadioGroup({ options, setSelectedOption, selectedOption }: RadioGroupProps) {
  return (
    <div>
      {options.map((option, idx) => (
        <RadioButton key={idx} text={option} setOption={setSelectedOption} id={idx} selected={selectedOption === idx} />
      ))}
    </div>
  )
}
