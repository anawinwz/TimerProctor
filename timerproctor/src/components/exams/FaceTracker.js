import { message } from 'antd'
import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { getStream, getSnapshot } from '../../utils/camera'
import { detectAllFaces } from '../../utils/faceDetection'
import { showModal } from '../../utils/modal'

const Video = styled('video')`
  pointer-events: none;
  width: 1px;
  height: 1px;
`

const FaceTracker = () => {
  const camInput = useRef()

  useEffect(() => {
    (async () => {
      try {
        const stream = await getStream()
        const videoEl = camInput.current
        videoEl.srcObject = stream
      } catch (err) {
        console.log(err)
        showModal('error', 'ไม่พบกล้องของคุณ')
      }
    })()
  }, [])

  const tracker = useCallback(() => {
    const video = camInput.current
    detectAllFaces(video).then(detections => {
      if (detections.length === 0) {
        message.warning(<p>ไม่พบใบหน้าของคุณ<br />อาจารย์ผู้สอน/กรรมการจะได้รับการแจ้งเตือนนี้</p>)
      } else if (detections.length > 1) {
        message.warning(<p>พบหลายบุคคลที่หน้าจอ<br />อาจารย์ผู้สอน/กรรมการจะได้รับการแจ้งเตือนนี้</p>)
      }
      console.log('[tracker]', detections)
    })
  }, [camInput])

  useEffect(() => {
    const interval = setInterval(tracker, 7000)
    return () => clearInterval(interval)
  }, [])

  return <Video ref={camInput} autoPlay muted playsInline preload="none" />
}

export default FaceTracker
