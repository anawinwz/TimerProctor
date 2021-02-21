
import { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Redirect } from 'react-router-dom'
import { useStore } from '~/stores/index'
import Form from '~/components/exams/Form'
import Trackers from '~/components/exams/Trackers'

import { fetchAPIwithToken } from '~/utils/api'
import { showModal } from '~/utils/modal'

const AttemptPage = () => {
  const { ExamStore: exam, TimerStore: timer, SocketStore: socketStore } = useStore()
  const [completed, setCompleted] = useState(false)
  const [form, setForm] = useState(null)

  useEffect(async () => {
    const res = await fetchAPIwithToken(`/exams/${exam.id}/form`)
    const { status, payload } = res
    if (status === 'ok' && payload) {
      setForm(payload)

      timer.set({ endTime: exam.info?.timer?.duration * 60  })
      timer.start()
      socketStore?.socket?.emit('start')
    } else {
      showModal('error', 'ไม่สามารถโหลดเนื้อหาการสอบได้')
    }
  }, [])

  const onCompleted = useCallback(async values => {
    const res = await fetchAPIwithToken(`/exams/${exam.id}/form/submit`, values)
    const { status, message } = res
    if (status === 'ok') {
      setCompleted(true)
    } else {
      showModal('error', 'ไม่สามารถส่งคำตอบได้', message || 'กรุณาลองใหม่อีกครั้ง')
    }
  }, [])

  if (completed) return <Redirect to={`/exams/${exam.id}/completed`} />
  else if (exam.status === 'stopped' || timer.isTimeout === true) return <Redirect to={`/exams/${exam.id}/failed`} />
  return (
    <>
      <Trackers />
      <Form form={form} onCompleted={onCompleted} />
    </>
  )
}

export default observer(AttemptPage)
