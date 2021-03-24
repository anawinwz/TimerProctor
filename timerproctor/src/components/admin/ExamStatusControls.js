import { useCallback } from 'react'
import { Modal, Button, Space, message } from 'antd'
import { CaretRightFilled, StopOutlined, SettingOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { fetchAPIwithAdminToken } from '~/utils/api'
import { testerStatuses } from '~/utils/const'

import ExamAllowLoginToggle from '~/components/admin/ExamAllowLoginToggle'
import ExamAnnouncementsModal from './ExamAnnouncementsModal'

const Wrapper = styled('div')`
  &>*, &>a>* {
    margin-top: 5px;
    margin-right: 5px; 
  }
`

const ExamSettingsButton = observer(({ examId = '' }) => (
  <Link to={`/admin/exams/${examId}/settings`}><Button icon={<SettingOutlined />}>ตั้งค่า</Button></Link>
))

const ExamStatusControls = () => {
  const { ExamStore: exam, ExamAdminStore: examAdmin, TimerStore: timer } = useStore()

  const status = exam?.status
  const timeWindowMode = exam?.timeWindow?.mode
  const isExamOwner = examAdmin?.isExamOwner

  const controlExam = useCallback(async (id, mode, deletePreviousTesters = false) => {
    if (!id) return false

    try {
      const res = await fetchAPIwithAdminToken(`/exams/${id}/status`, {
        status: mode,
        deletePreviousTesters: deletePreviousTesters === true
      }, 'PUT')
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        exam?.updateLocalStatus(mode)
        exam.timeWindow.realtime.allowLogin = mode === 'started' ? true : false
      } else {
        throw new Error(msg || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
    }
  }, [])

  const startExam = useCallback(() => {
    const askToDelete = true
    const affected = examAdmin.counts.completed + examAdmin.counts.terminated

    if (!askToDelete || affected <= 0)
      return controlExam(exam?.id, 'started')

    Modal.confirm({
      title: 'คุณต้องการลบผู้เข้าสอบจากครั้งก่อนหรือไม่?',
      content: <>
        ข้อมูลผู้เข้าสอบในสถานะต่อไปนี้ทั้ง { affected } คนจะถูกนำออก:
        <ul>
          <li>{ testerStatuses.completed }</li>
          <li>{ testerStatuses.terminated }</li>
        </ul>
      </>,
      okText: 'ใช่ นำออก',
      okType: 'danger',
      onOk: () => controlExam(exam?.id, 'started', true),
      cancelText: 'ไม่เป็นไร',
      onCancel: () => controlExam(exam?.id, 'started', false)
    })
  }, [exam?.id])
  const stopExam = useCallback(() => {
    Modal.confirm({
      title: `คุณแน่ใจหรือว่าต้องการสิ้นสุดการสอบ?`,
      content: `ผู้เข้าสอบที่เหลืออยู่จะไม่สามารถส่งคำตอบได้ การดำเนินการนี้ไม่สามารถยกเลิกได้`,
      okText: 'สิ้นสุดการสอบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: () => controlExam(exam?.id, 'stopped')
    })
  }, [exam?.id])

  if (timeWindowMode === 'schedule') return <ExamSettingsButton examId={exam.id} />
  return (
    <Space direction="vertical">
      { status === 'started' ? (
        <Wrapper>
          <Button
            type="danger"
            icon={<StopOutlined />}
            onClick={stopExam}
            disabled={!isExamOwner}
          >สิ้นสุดการสอบ</Button> 
          <span>ดำเนินไปแล้ว { timer.displayElapsedTime }</span>
        </Wrapper>
        ) : (
        <Wrapper>
          <Button
            type="primary"
            icon={<CaretRightFilled />}
            onClick={startExam}
            disabled={!isExamOwner}
          >เริ่มการสอบ</Button>
          <ExamAnnouncementsModal />
          <ExamSettingsButton examId={exam.id} />
        </Wrapper>
        )
      }
      <ExamAllowLoginToggle disabled={!isExamOwner} />
    </Space>
  )
}

export default observer(ExamStatusControls)
