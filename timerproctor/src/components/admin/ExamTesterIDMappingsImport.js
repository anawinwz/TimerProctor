import { useState, useCallback } from 'react'
import { Modal, Button, Upload, Form, message } from 'antd'
import { ImportOutlined } from '@ant-design/icons'
const ExamTesterIDMappingsImport = () => {
  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  return (
    <>
      <Button type="primary" icon={<ImportOutlined />} onClick={showThisModal}>นำเข้ารายชื่อ</Button>
      <Modal
        visible={visible}
        title="นำเข้ารายชื่อ"
        footer={null}
        onCancel={hideThisModal}
        destroyOnClose={true}
      >
      </Modal>
    </>
  )
}

export default ExamTesterIDMappingsImport
