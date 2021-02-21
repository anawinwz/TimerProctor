import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import WaitingCard from '~/components/exams/WaitingCard'

const WaitingPage = () => {
  const { ExamStore: exam } = useStore()
  useEffect(() => exam.getAnnoucements(), [])

  if (exam.status === 'started') return <Redirect to={`/exams/${exam.id}/attempt`} />
  return (
    <>
      <WaitingCard />
    </>
  )
}

export default observer(WaitingPage)
