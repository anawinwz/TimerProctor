import { Space, Card, Descriptions, Typography } from 'antd'
const { Title } = Typography

const IntroCard = () => {
  return (
    <Space direction="vertical" size="large">
      <Title level={2} className="text-center">ข้อสอบกลางภาค วิชา มนุษย์กับทะเล</Title>
      <Card>
        <Descriptions column={1} className="mx-auto">
          <Descriptions.Item label="เวลาเริ่ม-สิ้นสุด">ผู้สอนจะให้สัญญาณเริ่ม-สิ้นสุดการสอบด้วยตนเอง</Descriptions.Item>
          <Descriptions.Item label="เวลาในการสอบ">50 นาที</Descriptions.Item>
        </Descriptions>

        <div className="text-center">
          <Title level={4}>คำชี้แจงการสอบจากอาจารย์ผู้สอน</Title>
          <p>
            เป็นข้อสอบปรนัย 3 ข้อ <br/>
            มีเวลาในการทำข้อสอบ 50 นาที<br/>
            โดยจะเริ่มจับเวลาพร้อมกันทุกคน ขอให้นิสิตเข้าสู่ห้องสอบโดยเร็ว
          </p>
        </div>
      </Card>
    </Space>
  )
}

export default IntroCard
