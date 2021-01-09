import { observer } from 'mobx-react'
import { useStore } from '~/stores/index'
import { Space, Card, Descriptions, Typography } from 'antd'
const { Title } = Typography

const TimeWindowMode = (examInfo) => {
  const timeWindow = examInfo.timeWindow
  if (!timeWindow) return 'ไม่มีข้อมูล'

  const setting = timeWindow[timeWindow.mode]
  if (timeWindow.mode === 'schedule') {
    return `${setting.startDate} ถึง ${setting.endDate}`
  }
  return 'ผู้สอนจะให้สัญญาณเริ่ม-สิ้นสุดการสอบด้วยตนเอง'
}

const IntroCard = () => {
  const { ExamStore: exam } = useStore()
  const examInfo = exam?.info
  return (
    <Space direction="vertical" size="large">
      <Title level={2} className="text-center">{ examInfo.name }</Title>
      <Card>
        <Descriptions column={1} className="mx-auto">
          <Descriptions.Item label="เวลาเริ่ม-สิ้นสุด">
            { TimeWindowMode(examInfo) }
          </Descriptions.Item>
          <Descriptions.Item label="เวลาในการสอบ">{ examInfo.timer?.duration } นาที</Descriptions.Item>
        </Descriptions>

        <div className="text-center">
          <Title level={4}>คำชี้แจงการสอบจากอาจารย์ผู้สอน</Title>
          <p dangerouslySetInnerHTML={{ __html: examInfo.desc }}></p>
        </div>
      </Card>
    </Space>
  )
}

export default observer(IntroCard)
