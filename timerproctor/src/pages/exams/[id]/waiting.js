
import { observer } from 'mobx-react'
import { useStore } from '../../../stores'
import WaitingCard from '../../../components/exams/WaitingCard'
import { Redirect } from 'react-router-dom'

const WaitingPage = () => {
  const { ExamStore: exam } = useStore()

  if (exam.status === 'started') return <Redirect to={`/exams/${exam.id}/form`} />
  return (
    <>
      <WaitingCard />
    </>
  )
}

export default observer(WaitingPage)
