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
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;

  &:hover {
    border: 1px solid #a53607;
  }
`
