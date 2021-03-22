
import { useEffect } from 'react'
import { Card, Result } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import LogoutButton from '~/components/exams/LogoutButton'

const CompletedCard = () => {
  const { TimerStore: timer } = useStore()
  
  useEffect(() => {
    timer.pause()
  }, [])

  return (
    <Card className="text-center">
      <Result
        status="success"
        title="ส่งคำตอบแล้ว"
        subTitle={`คุณใช้เวลาในการทำข้อสอบไป ${timer.currentTime} วินาที`}
        extra={<LogoutButton />}
      />
    </Card>
  )
}

export default observer(CompletedCard)
