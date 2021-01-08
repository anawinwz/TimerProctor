import { Tabs } from 'antd'

import { observer } from 'mobx-react'
import { useStore } from '../../../../stores/admin.js'

import ExamOverviewLoading from '../../../../components/admin/loading/ExamOverview.js'

import ContentBox from '../../../../components/admin/ContentBox'
import ExamTitle from '../../../../components/admin/ExamTitle'
import ExamStatusControls from '../../../../components/admin/ExamStatusControls'
import ExamDescription from '../../../../components/admin/ExamDescription'
import { testerStatuses } from '../../../../utils/const'
import WhiteBadge from '../../../../components/WhiteBadge'
import ExamTesters from '../../../../components/admin/ExamTesters'

const { TabPane } = Tabs

const ExamOverview = () => {
  const { ExamStore: { loading, info: exam } } = useStore()

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
                tab={<>{ statuses[key] } <WhiteBadge count={0} showZero /></>}
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
