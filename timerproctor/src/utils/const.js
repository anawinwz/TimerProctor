export const nl2br = (str = '') => str.replace(/\n/g, `<br />`)

export const timeWindowModes = {
  realtime: 'ให้สัญญาณเริ่ม-สิ้นสุดด้วยตนเอง',
  schedule: 'กำหนดล่วงหน้า',
}

export const loginMethods = {
  google: 'บัญชี Google',
}

export const idCheckModes = {
  off: 'ปิด',
  prompt: 'อนุมัติก่อนเข้าสอบ',
  post: 'ตรวจภายหลัง',
}

export const testerStatuses = {
  authenticating: 'รออนุมัติ',
  started: 'กำลังทำ',
  loggedin: 'ล็อกอินแล้ว',
  authenticated: 'รอเข้าสอบ',
  completed: 'ส่งคำตอบแล้ว',
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
