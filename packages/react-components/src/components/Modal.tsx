import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import closeButton from '../assets/svg/close.svg'

type ModalProps = {
  heading: string
  children: ReactNode
  setShowModal: (val: boolean) => void
}

export function Modal({ heading, children, setShowModal }: ModalProps) {
  const body = document.getElementById('root')

  useEffect(() => {
    if (body) {
      body.style.position = 'fixed'
      return () => {
        body.style.position = 'static'
      }
    }
  }, [])

  return (
    <PopUpOverlay onClick={() => setShowModal(false)}>
      <PopUpWindow onClick={(e) => e.stopPropagation()}>
        <PopUpHeader>
          <PopUpHeading>{heading}</PopUpHeading>
          <CloseButton onClick={() => setShowModal(false)} />
        </PopUpHeader>
        <PopUpContetnt>{children}</PopUpContetnt>
      </PopUpWindow>
    </PopUpOverlay>
  )
}

const PopUpOverlay = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transition: all 0.3s;

  @media (max-width: 600px) {
    padding: 16px;
    align-items: center;
  }
`

const PopUpWindow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 468px;
  max-height: 75vh;
  background-color: white;
  margin: 20vh auto 2vh;
  padding: 24px 24px 32px;
  box-shadow: 10px 10px 31px -2px #a3a1a1;
  border-radius: 5px;
  overflow: scroll;
  z-index: 9998;

  @media (max-width: 600px) {
    padding: 16px 16px 32px;
    margin: 0;
  }
`
const PopUpHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
const PopUpHeading = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
`
const PopUpContetnt = styled.div`
  width: 100%;
`
const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  background-image: url(${closeButton});
  background-color: transparent;
  border: none;
`
