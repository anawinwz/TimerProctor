/**
 * @OnlyCurrentDoc
 */

const ADDON_NAME = 'TimerProctor'

function onInstall(e) {
  onOpen(e)
}

function onOpen(e) {
  const menu = FormApp.getUi().createAddonMenu()
    .addItem('สร้างเป็นการสอบของฉัน', 'createExam')
  menu.addItem('กำหนดค่าเพิ่มเติม', 'showSidebar')
  menu.addToUi()
}


function showSidebar() {  
  if (!formRestrictionCheck()) return false
  
  const ui = HtmlService.createTemplateFromFile('sidebar').evaluate()
    .setTitle(ADDON_NAME)
  FormApp.getUi().showSidebar(ui)
}
