import { useState } from 'react'
import { Tabs } from 'antd'

import demoExam from '../../../../assets/demoExam.json'

import ContentBox from '../../../../components/admin/ContentBox'
import ExamTitle from '../../../../components/admin/ExamTitle'
import ExamStatusControls from '../../../../components/admin/ExamStatusControls'
import ExamDescription from '../../../../components/admin/ExamDesciption'

const { TabPane } = Tabs

const ExamOverview = () => {
  const [exam, setExam] = useState(demoExam)
  
  return (
    <ContentBox>
      <ExamTitle exam={exam} />
      <ExamStatusControls exam={exam} />
      <ExamDescription exam={exam} />
      <Tabs centered>
        <TabPane key="all" tab="ทั้งหมด" />
        <TabPane key="waiting" tab="รออนุมัติเข้าสอบ" />
        <TabPane key="approved" tab="รอเข้าสอบ" />
        <TabPane key="doing" tab="ยังไม่ส่งคำตอบ" />
        <TabPane key="submitted" tab="ส่งคำตอบแล้ว" />
      </Tabs> 
    </ContentBox>
  )
}

export default ExamOverview
