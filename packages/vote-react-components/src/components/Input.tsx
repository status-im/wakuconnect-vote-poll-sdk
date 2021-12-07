import styled from 'styled-components'

export const Input = styled.input`
  max-width: 420px;
  padding: 11px 20px;
  background: #f0f1f3;
  color: #000;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  outline: none;

  &:active,
  &:focus {
    border: 1px solid #5d7be2;
    caret-color: #5d7be2;
  }

  @media (max-width: 600px) {
    max-width: 100%;
  }
`
export const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  padding: 11px 20px;
  margin-bottom: 32px;
  margin-top: 10px;
  font-family: Inter;
  font-style: normal;
  font-size: 15px;
  line-height: 22px;
  text-align: left;
  background: #f0f1f3;
  color: #000;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  outline: none;

  &:active,
  &:focus {
    border: 1px solid #5d7be2;
    caret-color: #5d7be2;
  }

  @media (max-width: 600px) {
    max-width: 100%;
  }
`
