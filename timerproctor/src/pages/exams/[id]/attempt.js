import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Redirect } from 'react-router-dom'
import { useStore } from '~/stores/index'
import Form from '~/components/exams/Form'
import Trackers from '~/components/exams/Trackers'

import { fetchAPIwithToken } from '~/utils/api'
import { showModal } from '~/utils/modal'

const AttemptPage = () => {
  const { ExamStore: exam, AttemptStore: attempt, TimerStore: timer, SocketStore: socketStore } = useStore()
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

      if (startTime < endTime) {
        setForm(payload)
        timer.set({ startTime: startTime, endTime: endTime })
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
    const res = await fetchAPIwithToken(`/exams/${exam.id}/form/responses`, values)
    const { status, message } = res
    if (status === 'ok') {
      attempt.setCompleted()
    } else {
      showModal('error', 'ไม่สามารถส่งคำตอบได้', message || 'กรุณาลองใหม่อีกครั้ง')
    }
  }, [])

  
  if (!socketStore.socket || !['authenticated', 'started'].includes(attempt.status))
    return <Redirect to={`/exams/${exam.id}`} />
  else if (attempt.status === 'completed')
    return <Redirect to={`/exams/${exam.id}/completed`} />
  else if (exam.status === 'stopped' || timer.isTimeout === true)
    return <Redirect to={`/exams/${exam.id}/failed`} />
  return (
    <>
      <Trackers />
      <Form form={form} onCompleted={onCompleted} />
    </>
  )
}

export default observer(AttemptPage)
