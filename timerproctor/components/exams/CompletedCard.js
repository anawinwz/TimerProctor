import { Card, Result, Button } from 'antd'

const CompletedCard = () => {
  return (
    <Card className="text-center">
      <Result
        status="success"
        title="ส่งคำตอบแล้ว"
        subTitle="คุณใช้เวลาในการทำข้อสอบ 24 นาที 52 วินาที"
        extra={
          <Button type="primary">
            ออกจากระบบ
          </Button>
        }
      />
    </Card>
  )
}

export default CompletedCard
