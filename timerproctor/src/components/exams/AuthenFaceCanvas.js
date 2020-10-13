import styled from 'styled-components'
import { createRef, useState, useEffect, useCallback } from 'react'
import { Alert, Modal, Button, Space } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import { getInputCanvas, loadModel } from '../../utils/faceDetection'
import { getStream, getSnapshot } from '../../utils/camera'
import { detectSingleFace } from 'face-api.js'

const Video = styled('video')`
  background: #d8d8d8;
  width: 100%;
`

const AuthenFaceCanvas = () => {
  const [camState, setCamState] = useState(['LOADING', ''])
  const camInput = createRef()

  useEffect(() => {
    (async () => {
      try {
        await loadModel()
      } catch (err) {
        return setCamState(['FAILED', 'ไม่สามารถโหลดข้อมูลที่จำเป็นได้'])
      }

      try {
        const stream = await getStream()
        const videoEl = camInput.current
        videoEl.srcObject = stream
      } catch (err) {
        return setCamState(['FAILED', err.message])
      }
    })()
  }, [])

  const onPlay = useCallback(() => {
    setCamState(['READY', ''])
  }, [])

  const sendSnapshot = useCallback(async () => {
    const image = getSnapshot(camInput.current)
    const input = await getInputCanvas(image)
    const results = await detectSingleFace(input)
    if (!results) {
      Modal.error({
        title: 'ไม่พบใบหน้า',
        content: (
          <div>
            <p>กรุณาลองบันทึกภาพใหม่อีกครั้ง</p>
          </div>
        )
      })
    }
  }, [camInput])

  if (camState[0] === 'FAILED') return (
    <Alert
      message="ไม่สามารถเชื่อมต่อกล้องได้"
      description={camState[1] || 'ไม่พบกล้องในอุปกรณ์ของคุณ หรือคุณปฏิเสธการใช้กล้อง'}
      type="error"
      showIcon
    />
  )
  
  const canSendSnapshot = camState[0] === 'READY'
  return (
    <Space direction="vertical">
      <Video ref={camInput} onPlay={onPlay} autoPlay muted playsInline preload="none" />
      <Button
        type="primary"
        icon={<CameraOutlined />}
        onClick={sendSnapshot}
        disabled={!canSendSnapshot}
      >
        ใช้ภาพนี้
      </Button>
    </Space>
  )
}

export default AuthenFaceCanvas
