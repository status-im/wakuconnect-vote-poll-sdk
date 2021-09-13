import styled, { css } from 'styled-components'
import { orangeTheme, Theme } from '../../style/themes'
import closeButton from '../../assets/svg/close.svg'
import blueCloseButton from '../../assets/svg/blueClose.svg'

export const Button = styled.button`
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  border: 0px;
  outline: none;
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

interface ConnectButtonProps {
  theme: Theme
}

export const ConnectButton = styled(Button)<ConnectButtonProps>`
  padding: 10px 28px;
  color: #ffffff;
  font-weight: bold;
  line-height: 24px;

  &:disabled {
    background: #888888;
    filter: grayscale(1);
  }

  @media (max-width: 600px) {
    padding: 3px 28px;
  }

  background-color: ${({ theme }) => theme.primaryColor};

  &:not(:disabled):hover {
    background: ${({ theme }) => theme.secondaryColor};
  }

  &:not(:disabled):active {
    background: ${({ theme }) => theme.activeBackgroundColor};
  }
`
interface CreateButtonProps {
  theme: Theme
}

export const CreateButton = styled(Button)<CreateButtonProps>`
  width: 343px;
  background-color: ${({ theme }) => theme.primaryColor};
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  margin-bottom: 48px;

  &:not(:disabled):hover {
    background: ${({ theme }) => theme.secondaryColor};
  }
  &:not(:disabled):active {
    background: ${({ theme }) => theme.activeBackgroundColor};
  }

  @media (max-width: 425px) {
    position: fixed;
    bottom: 0;
    z-index: 10;
    margin-bottom: 16px;
    width: calc(100% - 32px);
    padding: 0;
  }
`

interface AccountProps {
  theme: Theme
}

export const Account = styled.button<AccountProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  border: 1px solid #eef2f5;
  box-sizing: border-box;
  border-radius: 21px;
  padding: 11px 12px 11px 17px;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;

  &:hover {
    border: 1px solid ${({ theme }) => theme.primaryColor};
  }
`

interface DisconnectProps {
  theme: Theme
}

export const ButtonDisconnect = styled.button<DisconnectProps>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  padding: 15px 32px;
  color: ${({ theme }) => theme.secondaryColor};
  background: #ffffff;
  border: 1px solid #eef2f5;
  border-radius: 16px 4px 16px 16px;
  box-shadow: 0px 2px 16px rgba(0, 9, 26, 0.12);
  transition: all 0.3s;
  outline: none;

  &.opened {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 10;
  }

  &:hover {
    background: ${({ theme }) => theme.secondaryColor};
    color: #ffffff;
  }

  &:active {
    background: #f4b77e;
    color: ${({ theme }) => theme.activeTextColor};
  }
`
interface CloseProps {
  theme: Theme
}

export const CloseButton = styled.button<CloseProps>`
  width: 24px;
  height: 24px;
  background-image: url(${({ theme }) => (theme === orangeTheme ? closeButton : blueCloseButton)});
  background-color: transparent;
  border: none;
`
