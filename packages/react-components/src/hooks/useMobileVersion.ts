import React, { useEffect, useState } from 'react'
import { useRefSize } from './useRefSize'

export function useMobileVersion(myRef: React.RefObject<HTMLHeadingElement>, sizeThreshold: number) {
  const [mobileVersion, setMobileVersion] = useState(false)
  const { width } = useRefSize(myRef)
  useEffect(() => {
    if (width < sizeThreshold && width > 0) {
      setMobileVersion(true)
    } else {
      setMobileVersion(false)
    }
  }, [width])

  return mobileVersion
}
