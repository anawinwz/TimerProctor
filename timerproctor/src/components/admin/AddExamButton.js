import { useState, useCallback } from 'react'
import { Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import GoogleFormsMenu from '~/assets/images/google-forms-menu.png'

const AddExamButton = () => {
  const [isShow, setIsShow] = useState(false)

  const openModal = useCallback(() => setIsShow(true), [setIsShow])
  const closeModal = useCallback(() => setIsShow(false), [setIsShow])

  return (
    <>
      <Button icon={<PlusOutlined />} type="primary" onClick={openModal}> เพิ่มการสอบ</Button>
      <Modal title="เพิ่มการสอบ" visible={isShow} onOk={closeModal} onCancel={closeModal} cancelButtonProps={{ style: { display: 'none' } }}>
        คุณสามารถเพิ่มการสอบได้โดยใช้ Google Forms
        <ol>
          <li><a href="https://workspace.google.com/marketplace/app/timerproctor/926658420781">ติดตั้งส่วนเสริม <b>TimerProctor</b></a> ลงในบัญชี Google ของคุณ</li>
          <li>ไปที่ <a href="https://forms.google.com/" target="_blank">Google Forms ของคุณ</a> และเปิดฟอร์มข้อสอบที่คุณต้องการเพิ่มขึ้นมา</li>
          <li>
            <p>คลิกที่สัญลักษณ์ <b>...</b>  &gt; เลือก <b>ส่วนเสริม / Add-ons</b></p>
            <img src={GoogleFormsMenu} />
          </li>
          <li>เลือก <b>TimerProctor</b> &gt; คลิก <b>สร้างเป็นการสอบของฉัน</b></li>
          <li>การสอบที่เชื่อมโยงกับฟอร์มดังกล่าวจะปรากฏขึ้นที่หน้านี้อัตโนมัติ</li>
        </ol>
      </Modal>
    </>
  )
}

export default AddExamButton
