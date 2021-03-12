import styled from 'styled-components'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { StopOutlined, InfoCircleOutlined } from '@ant-design/icons'
import ExamTesterTerminateModal from './ExamTesterTerminateModal'
import { testerStatuses, testerTerminatableStatuses } from 'utils/const'

const ImageBox = styled(`div`)`
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 10px;
  background-color: black;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
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
  .status-label {
    position: absolute;
    z-index: 1;
    width: fit-content;
    padding: 2px 5px;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.9);
    color: black;
    font-size: 12px;
  }
`

const ButtonCol = styled(Col)`
  cursor: pointer;
  a { color: white; }
  &:hover {
    opacity: 0.8;
  }
  ${props => props.disabled ? `
  cursor: default;
  opacity: 0.4;
  &:hover { opacity: 0.4; }
  ` : ''}
`

const ExamTester = ({ tester, noStatus = false }) => {
  const [show, _, modal] = ExamTesterTerminateModal({
    testerId: tester._id,
    testerName: tester.name
  })

  const terminatable = testerTerminatableStatuses.includes(tester.status)
  return (
    <>
      { modal }
      <ImageBox style={{ backgroundImage: `url(${tester.lastSnapshot?.url || tester.avatar})` }}>
        {!noStatus && <span class="status-label">{ testerStatuses[tester.status] }</span> }
        <div className="hover-box">
          <Row justify="center" align="middle" className="text-center" style={{ height: '100%' }}>
            <ButtonCol xs={24} md={6} onClick={terminatable ? show : () => {}} disabled={!terminatable}>
              <StopOutlined /> เชิญออก
            </ButtonCol>
            <ButtonCol xs={24} md={6}>
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
