import { message } from 'antd'
import { useCallback } from 'react'
import FaceTracker from './FaceTracker'
import WindowTracker from './WindowTracker'

const Trackers = () => {
  const signal = useCallback((sigData) => {
    console.log(sigData)
    if (sigData.msg)
      message.warning(<>{ sigData.msg }<br />อาจารย์ผู้สอน/กรรมการคุมสอบจะได้รับการแจ้งเตือนนี้</>)
  }, [])
  return (
    <>
      <FaceTracker signal={signal} />
      <WindowTracker signal={signal} />
    </>
  )
}

export default Trackers
