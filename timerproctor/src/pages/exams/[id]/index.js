import { Space } from 'antd'
import IntroCard from '../../../components/exams/IntroCard'
import IntroLogin from '../../../components/exams/IntroLogin'

const IntroPage = () => {
  return (
    <Space direction="vertical" size="large">
      <IntroCard />
      <IntroLogin />
    </Space>
  )
}

export default IntroPage
