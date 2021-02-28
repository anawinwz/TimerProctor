import { useEffect, useCallback } from 'react'
import { message, Skeleton, Tabs } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import useAppTitle from '~/hooks/useAppTitle'

import ContentBox from '~/components/admin/ContentBox'
import ErrorContentBox from '~/components/admin/ErrorContentBox'
import ExamTitle from '~/components/admin/ExamTitle'
import ExamSettingsForm from '~/components/admin/ExamSettingsForm'

const ExamSettings = () => {
  const { ExamStore: examStore, ExamAdminStore: examAdmin } = useStore()
  const { loading, error, info: exam } = examStore
  
  useAppTitle('ตั้งค่าการสอบ', { admin: true })

  useEffect(() => {
    examStore?.getInfo()
  }, [])

  const onEditName = useCallback(async name => {
    try {
      if (typeof name === 'string' && name.trim())
        await examAdmin?.editName(name.trim())
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนแปลงชื่อ')
    }
  }, [examAdmin])
  
  if (loading) return <ContentBox><Skeleton /></ContentBox>
  else if (error) return <ErrorContentBox />
  return (
    <ContentBox>
      <ExamTitle exam={exam} editable={true} onEdit={onEditName} />
      <Tabs defaultActiveKey="general">
        <Tabs.TabPane
          tab="ทั่วไป"
          key="general"
        >
          <ExamSettingsForm /> 
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="กรรมการคุมสอบ"
          key="proctors"
        />
        <Tabs.TabPane
          tab="ผู้เข้าสอบ"
          key="testtakers"
        />
      </Tabs>
    </ContentBox>
  )
}

export default observer(ExamSettings)
