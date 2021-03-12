import { useObserver } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'
import { Redirect } from 'react-router-dom'

const ExamPage = () => {
  const { ExamStore: exam } = useStore()
  const examId = useObserver(() => exam?.id)
  const examStatus = useObserver(() => exam?.info?.status)
  
  if (examStatus === 'unset') return <Redirect to={`/admin/exams/${examId}/settings`} />
  return <Redirect to={`/admin/exams/${examId}/overview`} />
}

export default ExamPage
