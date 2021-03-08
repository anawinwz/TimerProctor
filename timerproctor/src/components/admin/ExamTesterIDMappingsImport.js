import { useState, useCallback } from 'react'
import { Modal, Button, Upload, message } from 'antd'
import { ImportOutlined, FileExcelOutlined } from '@ant-design/icons'

const ExamTesterIDMappingsImport = () => {
  const [visible, setVisible] = useState(false)
  const showThisModal = useCallback(() => setVisible(true), [])
  const hideThisModal = useCallback(() => setVisible(false), [])

  return (
    <>
      <Button type="primary" icon={<ImportOutlined />} onClick={showThisModal}>นำเข้ารายชื่อ</Button>
      <Modal
        visible={visible}
        title="นำเข้ารายชื่อ"
        footer={null}
        onCancel={hideThisModal}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Upload.Dragger
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          multiple={false}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined />
          </p>
          <p className="ant-upload-text">คลิกหรือลากไฟล์ Excel, CSV มาวางที่นี่เพื่อนำเข้า</p>
          <p className="ant-upload-hint">
            รองรับได้เพียง 1 ไฟล์เท่านั้น
          </p>
        </Upload.Dragger>
      </Modal>
    </>
  )
}

export default ExamTesterIDMappingsImport
