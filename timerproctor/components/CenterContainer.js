import { Row, Col } from 'antd'

const CenterContainer = (props) => (
  <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
    <Col span={12}>
      { props.children }
    </Col>
  </Row>
)
export default CenterContainer
