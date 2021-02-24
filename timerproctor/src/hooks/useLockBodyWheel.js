import { useState, useEffect, useCallback } from 'react'

const useLockBodyWheel = () => {
  const [locked, setLock] = useState(false)
  
  const onWheelLocked = useCallback(e => e.preventDefault(), [])

  useEffect(() => {
    if (locked) document.body.addEventListener('wheel', onWheelLocked, { passive: false })
    else document.body.removeEventListener('wheel', onWheelLocked, { passive: false })
  }, [locked])

  return [locked, setLock]
}

export default useLockBodyWheel
