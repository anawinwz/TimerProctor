import { Card, Result, Alert } from 'antd'
import { observer } from 'mobx-react'
import { useStore } from '../../stores'

const WaitingAnnoucement = observer(() => {
  const { ExamStore: { annoucements } } = useStore()
  return annoucements.length === 0 ? null : (
    <Alert
      type="info"
      showIcon
      message="ประกาศล่าสุดจากอาจารย์ผู้สอน"
      description={annoucements[annoucements.length - 1]}
    />
  )
})

const WaitingCard = () => {
  return (
    <Card className="text-center">
      <Result
        title="อยู่ระหว่างรออาจารย์ผู้สอนให้สัญญาณเริ่มการสอบ"
      />
      <WaitingAnnoucement />
    </Card>
  )
}

export default WaitingCard
