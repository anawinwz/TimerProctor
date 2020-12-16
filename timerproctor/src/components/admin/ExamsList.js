import { Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import ContentBox from './ContentBox'
import ExamsListTable from './ExamsListTable'

const { Title } = Typography

const ExamsList = () => {
  return (
    <ContentBox>
      <Title level={3}>การสอบของฉัน</Title>
      <Button icon={<PlusOutlined />} type="primary"> เพิ่มการสอบ</Button>
      <ExamsListTable />
    </ContentBox>
  ) 
}

export default ExamsList
