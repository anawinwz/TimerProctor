import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { List, Avatar, Form, Input, Button, Checkbox, message } from 'antd'
import { MailOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import ExamProctorsListLoading from './loading/ExamProctorsList'

const StyledForm = styled(Form)`
  margin-bottom: 10px;
  .ant-form-item {
    margin-bottom: 0px;
  }
`

const ExamProctorsList = ({ addable = true }) => {
  const { ExamAdminStore: examAdmin } = useStore()
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)

  useEffect(async () => {
    setLoading(true)

    try {
      await examAdmin?.getProctors()
      setLoading(false)
    } catch (err) {
      message.error(err.message)
    }
  }, [])

  const proctors = Object.entries(examAdmin.proctors)
  const inviteProctor = useCallback(async ({ email, notify = false }) => {
    setInviting(true)
    try {
      await examAdmin?.inviteProctor(email, notify)
    } catch (err) {
      message.error(err.message)
    } finally {
      setInviting(false)
    }
  }, [])

  if (loading) return <ExamProctorsListLoading addable={addable} />
  return <>
    {
      addable &&
      <StyledForm onFinish={inviteProctor}>
        <Form.Item name="email">
          <Input
            type="email"
            prefix={<MailOutlined />}
            placeholder="กรอกอีเมลบุคคลที่ต้องการเชิญ"
            disabled={inviting}
            suffix={
              <Button
                type="primary"
                htmlType="submit"
                disabled={inviting}
              >
                เชิญ
              </Button>
            }
          />
        </Form.Item>
        <Form.Item name="notify" valuePropName="checked">
          <Checkbox disabled={inviting}>ส่งอีเมลแจ้งเตือน</Checkbox>
        </Form.Item>
      </StyledForm>
    }
    <List
      grid={{ column: 2 }}
      dataSource={proctors}
      renderItem={([_id, proctor = {}]) => {
        const { info, email, status } = proctor
        return (
          <List.Item key={_id}>
            <List.Item.Meta
              avatar={<Avatar src={info?.photoURL} size="large" />}
              title={info?.displayName || email}
              description={status}
            />
          </List.Item>
        )
      }}
    />
  </>
}

export default observer(ExamProctorsList)
