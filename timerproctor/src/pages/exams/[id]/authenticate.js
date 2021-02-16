import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import AuthenCard from '~/components/exams/AuthenCard'

const AuthenPage = () => {
  const { ExamStore: exam, AuthStore: { isLoggedIn } } = useStore()
  
  if (!isLoggedIn) return <Redirect to={`/exams/${exam.id}`} />
  return (
    <AuthenCard />
  )
}

export default observer(AuthenPage)
