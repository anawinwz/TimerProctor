class CameraError extends Error {
  constructor(message, originalError) {
    super(message)
    this.name = this.constructor.name
    this.originalError = originalError
  }
}

export const getStream = () => new Promise(async(resolve, reject) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    resolve(stream)
  } catch (err) {
    let errMsg = 'เกิดข้อผิดพลาดที่ไม่รู้จัก'
    if (err.message.includes(`'getUserMedia' of undefined`))
      errMsg = 'เบราว์เซอร์ (browser) ของคุณไม่รองรับการใช้กล้องบนเว็บ'
    else if (err.message.includes('Requested device not found'))
      errMsg = 'ไม่พบกล้องในอุปกรณ์ของคุณ หรือถูกปิดไว้ที่ตัวเครื่อง'
    else if (err.message.includes('Permission dismissed'))
      errMsg = 'คุณปฏิเสธการใช้กล้อง'
    reject(new CameraError(errMsg, err))
  }
})

export const getSnapshot = (videoEl, options = {}) => {
  const { maxWidthOrHeight, quality = 0.9 } = options

  const orgWidth = videoEl.videoWidth
  const orgHeight = videoEl.videoHeight
  const whRatio = orgWidth/orgHeight
  let width = orgWidth, height = orgHeight
  if (maxWidthOrHeight) {
    if (orgWidth > orgHeight) {
      width = maxWidthOrHeight
      height = 1/whRatio * maxWidthOrHeight
    } else {
      width = whRatio * maxWidthOrHeight
      height = maxWidthOrHeight
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height)

  const dataURL = canvas.toDataURL('image/jpeg', quality)
  canvas.width = 0
  canvas.height = 0
  return dataURL
}
