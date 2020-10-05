import { useRouter } from 'next/router'
import { Space } from 'antd'
import CenterContainer from '../../../components/CenterContainer'
import IntroCard from '../../../components/exams/IntroCard'
import IntroLogin from '../../../components/exams/IntroLogin'

const IntroPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <CenterContainer full>
      <Space direction="vertical" size="large">
        <IntroCard />
        <IntroLogin />
      </Space>
    </CenterContainer>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default IntroPage
