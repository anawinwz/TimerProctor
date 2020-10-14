import { useRouter } from 'next/router'
import Header from '../../../components/exams/Header'
import CenterContainer from '../../../components/CenterContainer'
import WaitingCard from '../../../components/exams/WaitingCard'

const WaitingPage = (props) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Header />
      <CenterContainer full>
        <WaitingCard />
      </CenterContainer>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

export default WaitingPage
