export const nl2br = (str = '') => str.replace(/\n/g, `<br />`)
export const truncateStr = (str = '', length = 10) =>
  str.length <= length ? str : `${str.substr(0, length)}...`

export const timeWindowModes = {
  realtime: 'ให้สัญญาณเริ่ม-สิ้นสุดด้วยตนเอง',
  // schedule: 'กำหนดล่วงหน้า',
}

export const loginMethods = {
  google: 'บัญชี Google',
  email: 'อีเมล'
}

export const idCheckModes = {
  none: 'ปิด',
  prompt: 'อนุมัติก่อนเข้าสอบ',
  // post: 'ตรวจภายหลัง',
}

export const testerStatuses = {
  authenticating: 'รออนุมัติ',
  started: 'กำลังทำ',
  loggedin: 'ล็อกอินแล้ว',
  authenticated: 'รอเข้าสอบ',
  completed: 'ส่งคำตอบแล้ว',
  terminated: 'ถูกเชิญออก'
}

export const testerTerminatableStatuses = [
  'authenticating',
  'authenticated',
  'started'
]

export const testerEventsType = {
  face: 'ตรวจจับใบหน้า',
  window: 'ตรวจจับการสลับแท็บ',
  snapshot: 'สุ่มบันทึกภาพ',
  socket: 'การเชื่อมต่อระบบคุมสอบ'
}

export const photoRejectReasons = ['รูปไม่ชัดเจน', 'ประเภทบัตรไม่ถูกต้อง', 'บุคคลในภาพและในบัตรไม่ตรง']

export const proctorStatuses = {
  invited: 'ส่งคำเชิญแล้ว',
  accepted: 'ตอบรับแล้ว',
  rejected: 'ปฏิเสธแล้ว'
}

export const isEventRisk = (event = {}) => {
  const { type, info } = event
  switch (type) {
    case 'window':
      if (info.windowEvent === 'unfocus') return true
      return false
    case 'snapshot':
      return false
    case 'face':
      if (info.facesCount != 1) return true
      return false
    default: return false
  }
}
