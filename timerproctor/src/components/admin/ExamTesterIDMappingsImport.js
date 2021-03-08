import { useState, useCallback } from 'react'
import { Modal, Button } from 'antd'
import { ImportOutlined } from '@ant-design/icons'

import ExcelImporter from './ExcelImporter'

const ExamTesterIDMappingsImport = () => {
  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  const onImport = useCallback((sheet = []) => {
    hideThisModal()
  }, [])

  return (
    <>
      <Button type="primary" icon={<ImportOutlined />} onClick={showThisModal}>นำเข้ารายชื่อ</Button>
      <Modal
        visible={visible}
        title="นำเข้ารายชื่อ"
        footer={null}
        onCancel={hideThisModal}
        maskClosable={false}
        destroyOnClose={true}
      >
        <ExcelImporter onImport={onImport} />
      </Modal>
    </>
  )
}

export default ExamTesterIDMappingsImport
