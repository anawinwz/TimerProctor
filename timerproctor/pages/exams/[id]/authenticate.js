import { useRouter } from 'next/router'
import exams from '../../../layouts/exams'
import AuthenCard from '../../../components/exams/AuthenCard'

const AuthenPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <AuthenCard />
    </>
  )
}

AuthenPage.Layout = exams

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default AuthenPage
