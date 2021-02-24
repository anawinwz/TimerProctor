export const nl2br = str => str.replace(/\n/g, `<br />`)

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
  loggedin: 'ล็อกอินแล้ว',
  authenticating: 'รออนุมัติ',
  authenticated: 'รอเข้าสอบ',
  started: 'กำลังทำ',
  completed: 'ส่งคำตอบแล้ว',
}

export const testerEventsType = {
  face: 'ตรวจจับใบหน้า',
  window: 'ตรวจจับการสลับแท็บ',
  snapshot: 'สุ่มบันทึกภาพ'
}

export const photoRejectReasons = ['รูปไม่ชัดเจน', 'ประเภทบัตรไม่ถูกต้อง', 'บุคคลในภาพและในบัตรไม่ตรง']
