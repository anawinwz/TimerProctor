import { useEffect } from 'react'
import { Tabs } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import ExamOverviewLoading from '~/components/admin/loading/ExamOverview'

import ContentBox from '~/components/admin/ContentBox'
import ExamTitle from '~/components/admin/ExamTitle'
import ExamStatusControls from '~/components/admin/ExamStatusControls'
import ExamDescription from '~/components/admin/ExamDescription'
import { testerStatuses } from '~/utils/const'
import WhiteBadge from '~/components/WhiteBadge'
import ExamTesters from '~/components/admin/ExamTesters'

const { TabPane } = Tabs

const ExamOverview = () => {
  const { ExamStore: examStore, ExamAdminStore: examAdmin } = useStore()
  const { loading, info: exam } = examStore

  useEffect(async () => {
    await examStore?.getInfo()
    examAdmin?.getCounts()
    examAdmin?.getTesters()
  }, [])

  const statuses = { all: 'ทั้งหมด', ...testerStatuses }
  
  if (loading) return <ExamOverviewLoading />
  return (
    <ContentBox>
      <ExamTitle exam={exam} />
      <ExamStatusControls exam={exam} />
      <ExamDescription exam={exam} />
      <Tabs centered>
        { 
          Object.keys(statuses).map(key => {
            return (
              <TabPane
                key={key}
                tab={<>{ statuses[key] } <WhiteBadge count={examAdmin.counts?.[key] || 0} showZero /></>}
              >
                <ExamTesters status={key} />
              </TabPane>
            )
          })
        }
      </Tabs> 
    </ContentBox>
  )
}

export default observer(ExamOverview)
