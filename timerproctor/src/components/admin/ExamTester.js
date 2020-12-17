import styled from 'styled-components'
import { Row, Col } from 'antd'
import { StopOutlined, InfoCircleOutlined } from '@ant-design/icons'

const ImageBox = styled(`div`)`
  width: 100%;
  height: 160px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  .hover-box {
    display: none;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: rgba(0, 0, 0, 50%);
    color: white;
    .anticon {
      font-size: 32px;
      display: block;
    }
  }
  &:hover {
    .hover-box { display: block; }
  }
`

const ExamTester = ({ tester }) => {
  return (
    <>
      <ImageBox style={{ backgroundImage: `url(${tester.lastSnapshot.url})` }}>
        <div class="hover-box">
          <Row justify="center" align="middle" className="text-center" style={{ height: '100%' }}>
            <Col span={6}><StopOutlined /> เชิญออก</Col>
            <Col span={6}><InfoCircleOutlined /> ข้อมูล</Col>
          </Row>
        </div>
      </ImageBox>
      <span>{ tester.name }</span>
    </>
  )
}

export default ExamTester
