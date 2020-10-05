import { useRouter } from 'next/router'
import { Space } from 'antd'
import Header from '../../../components/exams/Header'
import CenterContainer from '../../../components/CenterContainer'
import AuthenCard from '../../../components/exams/AuthenCard'

const AuthenPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <CenterContainer>
      <Space direction="vertical" size="large" className="w-100">
        <Header />
        <AuthenCard />
      </Space>
    </CenterContainer>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default AuthenPage
