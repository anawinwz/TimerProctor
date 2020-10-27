import { useRouter } from 'next/router'
import exams from '../../../layouts/exams'
import WaitingCard from '../../../components/exams/WaitingCard'

const WaitingPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <WaitingCard />
    </>
  )
}
WaitingPage.Layout = exams

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default WaitingPage
