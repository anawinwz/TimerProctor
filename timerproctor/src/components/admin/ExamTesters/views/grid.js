import { Empty, Col } from 'antd'
import { observer } from 'mobx-react-lite'
import ExamTester from '../../ExamTester'

const colSizeMap = {
  6: { span: 8 },
  12: { span: 6 },
  16: { span: 6 },
  20: { span: 6 },
  24: { span: 6 },
}

const GridView = ({ pageSize = 6, testers = [] }) => {
  if (testers.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  return testers.map(tester => (
    <Col key={tester._id} { ...colSizeMap[pageSize] }>
      <ExamTester tester={tester} />
    </Col>
  ))
}

export default observer(GridView)
