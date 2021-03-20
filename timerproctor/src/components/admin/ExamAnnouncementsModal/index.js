import { useState, useCallback } from 'react'
import { Modal, Tabs, Button, Tooltip } from 'antd'
import { NotificationOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons'

import { useStore } from '~/stores/admin'
import { observer } from 'mobx-react-lite'

import AnnouncementForm from './AnnouncementForm'
import AnnouncementsList from './AnnouncementsList'

const ExamAnnouncementsModal = () => {
  const { ExamAdminStore: examAdmin } = useStore()

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
        <Tabs
          defaultActiveKey={examAdmin.isExamOwner ? 'announce' : 'announcements'}
        >
          <Tabs.TabPane
            key="announce"
            tab={
              <Tooltip title="เฉพาะอาจารย์เจ้าของการสอบเท่านั้นที่สร้างประกาศได้">
                <PlusOutlined /> ประกาศใหม่
              </Tooltip>
            }
            disabled={!examAdmin.isExamOwner}
          >
            <AnnouncementForm />
          </Tabs.TabPane>
          <Tabs.TabPane
            key="announcements"
            tab={<><OrderedListOutlined /> รายการย้อนหลัง</>}
          >
            <AnnouncementsList />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Button icon={<NotificationOutlined />} onClick={showThisModal}>ประกาศ</Button>
    </>
  )
}

export default observer(ExamAnnouncementsModal)
