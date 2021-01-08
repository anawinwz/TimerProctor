import { useCallback } from 'react'
import { Modal, Button, Space, message } from 'antd'
import { CaretRightFilled, StopFilled, SettingOutlined } from '@ant-design/icons'

import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStore } from '../../stores/admin'
import { fetchAPIwithToken } from '../../utils/api'

const ExamStatusControls = () => {
  const { ExamStore: exam } = useStore()
  const status = exam?.status

  const controlExam = useCallback(async (id, mode) => {
    if (!id) return false
    try {
      const res = await fetchAPIwithToken(`/exams/${id}/${mode}`)
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        exam?.updateStatus(mode === 'start' ? 'started' : 'stopped')
      } else {
        throw new Error(msg || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
    }
  }, [])

  const startExam = useCallback(() => controlExam(exam?.id, 'start'), [exam?.id])
  const stopExam = useCallback(() => {
    Modal.confirm({
      title: `คุณแน่ใจหรือว่าต้องการสิ้นสุดการสอบ?`,
      content: `ผู้เข้าสอบที่เหลืออยู่จะไม่สามารถส่งคำตอบได้ การดำเนินการนี้ไม่สามารถยกเลิกได้`,
      okText: 'สิ้นสุดการสอบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: () => controlExam(exam?.id, 'stop')
    })
  }, [exam?.id])

  if (status === 'started') {
    return (
      <Space direction="horizontal">
        <Button type="danger" icon={<StopFilled />} onClick={stopExam}>สิ้นสุดการสอบ</Button> 
        <span>ดำเนินไปแล้ว...</span>
      </Space>
    )
  }
  return (
    <Space direction="horizontal">
      <Button type="primary" icon={<CaretRightFilled />} onClick={startExam}>เริ่มการสอบ</Button>
      <Link to={`/admin/exams/${exam.id}/settings`}><Button icon={<SettingOutlined />}>ตั้งค่า</Button></Link>
    </Space>
  )
}

export default observer(ExamStatusControls)
