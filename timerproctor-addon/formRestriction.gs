function formRestrictionCheck() {
  const form = FormApp.getActiveForm()
  const ui = FormApp.getUi()
  if (form.requiresLogin()) {
    if (ui.alert('ฟอร์มนี้ตั้งค่าบังคับเข้าสู่ระบบไว้ จึงยังไม่สามารถใช้กับ TimerProctor ได้\r\n\r\nต้องการปิดเลยหรือไม่?\r\n- ใช/Yes: ปิดการบังคับเข้าสู่ระบบของฟอร์มนี้ และไปต่อ\r\n- ไม่/No: ยกเลิกไปก่อน', ui.ButtonSet.YES_NO) == ui.Button.YES) {
      form.setRequireLogin(false)
      return true
    } else return false
  }
  if (form.hasLimitOneResponsePerUser()) {
    if (ui.alert('ฟอร์มนี้มีการจำกัดจำนวนการตอบไว้ที่ 1 ครั้ง\r\nต้องการนำออกเลยหรือไม่?\r\n- ใช/Yes: นำการจำกัดจำนวนการตอบไว้ที่ 1 ครั้งออก และไปต่อ\r\n- ไม่/No: ยกเลิกไปก่อน', ui.ButtonSet.YES_NO) == ui.Button.YES) {
      form.setLimitOneResponsePerUser(false)
      return true
    } else return false
  }
  return true
}
