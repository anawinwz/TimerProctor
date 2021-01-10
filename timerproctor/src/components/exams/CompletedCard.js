
import { useEffect } from 'react'
import { Card, Result, Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

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
        extra={
          <Button type="primary">
            ออกจากระบบ
          </Button>
        }
      />
    </Card>
  )
}

export default observer(CompletedCard)
