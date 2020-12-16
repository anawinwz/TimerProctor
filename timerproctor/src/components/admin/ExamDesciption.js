import { Descriptions } from 'antd'
import { idCheckModes } from '../../utils/const'

const { Item } = Descriptions

const ExamDescription = ({ exam }) => {
  return (
    <Descriptions>
      <Item label="จำกัดเวลาทำ">{ exam.timer.duration } นาที</Item>
      <Item label="แสดงนาฬิกาจับเวลา">{ exam.timer.isShow ? 'ใช่' : 'ไม่ใช่' }</Item>
      <Item label="ตรวจสอบบัตรประจำตัว">{ idCheckModes[exam.authentication.idCheckMode ] }</Item>
      <Item label="เริ่มการสอบเมื่อ"></Item>
      <Item label="กรรมการคุมสอบขณะนี้ (0)"></Item>
    </Descriptions>
  )
}

export default ExamDescription
