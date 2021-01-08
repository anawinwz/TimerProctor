import { useCallback, useState, useMemo } from 'react'
import { Form, Divider, Radio, Checkbox, DatePicker, InputNumber, Switch, Input, Select, Button, Collapse } from 'antd'

import { observer } from 'mobx-react'
import { useStore } from '../../stores/admin'

import { timeWindowModes, loginMethods, idCheckModes } from '../../utils/const'
import { toOptions } from '../../utils/form'

const formLayout = { 
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const opt_timeWindowModes = toOptions(timeWindowModes)
const opt_loginMethods = toOptions(loginMethods)
const opt_idCheckModes = toOptions(idCheckModes)

const ExamSettingsForm = () => {
  const { ExamStore: exam } = useStore()
  const [toggles, setToggles] = useState({
    schedule: exam?.info?.timeWindow?.mode === 'schedule',
    needLogin: !(exam?.info?.authentication?.loginMethods?.length === 0)
  })

  const onValuesChange = useCallback(values => {
    let changes = {}
    
    const timeWindowMode = values?.timeWindow?.mode 
    if (timeWindowMode)
      changes.schedule = timeWindowMode === 'schedule'

    const methods = values?.authentication?.loginMethods.method
    if (methods) {
      changes.openid = methods.includes('openid')
      changes.needLogin = !(methods.length === 0)
    }

    setToggles(toggles => ({ ...toggles, ...changes }) )
  }, [])
  
  const initialLoginMethods = useMemo(() => {
    const loginMethods = exam?.info?.authentication?.loginMethods
    if (!loginMethods) return ['google']
    return loginMethods.map(item => item.method)
  }, [exam?.info?.authentication?.loginMethods])

  return (
    <Form
      {...formLayout}
      size="middle"
      initialValues={exam.info}
      onValuesChange={onValuesChange}
    >
      <Divider plain>ทั่วไป</Divider>
      <Form.Item label="วิธีกำหนดเวลาสอบ" name={['timeWindow', 'mode']} initialValue="schedule">
        <Radio.Group
          options={opt_timeWindowModes}
          optionType="button"
        />
      </Form.Item>
      { 
        toggles.schedule &&
        <>
          <Form.Item label="วัน-เวลาเริ่มการสอบ" name={['timeWindow', 'schedule', 'startDate']}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="วัน-เวลาสิ้นสุดการสอบ" name={['timeWindow', 'schedule', 'endDate']}>
            <DatePicker showTime />
          </Form.Item>
        </>
      }
      <Form.Item label="จำกัดเวลาทำ (นาที)" name={['timer', 'duration']} initialValue={50}>
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item label="แสดงนาฬิกาจับเวลา" name={['timer', 'isShow']} valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="คำชี้แจง" name={['desc']}>
        <Input.TextArea rows={3} />
      </Form.Item>

      <Divider plain>การยืนยันตนผู้เข้าสอบ</Divider>
      <Form.Item label="ต้องล็อกอินก่อน" name={['authentication', 'loginMethods', 'method']} initialValue={initialLoginMethods}>
        <Checkbox.Group
          options={opt_loginMethods}
        />
      </Form.Item>
      { 
        toggles.needLogin &&
        <Collapse style={{ marginBottom: '15px' }}>
          <Collapse.Panel header="ตั้งค่าล็อกอินทั่วไป" key="email">
            <Form.Item label="โดเมนอีเมลที่อนุญาต" name={['authentication', 'loginMethods', 'email', 'allowedDomains']} help="เช่น ku.th, ku.ac.th มีผลกับวิธี <อีเมล> และ <บัญชี Google>">
              <Select mode="tags" tokenSeparators={[',']} placeholder="ปล่อยว่างคือไม่จำกัด" maxTagCount={6} open={false} />
            </Form.Item>
          </Collapse.Panel>
        { 
          toggles.openid &&
          <Collapse.Panel header="ตั้งค่า OpenID" key="openid">
            <Form.Item label="Client ID" name={['authentication', 'loginMethods', 'openid', 'CLIENT_ID']}>
              <Input />
            </Form.Item>
            <Form.Item label="Client Secret" name={['authentication', 'loginMethods', 'openid', 'CLIENT_SECRET']}>
              <Input.Password />
            </Form.Item>
            <Form.Item label="User Scope" name={['authentication', 'loginMethods', 'openid', 'USER_SCOPE']}>
              <Input />
            </Form.Item>
          </Collapse.Panel>
        }
        </Collapse>
      }
      <Form.Item label="ตรวจสอบบัตรประจำตัว" name={['authentication', 'idCheckMode']} initialValue="prompt">
        <Radio.Group
          options={opt_idCheckModes}
          optionType="button"
        />
      </Form.Item>
      
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          บันทึกการตั้งค่า
        </Button>
      </Form.Item>
    </Form>
  )
}

export default observer(ExamSettingsForm)
