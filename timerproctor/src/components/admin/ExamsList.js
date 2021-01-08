import { useState, useEffect } from 'react'
import { message, Typography } from 'antd'

import { fetchAPIwithToken } from '../../utils/api'

import ContentBox from './ContentBox'
import AddExamButton from './AddExamButton'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ExamsList = ({ pageSize = 5 }) => {
  const [exams, setExams] = useState([])

  useEffect(async () => {
    try {
      const res = await fetchAPIwithToken('/exams')
      const { status, payload, message } = res
      if (status === 'success') setExams(payload.exams)
      else throw new Error(message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการสอบของฉัน')
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการสอบของฉัน')
    }
  }, [])

  return (
    <ContentBox>
      <Title level={3}>การสอบของฉัน</Title>
      <AddExamButton />
      <ExamsListTable pageSize={pageSize} dataSource={exams} />
    </ContentBox>
  ) 
}

export default ExamsList
