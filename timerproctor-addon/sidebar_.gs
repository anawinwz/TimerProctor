function checkMultipleAccountIssue(initiator) {
  var userEmailAddress = Session.getEffectiveUser().getEmail() 
      
  if (initiator) {
    if (initiator != userEmailAddress) {
      console.error({
        message: "Client side calls initiated from wrong account",
        initiator: initiator,
        effectiveUser: userEmailAddress
      })
      var errorMessage = "พบปัญหาการเข้าสู่ระบบหลายบัญชี<br>";
      errorMessage+= "กรุณาออกจากระบบบัญชี " + userEmailAddress
      errorMessage+= " เพื่อใช้ TimerProctor ด้วยบัญชี " +initiator
      throw new Error(errorMessage)
    }
  }
}

function getSettings() {
  var settings = PropertiesService.getDocumentProperties().getProperties()

  const form = FormApp.getActiveForm()
  const textItems = form.getItems(FormApp.ItemType.TEXT)
  settings.textItems = []
  for (var i = 0; i < textItems.length; i++) {
    settings.textItems.push({
      title: textItems[i].getTitle(),
      id: textItems[i].getId()
    })
  }
  return settings
}

function saveSettings(settings) {
  if (settings.autofillEmail && !settings.autofillEmailField)
    settings.autofillEmail = false
  if (settings.autofillTesterID && !settings.autofillTesterIDField)
    settings.autofillTesterID = false
    
  updateLinkedSettings(settings)
  
  return getSettings()
}

function addEmailField() {
  const form = FormApp.getActiveForm()
  
  const textItems = form.getItems(FormApp.ItemType.TEXT)
  if (textItems.some(item => item.getTitle() === 'อีเมล')) {
    throw new Error('คุณมีช่องข้อมูลที่ชื่อว่า [อีเมล] อยู่แล้ว')
  }
  
  const field = form.addTextItem()  
  
  field.setTitle('อีเมล')
  field.setRequired(true)
  field.setHelpText('🚫 ไม่ควรลบ!! 🚫\r\nหากเข้าสอบผ่าน TimerProctor ผู้เข้าสอบจะมองไม่เห็นช่องนี้ และอีเมลจะถูกเติมโดยอัตโนมัติ')
  const validation = FormApp.createTextValidation()
    .setHelpText('กรอกได้เฉพาะอีเมลเท่านั้น')
    .requireTextIsEmail()
    .build()
  field.setValidation(validation)
 
  form.moveItem(field.getIndex(), 0)
  
  const settings = {
    autofillEmail: true,
    autofillEmailField: field.getId()
  }
  
  updateLinkedSettings(settings)
  
  return getSettings()
}


function addTesterIDField() {
  const form = FormApp.getActiveForm()
  
  const textItems = form.getItems(FormApp.ItemType.TEXT)
  if (textItems.some(item => item.getTitle() === 'รหัสประจำตัว')) {
    throw new Error('คุณมีช่องข้อมูลที่ชื่อว่า [รหัสประจำตัว] อยู่แล้ว')
  }
  
  const field = form.addTextItem()  
  
  field.setTitle('รหัสประจำตัว')
  field.setHelpText('🚫 ไม่ควรลบ!! 🚫\r\nหากเข้าสอบผ่าน TimerProctor ผู้เข้าสอบจะมองไม่เห็นช่องนี้ และรหัสประจำตัวจะถูกเติมโดยอัตโนมัติ')
 
  form.moveItem(field.getIndex(), 0)
  
  const settings = {
    autofillTesterID: true,
    autofillTesterIDField: field.getId()
  }
  
  updateLinkedSettings(settings)
  
  return getSettings()
}
