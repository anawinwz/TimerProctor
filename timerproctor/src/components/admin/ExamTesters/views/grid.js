import { Col } from 'antd'
import ExamTester from '../../ExamTester'

const colSizeMap = {
  6: { span: 8 },
  12: { span: 6 },
  16: { span: 6 },
  20: { span: 6 },
  24: { span: 6 },
}

const GridView = ({ pageSize = 6, testers = [] }) => {
  return testers.map(tester => (
    <Col { ...colSizeMap[pageSize] }>
      <ExamTester tester={tester} />
    </Col>
  ))
}

export default GridView