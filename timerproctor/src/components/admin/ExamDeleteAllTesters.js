import { useCallback, useState } from 'react'
import { Button, Popconfirm, Typography, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

const ExamDeleteAllTesters = () => {
  const { ExamAdminStore: examAdmin } = useStore()

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const onClick = useCallback(() => {
    setVisible(prev => !prev)
  })

  const onConfirm = useCallback(() => {
    setLoading(true)
    
    examAdmin.deleteAllTesters()
      .then(() => setVisible(false))
      .catch(() => message.error('เกิดข้อผิดพลาดในการลบ'))
      .finally(() => setLoading(false))
  })

  const onCancel = useCallback(() => {
    setLoading(false)
    setVisible(false)
  })

  return (
    <>
      <Typography.Title level={5}>
        ลบข้อมูลผู้เข้าสอบทั้งหมด
      </Typography.Title>
      <Typography.Paragraph>
        ลบข้อมูลและเหตุการณ์ของผู้เข้าสอบทั้งหมด<br />
        หากผู้เข้าสอบยังอยู่ในระบบจะถูกเชิญออกอัตโนมัติ
      </Typography.Paragraph>
      <Popconfirm
        visible={visible}
        title="ยืนยันลบหรือไม่?"
        okText="ลบ"
        okType="danger"
        onConfirm={onConfirm}
        okButtonProps={{ loading: loading }}
        onCancel={onCancel}
      >
        <Button type="danger" size="large" icon={<DeleteOutlined />} onClick={onClick}>
          ลบข้อมูลผู้เข้าสอบทั้งหมด
        </Button>
      </Popconfirm>
    </>
  )
}

export default observer(ExamDeleteAllTesters)
