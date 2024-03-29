import { useState, useEffect } from 'react'
import { message, Typography } from 'antd'

import { fetchAPIwithAdminToken } from '~/utils/api'

import ContentBox from './ContentBox'
import AddExamButton from './AddExamButton'
import ExamsList from './ExamsList'

const { Title } = Typography

const ExamsListBox = ({ pageSize = 5 }) => {
  const [loading, setLoading] = useState(true)
  const [exams, setExams] = useState([])

  useEffect(async () => {
    try {
      const res = await fetchAPIwithAdminToken('/exams')
      const { status, payload, message } = res
      if (status === 'ok') {
        setExams(payload.exams)
        setLoading(false)
      } else {
        throw new Error(message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการสอบของฉัน')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการสอบของฉัน')
    }
  }, [])

  return (
    <ContentBox>
      <Title level={3}>การสอบของฉัน</Title>
      <ExamsList
        loading={loading}
        header={<AddExamButton />}
        pageSize={pageSize}
        dataSource={exams}
      />
    </ContentBox>
  ) 
}

export default ExamsListBox
