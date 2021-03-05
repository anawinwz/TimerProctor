import { useState, useEffect } from 'react'
import { message, Typography } from 'antd'

import { fetchAPIwithAdminToken } from '~/utils/api'

import ContentBox from './ContentBox'
import ExamsList from './ExamsList'

const { Title } = Typography

const ProctoringsListBox = () => {
  const [loading, setLoading] = useState(true)
  const [proctorings, setProctorings] = useState([])

  useEffect(async () => {
    try {
      const res = await fetchAPIwithAdminToken('/proctorings')
      const { status, payload, message } = res
      if (status === 'ok') {
        setProctorings(payload.proctorings)
        setLoading(false)
      } else {
        throw new Error(message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการคุมสอบของฉัน')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการคุมสอบของฉัน')
    }
  }, [])

  return (
    <ContentBox>
      <Title level={3}>การคุมสอบของฉัน</Title>
      <ExamsList loading={loading} dataSource={proctorings} />
    </ContentBox>
  ) 
}

export default ProctoringsListBox
