import styled from 'styled-components'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Alert, Button, Space, Spin } from 'antd'
import { CameraOutlined } from '@ant-design/icons'

import { detectSingleFace } from 'face-api.js'

import { getInputCanvas } from '~/utils/faceDetection'
import { getStream, getSnapshot } from '~/utils/camera'
import { showModal } from '~/utils/modal'

const Video = styled('video')`
  background: #d8d8d8;
  width: 100%;
  max-width: 480px;
  pointer-events: none;
`

const AuthenFaceCanvas = ({
  loadModel = () => {},
  onSubmitPhoto = () => {},
  sendState = ['IDLE', ''],
  setSendState = () => {}
}) => {
  const [camState, setCamState] = useState(['LOADING', ''])
  const camInput = useRef()

  useEffect(() => {
    let stream
    (async () => {
      try {
        await loadModel()
      } catch (err) {
        return setCamState(['FAILED', 'ไม่สามารถโหลดข้อมูลที่จำเป็นได้'])
      }

      try {
        stream = await getStream()
        const videoEl = camInput.current
        videoEl.srcObject = stream
      } catch (err) {
        return setCamState(['FAILED', err.message])
      }
    })()
    return () => {
      try {
        stream.getTracks().forEach(track => track.stop())
      } catch {}
    }
  }, [])

  const onPlay = useCallback(() => {
    setCamState(['READY', ''])
  }, [])

  useEffect(() => {
    const video = camInput.current
    if (camState[0] === 'READY' && video) {
      if (sendState[0] === 'IDLE') video.play()
      else video.pause()
    }
  }, [camState, camInput.current, sendState[0]])

  const sendSnapshot = useCallback(async () => {
    const video = camInput.current
    setSendState(['CHECKING', 'กำลังตรวจสอบ...'])
    const image = getSnapshot(video)
    const input = await getInputCanvas(image)

    const results = await detectSingleFace(input)
    if (!results) {
      showModal('error', 'ไม่พบใบหน้า', 'กรุณาลองบันทึกภาพใหม่อีกครั้ง')
      setSendState(['IDLE'])
    } else {
      setSendState(['PENDING', 'กำลังอัปโหลด...']) 
      try {
        await onSubmitPhoto(image)
        setSendState(['PENDING', 'กำลังรออนุมัติ...'])
      } catch (err) {
        console.error(err)
        showModal('error', 'เกิดข้อผิดพลาดในการติดต่อกรรมการ', 'กรุณาลองบันทึกภาพใหม่อีกครั้ง')
        setSendState(['IDLE'])
      }
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
  
  const loading = sendState[0] !== 'IDLE'
  const canSendSnapshot = camState[0] === 'READY'
  return (
    <Space direction="vertical">
      <Spin
        spinning={loading}
        tip={sendState[1]}
      >
        <Video ref={camInput} onPlay={onPlay} autoPlay muted playsInline preload="none" />
      </Spin>
      <Button
        type="primary"
        icon={<CameraOutlined />}
        onClick={sendSnapshot}
        disabled={!canSendSnapshot}
        loading={loading}
      >
        ใช้ภาพนี้
      </Button>
    </Space>
  )
}

export default AuthenFaceCanvas
