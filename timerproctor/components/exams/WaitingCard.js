import { Card, Result, Alert } from 'antd'

const WaitingCard = () => {
  return (
    <Card className="text-center">
      <Result
        title="อยู่ระหว่างรออาจารย์ผู้สอนให้สัญญาณเริ่มการสอบ"
      />
      <Alert
        type="info"
        showIcon
        message="ประกาศจากอาจารย์ผู้สอน"
        description="เดี๋ยวรอเริ่มทำข้อสอบพร้อมกันประมาณ 13.05 น. นะครับ รอนิสิตอีกประมาณ 3-4 คน"
      />
    </Card>
  )
}

export default WaitingCard
