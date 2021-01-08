import styled from 'styled-components'
import { useCallback } from 'react'
import { Row, Col, Modal } from 'antd'
import { Link } from 'react-router-dom'
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

const ButtonCol = styled(Col)`
  cursor: pointer;
  a { color: white; }
  &:hover {
    opacity: 0.8;
  }
`

const ExamTester = ({ tester }) => {
  const kickOut = useCallback(() => {
    Modal.confirm({
      title: `คุณแน่ใจหรือว่าต้องการเชิญ ${tester.name} ออกจากห้องสอบ?`,
      content: `การดำเนินการนี้ไม่สามารถยกเลิกได้`,
      okText: 'ยืนยันการเชิญออก',
      okType: 'danger',
      cancelText: 'ยกเลิก',
    })
  }, [tester])

  return (
    <>
      <ImageBox style={{ backgroundImage: `url(${tester.lastSnapshot.url})` }}>
        <div className="hover-box">
          <Row justify="center" align="middle" className="text-center" style={{ height: '100%' }}>
            <ButtonCol span={6} onClick={kickOut}>
              <StopOutlined /> เชิญออก
            </ButtonCol>
            <ButtonCol span={6}>
              <Link to={`/admin/testers/${tester._id}`}><InfoCircleOutlined /> ข้อมูล</Link>
            </ButtonCol>
          </Row>
        </div>
      </ImageBox>
      <span>{ tester.name }</span>
    </>
  )
}

export default ExamTester
