import { useEffect, useState } from 'react'
import useWindowFocus from 'use-window-focus'

const WindowTracker = ({ signal }) => {
  const [lastFocus, setLastFocus] = useState(null)
  const windowFocused = useWindowFocus()

  useEffect(() => {
    const timestamp = Date.now()
    if (!windowFocused) {
      if (document.activeElement && document.activeElement instanceof HTMLIFrameElement && document.hasFocus()) {
        // iframe is selected, should not considered unfocus
      } else {
        setLastFocus(timestamp)
        signal({
          time: timestamp,
          type: 'unfocus',
          msg: 'พบการสลับหน้าต่าง/แท็บ'
        })
      }
    } else if (lastFocus) {
      signal({
        time: timestamp,
        type: 'focus',
        diff: timestamp - lastFocus
      })
      setLastFocus(null)
    }
  }, [windowFocused])

  return null
}

export default WindowTracker