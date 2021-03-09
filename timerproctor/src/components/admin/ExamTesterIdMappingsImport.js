import { useState, useCallback } from 'react'
import { Modal, Button, message } from 'antd'
import { ImportOutlined } from '@ant-design/icons'

import { useStore } from '~/stores/admin'
import { observer } from 'mobx-react-lite'

import ExcelImporter from './ExcelImporter'

const ExamTesterIdMappingsImport = () => {
  const { ExamAdminStore: examAdmin } = useStore()

  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  const onImport = useCallback(async (sheet = []) => {
    try {
      await examAdmin?.importTesterIdMappings(sheet)
      hideThisModal()
    } catch (err) {
      message.error(err)
    }
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

export default observer(ExamTesterIdMappingsImport)
