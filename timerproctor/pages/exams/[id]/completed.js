import { useRouter } from 'next/router'
import Header from '../../../components/exams/Header'
import CenterContainer from '../../../components/CenterContainer'
import CompletedCard from '../../../components/exams/CompletedCard'

const CompletedPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Header />
      <CenterContainer full>
        <CompletedCard />
      </CenterContainer>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default CompletedPage
