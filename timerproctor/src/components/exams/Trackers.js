
import { useCallback } from 'react'
import { message } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import FaceTracker from './FaceTracker'
import WindowTracker from './WindowTracker'

const Trackers = () => {
  const { SocketStore: socketStore } = useStore()
  const signal = useCallback((sigData) => {
    if (sigData.msg) {
      message.warning(<>{ sigData.msg }<br />อาจารย์ผู้สอน/กรรมการคุมสอบจะได้รับการแจ้งเตือนนี้</>)
    }
    delete sigData.msg
    
    socketStore.socket.emit('signal', sigData, data => {
      if (data.err) console.log('signal error')
    })
  }, [])
  return (
    <>
      <FaceTracker signal={signal} />
      <WindowTracker signal={signal} />
    </>
  )
}

export default observer(Trackers)
