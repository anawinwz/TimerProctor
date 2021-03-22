import { useState, useEffect } from 'react'
import { Card, Result } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import LogoutButton from '~/components/exams/LogoutButton'

const FailedCard = () => {
  const [msg, setMsg] = useState(['การสอบล้มเหลว', 'คุณใช้เวลาในการทำข้อสอบนานเกินกว่าเวลาที่กำหนดไว้'])
  const { TimerStore: timer } = useStore()

  useEffect(() => {
    if (timer.isRunning) {
      setMsg(['การสอบยุติแล้ว', 'อาจารย์ผู้สอนได้สั่งยุติการสอบแล้ว'])
      timer.reset()
    }
  }, [])

  return (
    <Card className="text-center">
      <Result
        status="error"
        title={msg[0]}
        subTitle={msg[1]}
        extra={<LogoutButton />}
      />
    </Card>
  )
}

export default observer(FailedCard)
