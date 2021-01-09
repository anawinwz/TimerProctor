import { useEffect, useCallback } from 'react'
import { Skeleton } from 'antd'

import { observer } from 'mobx-react'
import { useStore } from '~/stores/admin'

import ContentBox from '~/components/admin/ContentBox'
import ExamTitle from '~/components/admin/ExamTitle'
import ExamSettingsForm from '~/components/admin/ExamSettingsForm'


const ExamSettings = () => {
  const { ExamStore: examStore, ExamAdminStore: examAdmin } = useStore()
  const { loading, info: exam } = examStore
  
  useEffect(() => {
    examStore?.getInfo()
  }, [])

  const onEditName = useCallback(name => {
    examAdmin?.editName(name)
  }, [examAdmin])
  
  return (
    <ContentBox>
      { loading ? 
        <Skeleton /> :
        <>
          <ExamTitle exam={exam} editable={true} onEdit={onEditName} />
          <ExamSettingsForm /> 
        </>
      }
    </ContentBox>
  )
}

export default observer(ExamSettings)
