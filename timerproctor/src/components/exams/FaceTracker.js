import { useEffect, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import { getSnapshot, getStream } from '~/utils/camera'
import { getInputCanvas, detectAllFaces } from '~/utils/faceDetection'
import { showModal } from '~/utils/modal'

const Video = styled('video')`
  pointer-events: none;
  width: 1px;
  height: 1px;
`

const FaceTracker = ({ signal = () => {} }) => {
  const { AttemptStore: attempt } = useStore()
  const camInput = useRef()
  
  const [firstAbnormal, setFirstAbnormal] = useState(null)

  useEffect(() => {
    let stream
    (async () => {
      try {
        stream = await getStream()
        const videoEl = camInput.current
        videoEl.srcObject = stream
      } catch (err) {
        console.log(err)
        showModal('error', 'ไม่พบกล้องของคุณ')
      }
    })()
    return () => {
      try {
        stream.getTracks().forEach(track => track.stop())
      } catch {}
    }
  }, [])

  const takeSnapshot = useCallback(async () => {
    const video = camInput.current
    const timestamp = Date.now()

    const image = getSnapshot(video, { maxWidthOrHeight: 360, quality: 0.6 })
    
    const input = await getInputCanvas(image)
    const facesCount = (await detectAllFaces(input)).length
    
    attempt.submitSnapshot(image, facesCount, timestamp)
  })

  const tracker = useCallback(() => {
    const video = camInput.current
    const timestamp = Date.now()
    detectAllFaces(video).then(detections => {
      const faces = detections.length
      
      if (firstAbnormal && faces === 1) {
        signal({
          timestamp: timestamp,
          type: 'face',
          facesCount: faces,
          diff: timestamp - firstAbnormal
        })
        setFirstAbnormal(null)
      } else {
        let msg = ''
        if (faces === 0 || faces > 1) {
          setFirstAbnormal(timestamp)
          msg = faces === 0 ? 'ไม่พบใบหน้า' : 'พบหลายบุคคลที่หน้าจอ'
        }

        signal({
          timestamp: timestamp,
          type: 'face',
          facesCount: faces,
          msg: msg
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
