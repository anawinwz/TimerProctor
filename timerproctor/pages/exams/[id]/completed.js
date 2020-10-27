import { useRouter } from 'next/router'
import exams from '../../../layouts/exams'
import CompletedCard from '../../../components/exams/CompletedCard'

const CompletedPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <CompletedCard />
    </>
  )
}

CompletedPage.Layout = exams

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default CompletedPage
