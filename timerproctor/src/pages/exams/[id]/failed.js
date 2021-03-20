import { Redirect } from 'react-router' 
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'
import FailedCard from '~/components/exams/FailedCard'

const FailedPage = () => {
  const { SocketStore: socketStore, TimerStore: timer, ExamStore: exam } = useStore()
  
  if (!socketStore.socket || (exam.status !== 'stopped' && timer.isTimeout === false))
    return <Redirect to={`/exams/${exam.id}`} />

  return (
    <FailedCard />
  )
}

export default observer(FailedPage)
