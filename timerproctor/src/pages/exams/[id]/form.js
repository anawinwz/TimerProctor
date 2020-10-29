
import { observer } from 'mobx-react'
import { useStore } from '../../../stores'
import { Redirect } from 'react-router-dom'

const FormPage = () => {
  const { ExamStore: exam } = useStore()

  if (exam.status === 'stopped') return <Redirect to={`/exams/${exam.id}/completed`} />
  return (
    <>
      Form Placeholder
    </>
  )
}

export default observer(FormPage)
