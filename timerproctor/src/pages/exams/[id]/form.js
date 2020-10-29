
import { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { useStore } from '../../../stores'
import Form from '../../../components/exams/Form'

const FormPage = () => {
  const { ExamStore: exam } = useStore()
  const [count, setCount] = useState(0)

  const onLoad = useCallback(() => {
    setCount(prevState => prevState + 1)
  }, [])

  if (count > 1) return <Redirect to={`/exams/${exam.id}/completed`} />
  else if (exam.status === 'stopped') return <Redirect to={`/exams/${exam.id}/failed`} />
  return (
    <>
      <Form
        formId="1FAIpQLScOZB90bgzMi0oNuqxSzqsiaEqkQSKIxlG5P5mDbTOxFgWLGA"
        onLoad={onLoad}
      />
    </>
  )
}

export default observer(FormPage)
