import { Descriptions } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { idCheckModes } from '~/utils/const'
import { rangeStr, shortDateStr } from '~/utils/date'

import ExamOnlineProctorsList from './ExamOnlineProctorsList'

const { Item } = Descriptions

const ExamDescription = () => {
  const { ExamStore: { info: exam }, ExamAdminStore: examAdmin } = useStore()

  const { timeWindow, timer, authentication } = exam
  return (
    <Descriptions style={{ marginTop: '10px' }}>
      <Item label="จำกัดเวลาทำ">{ timer?.duration } นาที</Item>
      <Item label="แสดงนาฬิกาจับเวลา">{ timer?.isShow ? 'ใช่' : 'ไม่ใช่' }</Item>
      <Item label="ตรวจสอบบัตรประจำตัว">{ idCheckModes[authentication?.idCheckMode ] }</Item>
      { 
        timeWindow?.mode === 'realtime' ?
        <Item label="เริ่มการสอบครั้งล่าสุด">{ shortDateStr(timeWindow?.realtime?.startedAt) }</Item>
        :
        <Item label="กำหนดการสอบ">{ rangeStr(timeWindow?.schedule?.startDate, timeWindow?.schedule?.endDate) }</Item>
      }
      <Item label={`กรรมการคุมสอบขณะนี้ (${examAdmin.onlineProctors.length})`}>
        <ExamOnlineProctorsList />
      </Item>
    </Descriptions>
  )
}

export default observer(ExamDescription)
