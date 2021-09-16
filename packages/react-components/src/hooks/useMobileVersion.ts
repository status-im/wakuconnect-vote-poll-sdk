import React, { useEffect, useState } from 'react'

export function useMobileVersion(myRef: React.RefObject<HTMLHeadingElement>, sizeThreshold: number) {
  const [mobileVersion, setMobileVersion] = useState(false)

  useEffect(() => {
    const checkDimensions = () => {
      const width = window.innerWidth
      if (width && width < sizeThreshold && width > 0) {
        if (mobileVersion === false) {
          setMobileVersion(true)
        }
      } else {
        if (mobileVersion === true) {
          setMobileVersion(false)
        }
      }
    }
    checkDimensions()
    window.addEventListener('resize', checkDimensions)
    return () => {
      window.removeEventListener('resize', checkDimensions)
    }
  }, [myRef, mobileVersion])

  return mobileVersion
}
