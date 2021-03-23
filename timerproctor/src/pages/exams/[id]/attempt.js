import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import Form from '~/components/exams/Form'
import Trackers from '~/components/exams/Trackers'

import { fetchAPIwithToken } from '~/utils/api'
import { showModal } from '~/utils/modal'
import { Spin } from 'antd'

const AttemptPage = () => {
  const { ExamStore: exam, AttemptStore: attempt, TimerStore: timer, SocketStore: socketStore } = useStore()
  const history = useHistory()
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState(null)

  useEffect(async () => {
    const examDuration = exam.info?.timer?.duration
    const startedAt = attempt?.startedAt

    const res = await fetchAPIwithToken(`/exams/${exam.id}/form`)
    const { status, payload } = res
    if (status === 'ok' && payload) {
      let startTime = 0
      let endTime = examDuration * 60
      if (startedAt) {
        const now = moment()
        const start = moment(startedAt)
        startTime = Math.floor(now.diff(start) / 1000)
      }

      timer.set({ startTime: startTime, endTime: endTime })
      if (startTime < endTime) {
        setForm(payload)
        timer.start()
        socketStore?.socket?.emit('start')
      } else {
        showModal('error', `คุณไม่เหลือเวลาในการทำข้อสอบแล้ว (ครบ ${examDuration} นาที)`)
      }
    } else {
      showModal('error', 'ไม่สามารถโหลดเนื้อหาการสอบได้')
    }
  }, [])

  const onCompleted = useCallback(async values => {
    setSending(true)
    try {
      const res = await fetchAPIwithToken(`/exams/${exam.id}/form/responses`, values)
      const { status, message } = res
      if (status === 'ok') {
        attempt.setCompleted()
      } else {
        showModal('error', 'ไม่สามารถส่งคำตอบได้', message || 'กรุณาลองใหม่อีกครั้ง')
      }
    } catch {
      showModal('error', 'ไม่สามารถส่งคำตอบได้', 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSending(false)
    }
  }, [])

  useEffect(() => {
    if (attempt.status === 'completed')
      history.replace(`/exams/${exam.id}/completed`)
  }, [attempt.status])
  
  if (!socketStore.socket || ['loggedin', 'authenticating'].includes(attempt.status))
    return <Redirect to={`/exams/${exam.id}`} />
  
  if (exam.status === 'stopped' || timer.isTimeout === true)
    return <Redirect to={`/exams/${exam.id}/failed`} />
  
  return (
    <>
      <Trackers />
      <Spin spinning={sending} tip="กำลังส่งคำตอบ...">
        <Form form={form} onCompleted={onCompleted} />
      </Spin>
    </>
  )
}

export default observer(AttemptPage)
