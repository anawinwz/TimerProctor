import { useState, useEffect, useCallback } from 'react'
import { message, Typography } from 'antd'

import { fetchAPIwithAdminToken } from '~/utils/api'

import ContentBox from './ContentBox'
import ExamsList from './ExamsList'

const { Title } = Typography

const ProctoringsListBox = () => {
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [proctorings, setProctorings] = useState([])

  useEffect(async () => {
    setLoading(true)
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
  }, [lastRefresh])

  const onProctoringRespond = useCallback(async (id, respond) => {
    try {
      const res = await fetchAPIwithAdminToken(`/proctorings/${id}`, { status: respond }, 'PATCH')
      const { status, payload, message } = res
      if (status === 'ok') {
        setLastRefresh(Date.now())
      } else {
        throw new Error(message || 'เกิดข้อผิดพลาดในการตอบรับ/ปฏิเสธการคุมสอบ')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการตอบรับ/ปฏิเสธการคุมสอบ')
    }
  }, [])

  return (
    <ContentBox>
      <Title level={3}>การคุมสอบของฉัน</Title>
      <ExamsList
        loading={loading}
        dataSource={proctorings}
        onProctoringRespond={onProctoringRespond}
      />
    </ContentBox>
  ) 
}

export default ProctoringsListBox
