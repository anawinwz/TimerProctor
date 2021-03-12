import styled from 'styled-components'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { StopOutlined, InfoCircleOutlined } from '@ant-design/icons'
import ExamTesterTerminateModal from './ExamTesterTerminateModal'

const ImageBox = styled(`div`)`
  width: 100%;
  height: 160px;
  border-radius: 10px;
  background-color: black;
  background-size: contain;
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

const ButtonCol = styled(Col)`
  cursor: pointer;
  a { color: white; }
  &:hover {
    opacity: 0.8;
  }
`

const ExamTester = ({ tester }) => {
  const [show, _, modal] = ExamTesterTerminateModal({
    testerId: tester._id,
    testerName: tester.name
  })

  return (
    <>
      { modal }
      <ImageBox style={{ backgroundImage: `url(${tester.lastSnapshot?.url || tester.avatar})` }}>
        <div className="hover-box">
          <Row justify="center" align="middle" className="text-center" style={{ height: '100%' }}>
            <ButtonCol span={6} onClick={show}>
              <StopOutlined /> เชิญออก
            </ButtonCol>
            <ButtonCol span={6}>
              <Link to={`testers/${tester._id}`}><InfoCircleOutlined /> ข้อมูล</Link>
            </ButtonCol>
          </Row>
        </div>
      </ImageBox>
      <span>{ tester.name }</span>
    </>
  )
}

export default ExamTester
