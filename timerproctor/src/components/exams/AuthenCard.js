import { Card, Typography, Modal } from 'antd'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from '../../stores'
import { showModal } from '../../utils/modal'
import AuthenFaceCanvas from './AuthenFaceCanvas'
const { Title } = Typography

const AuthenCard = () => {
  const { ExamStore: exam, AuthStore: auth } = useStore()
  const history = useHistory()

  useEffect(() => {
    if (!exam.isPromptIDCheck || auth.idCheck.accepted === true) {
      if (exam.status === 'started')
        history.replace(`/exams/${exam.id}/form`)
      else
        history.replace(`/exams/${exam.id}/waiting`)
    } else if (auth.idCheck.accepted === false) {
      showModal('error', 'ภาพของคุณถูกปฏิเสธ', (
        <>
          ภาพของคุณถูกปฏิเสธด้วยสาเหตุ<br />
          <b>[{auth.idCheck.reason}]</b><br />
          กรุณาลองบันทึกภาพใหม่อีกครั้ง
        </>
      ))
    }
  }, [exam.isPromptIDCheck, auth.idCheck.accepted])

  return (
    <Card className="text-center">
      <Title level={2} className="text-center">ยืนยันตัวบุคคล</Title>
      <p>
        กรุณาแสดงบัตรประจำตัวผู้เข้าสอบคู่กับใบหน้าของคุณ<br />
        เพื่อให้กรรมการคุมสอบตรวจและอนุมัติคุณเข้าสู่ห้องสอบ
      </p>
      <AuthenFaceCanvas
        sendState={auth.idCheck.sendState}
        setSendState={(state) => auth.setIDCheckState(state)}
        onSubmitPhoto={(img) => auth.submitIDCheck(img)}
      />
    </Card>
  )
}

export default observer(AuthenCard)
