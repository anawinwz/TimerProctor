import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import { isModelLoaded } from '~/utils/faceDetection'

import WaitingCard from '~/components/exams/WaitingCard'

const WaitingPage = () => {
  const { ExamStore: exam, SocketStore: socketStore } = useStore()
  useEffect(() => exam.getAnnouncements(), [])

  if (!socketStore.socket)
    return <Redirect to={`/exams/${exam.id}`} />
  else if (isModelLoaded && exam.status === 'started')
    return <Redirect to={`/exams/${exam.id}/attempt`} />
  return (
    <WaitingCard />
  )
}

export default observer(WaitingPage)
