import { useState, useCallback } from 'react'
import { Modal, message } from 'antd'

import { useStore } from '~/stores/admin'
import { useObserver } from 'mobx-react-lite'

const ExamTesterTerminateModal = ({ testerId = '', testerName = '' }) => {
  const { ExamAdminStore } = useStore()
  const examAdmin = useObserver(() => ExamAdminStore)

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const show = useCallback(() => setVisible(true), [])
  const hide = useCallback(() => setVisible(false), [])
  const handleOk = () => {
    setLoading(true)
    return examAdmin.terminateTester(testerId)
      .then(hide)
      .catch(err => {
        message.error(err.message)
        setLoading(false)
      })
  }
  const handleCancel = hide

  return [
    show,
    hide,
    !visible ? <></> : <Modal
      type="confirm"
      visible={visible}
      title={`คุณแน่ใจหรือว่าต้องการเชิญ ${testerName} ออกจากการสอบ?`}
      okText="ยืนยันการเชิญออก"
      okType="danger"
      onOk={handleOk}
      confirmLoading={loading}
      cancelText="ยกเลิก"
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
    >
      การดำเนินการนี้ไม่สามารถยกเลิกได้
    </Modal>
  ]
}

export default ExamTesterTerminateModal
