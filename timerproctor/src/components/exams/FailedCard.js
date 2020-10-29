
import { Card, Result, Button } from 'antd'

const FailedCard = () => {
  return (
    <Card className="text-center">
      <Result
        status="error"
        title="การสอบล้มเหลว"
        subTitle="คุณใช้เวลาในการทำข้อสอบนานเกินกว่าเวลาที่กำหนดไว้"
        extra={
          <Button type="primary">
            ออกจากระบบ
          </Button>
        }
      />
    </Card>
  )
}

export default FailedCard
