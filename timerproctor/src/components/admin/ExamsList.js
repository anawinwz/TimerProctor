import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { message, Typography } from 'antd'

import { fetchAPIwithAdminToken } from '~/utils/api'

import ContentBox from './ContentBox'
import AddExamButton from './AddExamButton'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ExamsList = ({ pageSize = 5 }) => {
  const history = useHistory()

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
      <AddExamButton />
      <ExamsListTable loading={loading} pageSize={pageSize} dataSource={exams} />
    </ContentBox>
  ) 
}

export default ExamsList
