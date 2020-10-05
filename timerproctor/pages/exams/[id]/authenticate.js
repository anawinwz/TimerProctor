import { useRouter } from 'next/router'
import { Space } from 'antd'
import Header from '../../../components/exams/Header'
import CenterContainer from '../../../components/CenterContainer'

const AuthenPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <CenterContainer>
      <Space direction="vertical" size="large" className="w-100">
        <Header />
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
