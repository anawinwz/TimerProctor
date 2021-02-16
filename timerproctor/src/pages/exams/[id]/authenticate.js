import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import AuthenCard from '~/components/exams/AuthenCard'

const AuthenPage = ({ history }) => {
  const { ExamStore: exam, AuthStore: { isLoggedIn } } = useStore()

  useEffect(() => {
    if (!isLoggedIn) history.replace(`/exams/${exam.id}`)
  }, [])
  
  return (
    <AuthenCard />
  )
}

export default observer(AuthenPage)
