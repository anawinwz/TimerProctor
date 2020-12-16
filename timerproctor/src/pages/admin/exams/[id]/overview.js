import { useState } from 'react'
import { Tabs } from 'antd'

import demoExam from '../../../../assets/demoExam.json'

import ContentBox from '../../../../components/admin/ContentBox'
import ExamTitle from '../../../../components/admin/ExamTitle'
import ExamStatusControls from '../../../../components/admin/ExamStatusControls'
import ExamDescription from '../../../../components/admin/ExamDescription'
import { testerStatuses } from '../../../../utils/const'
import WhiteBadge from '../../../../components/WhiteBadge'
import ExamTesters from '../../../../components/admin/ExamTesters'

const { TabPane } = Tabs

const ExamOverview = () => {
  const [exam, setExam] = useState(demoExam)

  const statuses = { all: 'ทั้งหมด', ...testerStatuses }
  
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

export default ExamOverview
