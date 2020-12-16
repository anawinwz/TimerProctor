import { Typography } from 'antd'

import ContentBox from './ContentBox'
import AddExamButton from './AddExamButton'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ExamsList = () => {
  return (
    <ContentBox>
      <Title level={3}>การสอบของฉัน</Title>
      <AddExamButton />
      <ExamsListTable />
    </ContentBox>
  ) 
}

export default ExamsList
