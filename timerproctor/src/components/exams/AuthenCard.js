import { Card, Typography, Modal } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from '~/stores/index'
import { showModal } from '~/utils/modal'
import AuthenFaceCanvas from './AuthenFaceCanvas'
const { Title } = Typography

const AuthenCard = () => {
  const { AppStore: app, ExamStore: exam, IDCheckStore: idCheck } = useStore()
  const history = useHistory()

  useEffect(() => {
    if (!exam.isPromptIDCheck || idCheck.accepted === true) {
      if (exam.status === 'started')
        history.replace(`/exams/${exam.id}/attempt`)
      else
        history.replace(`/exams/${exam.id}/waiting`)
    } else if (idCheck.accepted === false) {
      showModal('error', 'ภาพของคุณถูกปฏิเสธ', (
        <>
          ภาพของคุณถูกปฏิเสธด้วยสาเหตุ<br />
          <b>[{idCheck.reason}]</b><br />
          กรุณาลองบันทึกภาพใหม่อีกครั้ง
        </>
      ))
    }
  }, [exam.isPromptIDCheck, idCheck.accepted])

  return (
    <Card className="text-center">
      <Title level={2} className="text-center">ยืนยันตัวบุคคล</Title>
      <p>
        กรุณาแสดงบัตรประจำตัวผู้เข้าสอบคู่กับใบหน้าของคุณ<br />
        เพื่อให้กรรมการคุมสอบตรวจและอนุมัติคุณเข้าสู่ห้องสอบ
      </p>
      <AuthenFaceCanvas
        loadModel={app.loadFaceModel}
        sendState={idCheck.sendState}
        setSendState={(state) => idCheck.setSendState(state)}
        onSubmitPhoto={(img) => idCheck.submit(img)}
      />
    </Card>
  )
}

export default observer(AuthenCard)
