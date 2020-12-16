import { useState } from 'react'

import demoExam from '../../../../assets/demoExam.json'

import ContentBox from '../../../../components/admin/ContentBox'
import ExamTitle from '../../../../components/admin/ExamTitle'
import ExamStatusControls from '../../../../components/admin/ExamStatusControls'
import ExamDescription from '../../../../components/admin/ExamDesciption'

const ExamOverview = () => {
  const [exam, setExam] = useState(demoExam)
  
  return (
    <ContentBox>
      <ExamTitle exam={exam} />
      <ExamStatusControls exam={exam} />
      <ExamDescription exam={exam} />
    </ContentBox>
  )
}

export default ExamOverview
