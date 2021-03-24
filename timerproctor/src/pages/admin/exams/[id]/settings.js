import { useEffect, useCallback } from 'react'
import { Button, message, Popconfirm, Skeleton, Tabs, Typography } from 'antd'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import useAppTitle from '~/hooks/useAppTitle'

import ContentBox from '~/components/admin/ContentBox'
import ErrorContentBox from '~/components/admin/ErrorContentBox'
import Alert from '~/components/admin/Alert'
import ExamTitle from '~/components/admin/ExamTitle'
import ExamSettingsForm from '~/components/admin/ExamSettingsForm'
import ExamProctorsList from '~/components/admin/ExamProctorsList'
import ExamTesterIdMappings from 'components/admin/ExamTesterIdMappings'
import { DeleteOutlined } from '@ant-design/icons'

const ExamSettings = () => {
  const { ExamStore: examStore, ExamAdminStore: examAdmin } = useStore()
  const { loading, error, info: exam } = examStore
  
  useAppTitle('ตั้งค่าการสอบ', { admin: true })

  useEffect(() => {
    examStore?.getInfo()
  }, [])

  const onEditName = useCallback(async name => {
    try {
      if (typeof name === 'string' && name.trim())
        await examAdmin?.editName(name.trim())
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนแปลงชื่อ')
    }
  }, [examAdmin])

  const isExamOwner = examAdmin.isExamOwner
  const isAutofillTesterId = exam?.linked?.settings?.autofill?.testerId || false
  
  if (loading) return <ContentBox><Skeleton /></ContentBox>
  else if (error) return <ErrorContentBox />
  return (
    <ContentBox>
      <ExamTitle exam={exam} editable={isExamOwner} onEdit={onEditName} />
      <Tabs defaultActiveKey="general">
        <Tabs.TabPane
          tab="ทั่วไป"
          key="general"
        >
          { !isExamOwner && <Alert showIcon type="info" message="มีเพียงอาจารย์เจ้าของการสอบเท่านั้นที่แก้ไขการตั้งค่าได้" /> }
          <ExamSettingsForm disabled={!isExamOwner} /> 
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="กรรมการคุมสอบ"
          key="proctors"
        >
          { !isExamOwner && <Alert showIcon type="info" message="มีเพียงอาจารย์เจ้าของการสอบเท่านั้นที่เชิญกรรมการเพิ่มได้" /> }
          <ExamProctorsList addable={isExamOwner} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="ผู้เข้าสอบ"
          key="testtakers"
        >
          {
            isExamOwner && 
            <>
              <Typography.Title level={5}>
                ลบข้อมูลผู้เข้าสอบทั้งหมด
              </Typography.Title>
              <Typography.Paragraph>
                ลบข้อมูลและเหตุการณ์ของผู้เข้าสอบทั้งหมด<br />
                หากผู้เข้าสอบยังอยู่ในระบบจะถูกเชิญออกอัตโนมัติ
              </Typography.Paragraph>
              <Popconfirm
                title="ยืนยันลบหรือไม่?"
                okText="ลบ"
                okType="danger"
                onConfirm={() => examAdmin.deleteAllTesters()}
              >
                <Button type="danger" size="large" icon={<DeleteOutlined />}>ลบข้อมูลผู้เข้าสอบทั้งหมด</Button>
              </Popconfirm>
            </>
          }
          <Typography.Title level={5}>
            รายชื่อผู้เข้าสอบที่รู้จัก
          </Typography.Title>
          <Typography.Paragraph>
            รายชื่อนี้สามารถใช้เพื่อจับคู่ [อีเมล] ของผู้เข้าสอบกับ [รหัสประจำตัวผู้เข้าสอบ] หรือข้อมูลอื่นใด<br />
            เพื่อให้ระบบเติมลงไปในชุดคำตอบของผู้เข้าสอบโดยอัตโนมัติได้
          </Typography.Paragraph>
          <Alert
            showIcon
            type={isAutofillTesterId ? 'success' : 'error'}
            message={<>
              [เติมรหัสประจำตัวผู้เข้าสอบอัตโนมัติ] <b>{isAutofillTesterId ? 'เปิดอยู่' : 'ปิดอยู่'}</b>
              { 
                isExamOwner &&
                <><br />สามารถเปิด/ปิดได้ที่ <b>ส่วนเสริม TimerProctor &gt; กำหนดค่าเพิ่มเติม</b> บนฟอร์มข้อสอบ</>
              }
            </>}
          />
          { !isExamOwner && <Alert showIcon type="info" message="มีเพียงอาจารย์เจ้าของการสอบเท่านั้นที่นำเข้า/ลบรายชื่อได้" /> }
          <ExamTesterIdMappings />
        </Tabs.TabPane>
      </Tabs>
    </ContentBox>
  )
}

export default observer(ExamSettings)
