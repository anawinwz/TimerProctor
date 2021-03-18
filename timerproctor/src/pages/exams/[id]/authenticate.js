import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import AuthenCard from '~/components/exams/AuthenCard'

const AuthenPage = () => {
  const { ExamStore: exam, AuthStore: { isLoggedIn }, IDCheckStore: idCheck } = useStore()
  
  if (!isLoggedIn)
    return <Redirect to={`/exams/${exam.id}`} />
  if (!exam.isIDCheck || idCheck.accepted)
    return <Redirect to={`/exams/${exam.id}/waiting`} />
    
  return (
    <AuthenCard />
  )
}

export default observer(AuthenPage)
