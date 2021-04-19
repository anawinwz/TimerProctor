const API_BASEURL = 'https://tp-api.anawinwz.me'

function createExam() {
  const ui = FormApp.getUi()
  
  const form = FormApp.getActiveForm()
  const ownerEmail = Session.getEffectiveUser().getEmail()
  
  const restrictCheck = formRestrictionCheck()
  if (!restrictCheck) return false
  
  if (ui.alert('สร้างการสอบในนามของคุณ?', 'การสอบจะถูกสร้างขึ้นใน TimerProctor โดยเชื่อมกับฟอร์มนี้\r\nและมีเจ้าของการสอบเป็น:\r\n\r\n' + ownerEmail, ui.ButtonSet.YES_NO) == ui.Button.YES) {
    const payload = {
      provider: 'gforms',
      id: form.getId(),
      publicURL: form.getPublishedUrl(),
      
      ownerEmail: ownerEmail,
      
      name: form.getTitle(),
      desc: form.getDescription(),
      shuffleQuestions: form.getShuffleQuestions()
    }
    
    try {
      const response = UrlFetchApp.fetch(`${API_BASEURL}/exams/create`, {
        method: 'post',
        contentType: 'application/json; charset=utf-8',
        payload: JSON.stringify({ token: genToken(payload) })
      })
  
      if (response.getResponseCode() != 200) {
        ui.alert('เกิดข้อผิดพลาดในระบบ TimerProctor โปรดลองใหม่ภายหลัง')
      } else {
        const { status, message } = JSON.parse(response.getContentText())
        if (message) ui.alert(message)
      }
    } catch (err) {
      console.error(err)
      ui.alert('เกิดข้อผิดพลาดในการติดต่อกับ TimerProctor โปรดลองใหม่ภายหลัง')
    }
  }
}

function updateLinkedSettings(settings) {  
  const form = FormApp.getActiveForm()
  
  const payload = {
    provider: 'gforms',
    id: form.getId(),
    settings: settings
  }
  
    try {
      const response = UrlFetchApp.fetch(`${API_BASEURL}/exams/updateLinked`, {
        method: 'post',
        contentType: 'application/json; charset=utf-8',
        payload: JSON.stringify({ token: genToken(payload) })
      })
  
      if (response.getResponseCode() != 200) {
        throw new Error('เกิดข้อผิดพลาดในระบบ TimerProctor โปรดลองใหม่ภายหลัง')
      } else {
        const { status, message } = JSON.parse(response.getContentText())
        if (status !== "ok") 
          throw new Error(message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
        else
           PropertiesService.getDocumentProperties().setProperties(settings)
      }
    } catch (err) {
      console.error(err)
      throw new Error('เกิดข้อผิดพลาดในการติดต่อกับ TimerProctor โปรดลองใหม่ภายหลัง')
    }
}
