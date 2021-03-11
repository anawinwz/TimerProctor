import { useCallback } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'

import { useStore } from '~/stores/admin'
import { observer } from 'mobx-react-lite'

const DeleteButton = () => {
  const { ExamAdminStore: examAdmin } = useStore()

  const onDelete = useCallback(() => {
    Modal.confirm({
      title: `คุณแน่ใจหรือว่าต้องการลบรายชื่อทั้งหมด?`,
      content: `รายชื่อทั้งหมดจะถูกลบออก การดำเนินการนี้ไม่สามารถยกเลิกได้`,
      okText: 'ลบออก',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: () => {
        return examAdmin?.deleteTesterIdMappings()
          .catch(err => message.error(err.message))
      }
    })
  }, [examAdmin.deleteTesterIdMappings])

  return (
    <Button
      type="primary"
      danger
      icon={<DeleteOutlined />}
      onClick={onDelete}
      disabled={examAdmin?.testerIdMappings?.length === 0}
    >
      ลบทั้งหมด
    </Button>
  )
}

export default observer(DeleteButton)
