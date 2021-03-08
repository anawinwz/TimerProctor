import { useCallback } from 'react'
import { Upload } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'

const ExcelImporter = () => {
  const beforeUpload = useCallback(file => {
    return false
  }, [])

  return (
    <Upload.Dragger
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      multiple={false}
      beforeUpload={beforeUpload}
    >
      <p className="ant-upload-drag-icon">
        <FileExcelOutlined />
      </p>
      <p className="ant-upload-text">คลิกหรือลากไฟล์ Excel, CSV มาวางที่นี่เพื่อนำเข้า</p>
      <p className="ant-upload-hint">
        รองรับได้เพียง 1 ไฟล์เท่านั้น
      </p>
    </Upload.Dragger>
  )
}

export default ExcelImporter
