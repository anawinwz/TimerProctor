import exams from '../../../layouts/exams'
import AuthenCard from '../../../components/exams/AuthenCard'

const AuthenPage = (props) => {
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