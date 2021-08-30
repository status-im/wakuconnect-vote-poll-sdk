import styled from 'styled-components'

export const Button = styled.button`
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  border: 0px;
`

export const SmallButton = styled(Button)`
  width: 187px;
  background-color: #fff7ed;
  color: #a53607;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  transition: all 0.3s;

  &:not(:disabled):hover {
    background: #ffe4db;
  }

  &:not(:disabled):active {
    background: #fffcf7;
  }

  &:disabled {
    background: #f3f3f3;
    color: #939ba1;
  }
`
