import { Row, Col } from 'antd'

const CenterContainer = (props) => {
  let options = { style: {} }
  if (props?.full) {
    options.align = 'middle'
    options.style.minHeight = '100vh'
  }
  if (props?.fixed) {
    options.style.position = 'fixed !important'
    options.style.width = '100%'
  }

  return (
    <Row type="flex" justify="center" {...options}>
      <Col xs={23} md={12}>
        { props.children }
      </Col>
    </Row>
  )
}

export default CenterContainer
