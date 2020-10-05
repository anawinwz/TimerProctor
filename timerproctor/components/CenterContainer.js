import { Row, Col } from 'antd'

const CenterContainer = (props) => {
  const options = props?.full ? { align: "middle",  style: { minHeight: '100vh' } } : {}
  return (
    <Row type="flex" justify="center" {...options}>
      <Col span={12}>
        { props.children }
      </Col>
    </Row>
  )
}

export default CenterContainer
