import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { getStream } from '~/utils/camera'
import { detectAllFaces } from '~/utils/faceDetection'
import { showModal } from '~/utils/modal'

const Video = styled('video')`
  pointer-events: none;
  width: 1px;
  height: 1px;
`

const FaceTracker = ({ signal = () => {} }) => {
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
    const timestamp = Date.now()
    detectAllFaces(video).then(detections => {
      const faces = detections.length
      if (faces === 0 || faces > 1) {
        signal({
          timestamp: timestamp,
          type: 'face',
          facesCount: faces,
          msg: faces === 0 ? 'ไม่พบใบหน้า' : 'พบหลายบุคคลที่หน้าจอ'
        })
      }
    })
  }, [camInput])

  useEffect(() => {
    const interval = setInterval(tracker, 3000)
    return () => clearInterval(interval)
  }, [])

  return <Video ref={camInput} autoPlay muted playsInline preload="none" />
}

export default FaceTracker
