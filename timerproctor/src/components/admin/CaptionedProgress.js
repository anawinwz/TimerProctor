import { Row, Col, Progress } from 'antd'

const CaptionedProgress = ({ children, ...props }) => {
  return (
    <Row gutter={10}>
      <Col span={12}><Progress size="small" showInfo={false} {...props} /></Col>
      <Col span={12}>{ children }</Col>
    </Row>
  )
}

export default CaptionedProgress
