import { Row, Col } from 'antd'

const CenterContainer = (props) => {
  let options = { style: props?.style || {} }
  if (props?.full) {
    options.align = 'middle'
    options.style.minHeight = '100vh'
  }
  if (props?.fixed) {
    options.style.position = 'fixed'
    options.style.width = '100%'
  }

  return (
    <Row type="flex" justify="center" {...options}>
      <Col xs={24} sm={23} md={20} lg={18} xl={14} xxl={12}>
        { props.children }
      </Col>
    </Row>
  )
}

export default CenterContainer
