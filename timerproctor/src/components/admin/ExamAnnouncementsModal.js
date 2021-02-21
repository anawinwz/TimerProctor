import { useState, useCallback } from 'react'
import { Modal, Button, Input } from 'antd'
import { NotificationOutlined } from '@ant-design/icons'

const ExamAnnouncementsModal = () => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState('')
  
  const showModal = useCallback(() => setVisible(true), [])
  const hideModal = useCallback(() => {
    setContent('')
    setVisible(false)
  }, [])
  const onChange = useCallback(e => setContent(e.target.value), [])

  return (
    <>
      <Modal
        visible={visible}
        title="ประกาศถึงผู้เข้าสอบ"
        footer={null}
        onCancel={hideModal}
        destroyOnClose={true}
      >
        <Input.TextArea
          value={content}
          placeholder="เนื้อหาประกาศ"
          onChange={onChange}
        />
      </Modal>
      <Button icon={<NotificationOutlined />} onClick={showModal}>ประกาศ</Button>
    </>
  )
}

export default ExamAnnouncementsModal
