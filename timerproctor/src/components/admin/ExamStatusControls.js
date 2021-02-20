import { useCallback, useState } from 'react'
import { Modal, Button, Space, Switch, message } from 'antd'
import { CaretRightFilled, StopFilled, SettingOutlined } from '@ant-design/icons'

import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'
import { fetchAPIwithToken } from '~/utils/api'
import { fromNowStr } from '~/utils/date'

const ExamSettingsButton = observer(({ examId = '' }) => (
  <Link to={`/admin/exams/${examId}/settings`}><Button icon={<SettingOutlined />}>ตั้งค่า</Button></Link>
))

const ExamAllowLoginToggle = observer(() => {
  const { ExamStore: exam } = useStore()

  const [loading, setLoading] = useState(false)
  const updateAllowLogin = useCallback(async allow => {
    try {
      setLoading(true)
      const res = await fetchAPIwithToken(`/exams/${exam?.id}/allowLogin`, { allow })
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        exam.timeWindow.realtime.allowLogin = allow
        setLoading(false)
      } else {
        setLoading(false)
        throw new Error(msg || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
      }
    } catch (err) {
      setLoading(false)
      message.error(err.message || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
    }
  }, [exam?.id])

  const allowLogin = exam?.timeWindow?.realtime?.allowLogin || false
  return (
    <span>
      <Switch
        checked={allowLogin}
        onChange={updateAllowLogin}
        loading={loading}
      />{' '}
      อนุญาตให้เข้าห้องสอบได้
    </span>
  )
})

const ExamStatusControls = () => {
  const { ExamStore: exam } = useStore()

  const status = exam?.status
  const timeWindowMode = exam?.timeWindow?.mode

  const controlExam = useCallback(async (id, mode) => {
    if (!id) return false
    try {
      const res = await fetchAPIwithToken(`/exams/${id}/${mode}`)
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        exam?.updateStatus(mode === 'start' ? 'started' : 'stopped')
        exam.timeWindow.realtime.allowLogin = mode === 'start' ? true : false
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

  if (timeWindowMode === 'schedule') return <ExamSettingsButton examId={exam.id} />
  return (
    <Space direction="vertical">
      { status === 'started' ? (
        <Space direction="horizontal">
          <Button type="danger" icon={<StopFilled />} onClick={stopExam}>สิ้นสุดการสอบ</Button> 
          <span>ดำเนินไปแล้ว { fromNowStr(exam?.timeWindow?.realtime?.startedAt) }</span>
        </Space>
        ) : (
        <Space direction="horizontal">
          <Button type="primary" icon={<CaretRightFilled />} onClick={startExam}>เริ่มการสอบ</Button>
          <ExamSettingsButton examId={exam.id} />
        </Space>
        )
      }
      <ExamAllowLoginToggle />
    </Space>
  )
}

export default observer(ExamStatusControls)
