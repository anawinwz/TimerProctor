import { useState } from 'react'
import { Drawer, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import TesterEventsTable from '~/components/admin/TesterEventsTable'

const TesterEventsDrawer = () => {
  const { ExamAdminStore: examAdmin } = useStore()

  const [visible, setVisible] = useState(false)

  const showDrawer = () => setVisible(true)
  const hideDrawer = () => setVisible(false)

  const drawerWidth = window?.innerWidth > 850 ? 800 : window.innerWidth - 50

  const testerEvents = examAdmin.testerEvents

  return (
    <>
      <Button type="default" onClick={showDrawer} icon={<ExclamationCircleOutlined />}>
        เหตุการณ์ทั้งหมด
      </Button>
      <Drawer
        title="เหตุการณ์ทั้งหมด"
        width={drawerWidth}
        placement="right"
        onClose={hideDrawer}
        visible={visible}
      >
        <TesterEventsTable
          events={testerEvents}
          withActor
        />
      </Drawer>
    </>
  )
}

export default observer(TesterEventsDrawer)
