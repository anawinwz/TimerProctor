import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import CompletedCard from '~/components/exams/CompletedCard'
import { Redirect } from 'react-router'

const CompletedPage = () => {
  const { ExamStore: exam, SocketStore: socketStore } = useStore()

  if (!socketStore?.socket)
    return <Redirect to={`/exams/${exam.id}`} />

  return (
    <CompletedCard />
  )
}

export default observer(CompletedPage)
