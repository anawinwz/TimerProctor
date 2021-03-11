import { useState, useCallback } from 'react'
import { Modal, Button, message } from 'antd'
import { ImportOutlined } from '@ant-design/icons'

import { useStore } from '~/stores/admin'
import { observer } from 'mobx-react-lite'

import ExcelImporter from '~/components/admin/ExcelImporter'

const ImportModal = () => {
  const { ExamAdminStore: examAdmin } = useStore()

  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  const checkIfReplace = () => new Promise(resolve => {
    const oldMappings = examAdmin?.testerIdMappings
    if (!oldMappings?.length)
      return resolve(true)

    Modal.confirm({
      title: `คุณแน่ใจหรือว่าต้องการเขียนทับรายชื่อเดิม?`,
      content: `รายชื่อเดิมทั้ง ${oldMappings.length} ชื่อจะถูกลบและแทนที่ด้วยรายชื่อใหม่ การดำเนินการนี้ไม่สามารถยกเลิกได้`,
      okText: 'เขียนทับ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: () => resolve(true),
      onCancel: () => resolve(false)
    })
  })
  const onImport = useCallback(async (sheet = []) => {
    const actionConfirmed = await checkIfReplace()
    if (!actionConfirmed) return false
    
    try {
      await examAdmin?.importTesterIdMappings(sheet)
      hideThisModal()
    } catch (err) {
      message.error(err.message)
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

export default observer(ImportModal)
