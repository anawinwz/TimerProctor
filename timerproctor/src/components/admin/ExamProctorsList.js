import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { List, Avatar, Form, Input, Button, Checkbox } from 'antd'
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

  useEffect(async () => {
    setLoading(true)

    try {
      await examAdmin?.getProctors()
      setLoading(false)
    } catch {}
  }, [])

  const proctors = Object.entries(examAdmin.proctors)

  if (loading) return <ExamProctorsListLoading addable={addable} />
  return <>
    {
      addable &&
      <StyledForm>
        <Form.Item name="email">
          <Input
            type="email"
            prefix={<MailOutlined />}
            placeholder="กรอกอีเมลบุคคลที่ต้องการเชิญ"
            suffix={<Button type="primary" htmlType="submit">เชิญ</Button>}
          />
        </Form.Item>
        <Form.Item name="notify">
          <Checkbox>ส่งอีเมลแจ้งเตือน</Checkbox>
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
