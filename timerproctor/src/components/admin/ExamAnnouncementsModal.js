import { useState, useCallback } from 'react'
import { Modal, Button, Input, Form, message } from 'antd'
import { NotificationOutlined, SendOutlined, CaretRightFilled } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { fetchAPIwithToken } from '~/utils/api'

const ExamAnnouncementsModal = () => {
  const { ExamStore: exam } = useStore()

  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  const [ form ] = Form.useForm()
  const sendAnnouncement = async ({ content }) => {
    try {
      const res = await fetchAPIwithToken(`/exams/${exam.id}/announcements`, { content: content })
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        form.resetFields()
      } else {
        throw new Error(msg || 'เกิดข้อผิดพลาดในการประกาศถึงผู้เข้าสอบ')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการประกาศถึงผู้เข้าสอบ')
    }
  }


  return (
    <>
      <Modal
        visible={visible}
        title="ประกาศถึงผู้เข้าสอบ"
        footer={null}
        onCancel={hideThisModal}
        destroyOnClose={true}
      >
        <Form
          form={form}
          preserve={false}
          onFinish={sendAnnouncement}
        >
          <Form.Item
            name="content"
            extra={<>
              หมายเหตุ:
              <ul>
                <li>ผู้เข้าสอบจะมองเห็นเฉพาะประกาศครั้งล่าสุดเท่านั้น</li>
                <li>ประกาศเดิมจะถูกล้างออก เมื่อสั่ง [<CaretRightFilled /> เริ่มการสอบ] ครั้งต่อไป</li>
              </ul>
            </>}
            rules={[{ required: true, message: 'กรุณากรอกเนื้อหาที่ต้องการส่งก่อน' }]}
          >
            <Input.TextArea placeholder="เนื้อหาประกาศ" showCount maxLength={255} />
          </Form.Item>
          <Form.Item>
            <Button
              icon={<SendOutlined />}
              type="primary"
              htmlType="submit"
              block
            >
              ส่ง
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button icon={<NotificationOutlined />} onClick={showThisModal}>ประกาศ</Button>
    </>
  )
}

export default observer(ExamAnnouncementsModal)
