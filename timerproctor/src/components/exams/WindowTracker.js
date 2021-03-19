import { useEffect, useState } from 'react'
import useWindowFocus from '~/hooks/useWindowFocus'

const WindowTracker = ({ signal }) => {
  const [firstUnfocus, setFirstUnfocus] = useState(null)
  const windowFocused = useWindowFocus(true)

  useEffect(() => {
    const timestamp = Date.now()
    if (!windowFocused) {
      if (document.activeElement && document.activeElement instanceof HTMLIFrameElement && document.hasFocus()) {
        // iframe is selected, should not considered unfocus
      } else {
        setFirstUnfocus(timestamp)
        signal({
          timestamp: timestamp,
          type: 'window',
          event: 'unfocus',
          msg: 'พบการสลับหน้าต่าง/แท็บ'
        })
      }
    } else if (lastFocus) {
      signal({
        timestamp: timestamp,
        type: 'window',
        event: 'focus',
        diff: timestamp - firstUnfocus
      })
      setFirstUnfocus(null)
    }
  }, [windowFocused])

  return null
}

export default WindowTracker
