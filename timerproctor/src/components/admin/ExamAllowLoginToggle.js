import { useCallback, useState } from 'react'
import { Tooltip, Switch, message } from 'antd'
import { CloseOutlined, CheckOutlined, InfoCircleFilled } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import { fetchAPIwithToken } from '~/utils/api'

const ExamAllowLoginToggle = () => {
  const { ExamStore: exam } = useStore()

  const [loading, setLoading] = useState(false)
  const updateAllowLogin = useCallback(async allow => {
    try {
      setLoading(true)
      const res = await fetchAPIwithToken(`/exams/${exam?.id}/allowLogin`, { allow })
      const { status, message: msg } = res
      if (status === 'ok') {
        message.success(msg)
        exam.timeWindow.realtime.allowLogin = allow
        setLoading(false)
      } else {
        setLoading(false)
        throw new Error(msg || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
      }
    } catch (err) {
      setLoading(false)
      message.error(err.message || 'เกิดข้อผิดพลาดในการตั้งค่าสถานะการสอบ')
    }
  }, [exam?.id])

  const allowLogin = exam?.timeWindow?.realtime?.allowLogin || false
  return (
    <Tooltip placement="topLeft" title={exam.status === 'started' ? 'อนุญาตให้ผู้เข้าสอบเข้ามาในห้องสอบเพิ่มเติมได้อยู่' : 'อนุญาตให้ผู้เข้าสอบเข้าสู่ระบบมารอในห้องสอบก่อนเริ่มได้'}>
      <Switch
        loading={loading}
        checked={allowLogin}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        onChange={updateAllowLogin}
      />{' '}
      อนุญาตให้เข้าห้องสอบได้ <InfoCircleFilled />
    </Tooltip>
  )
}

export default observer(ExamAllowLoginToggle)