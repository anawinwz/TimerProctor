import { Card, Typography } from 'antd'
import AuthenFaceCanvas from './AuthenFaceCanvas'
const { Title } = Typography

const AuthenCard = () => {
  return (
    <Card className="text-center">
      <Title level={2} className="text-center">ยืนยันตัวบุคคล</Title>
      <p>
        กรุณาแสดงบัตรประจำตัวผู้เข้าสอบคู่กับใบหน้าของคุณ<br />
        เพื่อให้กรรมการคุมสอบตรวจและอนุมัติคุณเข้าสู่ห้องสอบ
      </p>
      <AuthenFaceCanvas />
    </Card>
  )
}

export default AuthenCard
