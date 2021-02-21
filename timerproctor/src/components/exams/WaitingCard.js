import { Card, Result, Alert } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

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
  return (
    <Card className="text-center">
      <Result
        title="อยู่ระหว่างรออาจารย์ผู้สอนให้สัญญาณเริ่มการสอบ"
      />
      <WaitingAnnouncement />
    </Card>
  )
}

export default WaitingCard
