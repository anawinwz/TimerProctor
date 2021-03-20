import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import CompletedCard from '~/components/exams/CompletedCard'
import { Redirect } from 'react-router'

const CompletedPage = () => {
  const { ExamStore: exam, AttemptStore: attempt } = useStore()

  if (attempt.status !== 'completed')
    return <Redirect to={`/exams/${exam.id}`} />

  return (
    <CompletedCard />
  )
}

export default observer(CompletedPage)
