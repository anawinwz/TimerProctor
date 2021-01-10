
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import WaitingCard from '~/components/exams/WaitingCard'
import { Redirect } from 'react-router-dom'

const WaitingPage = () => {
  const { ExamStore: exam } = useStore()

  if (exam.status === 'started') return <Redirect to={`/exams/${exam.id}/attempt`} />
  return (
    <>
      <WaitingCard />
    </>
  )
}

export default observer(WaitingPage)
