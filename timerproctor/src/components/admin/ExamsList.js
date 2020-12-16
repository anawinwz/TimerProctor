import { Typography } from 'antd'

import ContentBox from './ContentBox'
import AddExamButton from './AddExamButton'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ExamsList = ({ pageSize = 5 }) => {
  return (
    <ContentBox>
      <Title level={3}>การสอบของฉัน</Title>
      <AddExamButton />
      <ExamsListTable pageSize={pageSize} />
    </ContentBox>
  ) 
}

export default ExamsList
