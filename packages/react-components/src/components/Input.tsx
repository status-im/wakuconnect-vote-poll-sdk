import React from 'react'
import styled from 'styled-components'
type InputProps = {
  label: string
  value: string
  onChange: (e: any) => void
  placeholder?: string
}

export function Input({ label, value, onChange, placeholder }: InputProps) {
  return (
    <InputWrapper>
      <LabelWrapper>{label}</LabelWrapper>
      <StyledInput value={value} onChange={onChange} placeholder={placeholder} />
    </InputWrapper>
  )
}

const StyledInput = styled.input`
  background-color: #eef2f5;
  border-radius: 8px;
  border: 0px;
  height: 44px;
  padding-left: 20px;
  font-size: 15px;
  border: 1px solid #eef2f5;
  outline: none;

  &::placeholder {
    font-size: 15px;
    line-height: 22px;
  }

  &:active,
  &:focus {
    border: 1px solid #ffb571;
    caret-color: #ffb571;
  }
`

const LabelWrapper = styled.div`
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 10px;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  width: 100%;
`
