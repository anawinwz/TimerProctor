import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { message, Typography } from 'antd'

import { fetchAPIwithAdminToken } from '~/utils/api'

import ContentBox from './ContentBox'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ProctoringsList = () => {
  const history = useHistory()

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
      if (err.needRelogin) {
        window.sessionStorage.setItem('nextURL', history.location.pathname)
        return history.replace(`/admin/login`)
      }
      message.error(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการคุมสอบของฉัน')
    }
  }, [])

  return (
    <ContentBox>
      <Title level={3}>การคุมสอบของฉัน</Title>
      <ExamsListTable loading={loading} dataSource={proctorings} />
    </ContentBox>
  ) 
}

export default ProctoringsList
