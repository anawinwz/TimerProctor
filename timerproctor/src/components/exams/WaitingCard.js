import { useEffect, useState } from 'react'
import { Card, Result, Alert } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import { loadModel } from '~/utils/faceDetection'

const WaitingAnnouncement = observer(() => {
  const { ExamStore: { announcements } } = useStore()
  return announcements.length === 0 ? null : (
    <Alert
      type="info"
      showIcon
      message="ประกาศล่าสุดจากอาจารย์ผู้สอน"
      description={announcements[announcements.length - 1]}
    />
  )
})

const WaitingCard = () => {
  const { ExamStore: { status } } = useStore()
  const [error, setError] = useState('')

  useEffect(() => {
    loadModel()
      .catch(() => {
        setError('ไม่สามารถดาวน์โหลดข้อมูลที่จำเป็นได้')
      })
  }, [])

  const message = status !== 'started' ?
    'อยู่ระหว่างรออาจารย์ผู้สอนให้สัญญาณเริ่มการสอบ' :
    'กำลังโหลดข้อมูลที่จำเป็น...'

  return (
    <Card className="text-center">
      <Result
        title={error || message}
        status={error ? 'error' : 'info'}
      />
      <WaitingAnnouncement />
    </Card>
  )
}

export default WaitingCard
