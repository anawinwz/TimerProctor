import { useState, useCallback } from 'react'
import { Modal, Tabs, Button } from 'antd'
import { NotificationOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons'

import AnnouncementForm from './AnnouncementForm'

const ExamAnnouncementsModal = () => {
  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  return (
    <>
      <Modal
        visible={visible}
        title="ประกาศถึงผู้เข้าสอบ"
        footer={null}
        onCancel={hideThisModal}
        destroyOnClose={true}
      >
        <Tabs>
          <Tabs.TabPane
            key="announce"
            tab={<><PlusOutlined /> ประกาศใหม่</>}
          >
            <AnnouncementForm />
          </Tabs.TabPane>
          <Tabs.TabPane
            key="announcements"
            tab={<><OrderedListOutlined /> รายการย้อนหลัง</>}
          >
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Button icon={<NotificationOutlined />} onClick={showThisModal}>ประกาศ</Button>
    </>
  )
}

export default ExamAnnouncementsModal
