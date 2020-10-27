import { useRouter } from 'next/router'
import { Space } from 'antd'
import IntroCard from '../../../components/exams/IntroCard'
import IntroLogin from '../../../components/exams/IntroLogin'

const IntroPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Space direction="vertical" size="large">
      <IntroCard />
      <IntroLogin />
    </Space>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default IntroPage
