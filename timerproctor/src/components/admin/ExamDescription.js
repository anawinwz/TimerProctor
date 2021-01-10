import { observer } from 'mobx-react-lite'
import { Descriptions } from 'antd'
import { idCheckModes } from '~/utils/const'
import { rangeStr, shortDateStr } from '~/utils/date'

const { Item } = Descriptions

const ExamDescription = ({ exam = {} }) => {
  const { timeWindow, timer, authentication } = exam
  return (
    <Descriptions style={{ marginTop: '10px' }}>
      <Item label="จำกัดเวลาทำ">{ timer?.duration } นาที</Item>
      <Item label="แสดงนาฬิกาจับเวลา">{ timer?.isShow ? 'ใช่' : 'ไม่ใช่' }</Item>
      <Item label="ตรวจสอบบัตรประจำตัว">{ idCheckModes[authentication?.idCheckMode ] }</Item>
      { 
        timeWindow?.mode === 'realtime' ?
        <Item label="เริ่มการสอบเมื่อ">{ shortDateStr(timeWindow?.realtime?.startedAt) }</Item>
        :
        <Item label="กำหนดการสอบ">{ rangeStr(timeWindow?.schedule?.startDate, timeWindow?.schedule?.endDate) }</Item>
      }
      <Item label="กรรมการคุมสอบขณะนี้ (0)"></Item>
    </Descriptions>
  )
}

export default observer(ExamDescription)
