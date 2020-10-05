import { createRef, useState, useEffect, useCallback } from 'react'
import { Alert } from 'antd'
import { loadModel } from '../../utils/faceDetection'

const AuthenFaceCanvas = () => {
  const [camState, setCamState] = useState(['LOADING', ''])
  const camInput = createRef()

  useEffect(() => {
    (async () => {
      await loadModel()

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
        const videoEl = camInput.current
        videoEl.srcObject = stream
      } catch (err) {
        let errMsg = ''
        if (err.message.includes(`'getUserMedia' of undefined`))
          errMsg = 'เบราว์เซอร์ (browser) ของคุณไม่รองรับการใช้กล้องบนเว็บ'
        else if (err.message.includes('Requested device not found'))
          errMsg = 'ไม่พบกล้องในอุปกรณ์ของคุณ หรือถูกปิดไว้ที่ตัวเครื่อง'
        else if (err.message.includes('Permission dismissed'))
          errMsg = 'คุณปฏิเสธการใช้กล้อง'

        setCamState(['BLOCKED', errMsg])
      }
    })()
  }, [])

  if (camState[0] === 'BLOCKED') return (
    <Alert
      message="ไม่สามารถเชื่อมต่อกล้องได้"
      description={camState[1] || 'ไม่พบกล้องในอุปกรณ์ของคุณ หรือคุณปฏิเสธการใช้กล้อง'}
      type="error"
      showIcon
    />
  )
  return (<video ref={camInput} autoPlay muted playsInline></video>)
}

export default AuthenFaceCanvas
