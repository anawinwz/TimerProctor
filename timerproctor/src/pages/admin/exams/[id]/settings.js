import { useEffect, useCallback } from 'react'
import { Skeleton } from 'antd'

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

  const onEditName = useCallback(name => {
    examAdmin?.editName(name)
  }, [examAdmin])
  
  if (loading) return <ContentBox><Skeleton /></ContentBox>
  else if (error) return <ErrorContentBox />
  return (
    <ContentBox>
      <ExamTitle exam={exam} editable={true} onEdit={onEditName} />
      <ExamSettingsForm /> 
    </ContentBox>
  )
}

export default observer(ExamSettings)
