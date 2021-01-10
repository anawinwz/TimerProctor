import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import { getSnapshot, getStream } from '~/utils/camera'
import { detectAllFaces } from '~/utils/faceDetection'
import { showModal } from '~/utils/modal'

const Video = styled('video')`
  pointer-events: none;
  width: 1px;
  height: 1px;
`

const FaceTracker = ({ signal = () => {} }) => {
  const { AttemptStore: attempt } = useStore()
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

  const takeSnapshot = useCallback(() => {
    const video = camInput.current
    const image = getSnapshot(video, { quality: 0.7 })
    attempt.submitSnapshot(image)
  })

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
    const snapshotInterval = setInterval(takeSnapshot, 7000)
    return () => {
      clearInterval(interval)
      clearInterval(snapshotInterval)
    }
  }, [])

  return <Video ref={camInput} autoPlay muted playsInline preload="none" />
}

export default observer(FaceTracker)
