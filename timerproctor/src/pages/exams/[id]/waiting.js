import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import WaitingCard from '~/components/exams/WaitingCard'

const WaitingPage = () => {
  const { AppStore: app, ExamStore: exam, SocketStore: socketStore } = useStore()
  useEffect(() => exam.getAnnouncements(), [])

  if (!socketStore.socket)
    return <Redirect to={`/exams/${exam.id}`} />
  else if (app.isFaceModelLoaded && exam.status === 'started')
    return <Redirect to={`/exams/${exam.id}/attempt`} />
  return (
    <WaitingCard />
  )
}

export default observer(WaitingPage)
