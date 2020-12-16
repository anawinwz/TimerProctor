import { useCallback, useState } from 'react'

import demoExam from '../../../../assets/demoExam.json'

import ContentBox from '../../../../components/admin/ContentBox'
import ExamTitle from '../../../../components/admin/ExamTitle'
import ExamSettingsForm from '../../../../components/admin/ExamSettingsForm'

const ExamSettings = () => {
  const [exam, setExam] = useState(demoExam)

  const onEditName = useCallback(name => {
    setExam(exam => setExam({ ...exam, name }))
  }, [setExam])
  
  return (
    <ContentBox>
      <ExamTitle exam={exam} editable={true} onEdit={onEditName} />
      <ExamSettingsForm />
    </ContentBox>
  )
}

export default ExamSettings
