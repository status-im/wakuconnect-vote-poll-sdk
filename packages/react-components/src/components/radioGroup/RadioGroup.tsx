import React from 'react'
import styled from 'styled-components'
import { RadioButton } from './RadioButton'

type RadioGroupProps = {
  options: string[]
  setSelectedOption: (option: number) => void
}

export function RadioGroup({ options, setSelectedOption }: RadioGroupProps) {
  return (
    <div>
      {options.map((option, idx) => (
        <RadioButton key={idx} text={option} setOption={() => setSelectedOption(idx)} />
      ))}
    </div>
  )
}
