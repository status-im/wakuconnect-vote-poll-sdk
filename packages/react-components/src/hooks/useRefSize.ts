import React, { useEffect, useState } from 'react'

export function useRefSize(myRef: React.RefObject<HTMLHeadingElement>) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const setDimensions = () => {
    if (myRef?.current?.offsetWidth) {
      setWidth(myRef?.current?.offsetWidth)
    }
    if (myRef?.current?.offsetHeight) {
      setHeight(myRef?.current?.offsetHeight)
    }
  }

  useEffect(() => {
    setDimensions()
    window.addEventListener('resize', setDimensions)
    return () => {
      window.removeEventListener('resize', setDimensions)
    }
  }, [myRef])

  return { width, height }
}
