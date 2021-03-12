import { Empty, Col } from 'antd'
import { observer } from 'mobx-react-lite'
import ExamTester from '../../ExamTester'

const colSizeMap = {
  6: { xs: 12, md: 8 },
  12: { xs: 12, md: 6 },
  16: { xs: 12, md: 6 },
  20: { xs: 12, md: 6 },
  24: { xs: 12, md: 6 },
}

const GridView = ({ pageSize = 6, testers = [], noStatus = false }) => {
  if (testers.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  return testers.map(tester => (
    <Col key={tester._id} { ...colSizeMap[pageSize] }>
      <ExamTester tester={tester} noStatus={noStatus} />
    </Col>
  ))
}

export default observer(GridView)
