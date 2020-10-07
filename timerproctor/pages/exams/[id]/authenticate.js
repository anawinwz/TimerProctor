import { useRouter } from 'next/router'
import Header from '../../../components/exams/Header'
import CenterContainer from '../../../components/CenterContainer'
import AuthenCard from '../../../components/exams/AuthenCard'

const AuthenPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <CenterContainer fixed>
        <Header />
      </CenterContainer>
      <CenterContainer full>
        <AuthenCard />
      </CenterContainer>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default AuthenPage
