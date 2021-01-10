
import { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Redirect } from 'react-router-dom'
import { useStore } from '~/stores/index'
import Form from '~/components/exams/Form'
import Trackers from '~/components/exams/Trackers'

const AttemptPage = () => {
  const { ExamStore: exam, TimerStore: timer, SocketStore: socketStore } = useStore()
  const [count, setCount] = useState(0)

  useEffect(() => {
    timer.set({ endTime: exam.info?.timer?.duration * 60  })
    timer.start()
    socketStore.socket.emit('start')
  }, [])

  const onLoad = useCallback(() => {
    setCount(prevState => prevState + 1)
  }, [])

  if (count > 1) return <Redirect to={`/exams/${exam.id}/completed`} />
  else if (exam.status === 'stopped' || timer.isTimeout === true) return <Redirect to={`/exams/${exam.id}/failed`} />
  return (
    <>
      <Trackers />
      <Form
        formId="1FAIpQLScOZB90bgzMi0oNuqxSzqsiaEqkQSKIxlG5P5mDbTOxFgWLGA"
        onLoad={onLoad}
      />
    </>
  )
}

export default observer(AttemptPage)
