import { Button } from 'antd'
import { CaretRightFilled, StopFilled } from '@ant-design/icons'

const ExamStatusControls = ({ exam }) => {
  const { status } = exam

  if (status === 'started') {
    return (
      <>
        <Button type="danger" icon={<StopFilled />}>สิ้นสุดการสอบ</Button> 
        ดำเนินไปแล้ว ...
      </>
    )
  }
  return <Button type="primary" icon={<CaretRightFilled />}>เริ่มการสอบ</Button>
}

export default ExamStatusControls
