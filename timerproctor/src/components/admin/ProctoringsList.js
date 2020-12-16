import { Typography } from 'antd'

import ContentBox from './ContentBox'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ProctoringsList = () => {
  return (
    <ContentBox>
      <Title level={3}>การคุมสอบของฉัน</Title>
      <ExamsListTable />
    </ContentBox>
  ) 
}

export default ProctoringsList
