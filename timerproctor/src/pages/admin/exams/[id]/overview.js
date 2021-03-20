import { useEffect } from 'react'
import { Tabs } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import useAppTitle from '~/hooks/useAppTitle'

import ExamOverviewLoading from '~/components/admin/loading/ExamOverview'

import ContentBox from '~/components/admin/ContentBox'
import ErrorContentBox from '~/components/admin/ErrorContentBox'

import ExamTitle from '~/components/admin/ExamTitle'
import ExamStatusControls from '~/components/admin/ExamStatusControls'
import ExamDescription from '~/components/admin/ExamDescription'
import { testerStatuses } from '~/utils/const'
import ExamTesters from '~/components/admin/ExamTesters'
import TesterCountsBadge from 'components/admin/TesterCountsBadge'

const { TabPane } = Tabs

const ExamOverview = () => {
  const { ExamStore: examStore, ExamAdminStore: examAdmin } = useStore()
  const { loading, error, info: exam } = examStore

  useAppTitle(loading ? 'กำลังโหลด...' : exam?.name, { admin: true })

  useEffect(async () => {
    await examStore?.getInfo()
    examAdmin?.getTestersCount(true)
    examAdmin?.getTesters()
  }, [])

  const statuses = { all: 'ทั้งหมด', ...testerStatuses }
  const onTabChange = status => {
    examAdmin?.setCurrentStatus(status)
    examAdmin?.setHasNoNewCount(status)
  }
  
  if (loading || examAdmin?.loading) return <ExamOverviewLoading />
  else if (error) return <ErrorContentBox />
  return (
    <ContentBox>
      <ExamTitle exam={exam} />
      <ExamStatusControls exam={exam} />
      <ExamDescription />
      <Tabs centered activeKey={examAdmin?.currentStatus} onChange={onTabChange}>
        { 
          Object.keys(statuses).map(key => {
            return (
              <TabPane
                key={key}
                tab={<>
                  { statuses[key] }{' '}
                  <TesterCountsBadge
                    count={examAdmin.counts?.[key] || 0}
                    isNew={examAdmin.hasNewCounts?.[key] || false}
                  />
                </>}
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
