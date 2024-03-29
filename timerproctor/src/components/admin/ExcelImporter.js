import { useState, useCallback, useEffect, useMemo } from 'react'
import XLSX from 'xlsx'
import { Upload, Select, Table, Button, Checkbox, message } from 'antd'
import { FileExcelOutlined, TableOutlined } from '@ant-design/icons'
import Alert from '~/components/admin/Alert'

const ExcelImporter = ({ onImport = () => {} }) => {
  const [fileName, setFileName] = useState('')

  const [wb, setWb] = useState(null)
  const [sheetName, setSheetName] = useState('')
  const [hasHeader, setHasHeader] = useState(false)
  const [emailField, setEmailField] = useState(0)
  const [testerIdField, setTesterIdField] = useState(1)

  const beforeUpload = useCallback(file => {
    setFileName(file.name)

    const reader = new FileReader()
    const type = !!reader.readAsBinaryString ? 'binary' : 'array'
    reader.onload = e => {
      const fileInput = e.target.result
      try {
        const wb = XLSX.read(fileInput, { type: type })
        setWb(wb)
      } catch {
        message.error('ไม่สามารถอ่านไฟล์ดังกล่าวได้ กรุณาเลือกไฟล์อื่น')
      }
    }

    if (type === 'binary') reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file)

    return false
  }, [])

  useEffect(() => {
    if (wb?.SheetNames.length > 0) setSheetName(wb.SheetNames[0])
  }, [wb?.SheetNames])

  const onCheckHasHeader = useCallback(e => setHasHeader(e.target.checked), [])

  const sheet = useMemo(() => {
    if (wb && sheetName) {
      const ws = wb.Sheets[sheetName]
      const sheet = XLSX.utils.sheet_to_json(ws, { header: 1 })
      if (sheet.length > 0) {
        if (sheet.length === 1) setHasHeader(false)
        setEmailField(0)
        setTesterIdField(sheet[0].length >= 2 ? 1 : 0)
      } else {
        setEmailField(null)
        setTesterIdField(null)
      }
      return sheet
    }
    return []
  }, [wb, sheetName])

  const fieldOptions = useMemo(() => {
    if (sheet && sheet.length > 0) {
      let options = []
      for (let i = 0; i < sheet[0].length; i++) {
        options.push({
          value: i,
          label: `คอลัมน์ที่ ${i+1}`
        })
      }
      return options
    }
    return []
  }, [sheet])
  
  const filteredSheet = useMemo(() => 
    sheet.map(row => ({
      email: row[emailField],
      testerId: row[testerIdField]
    }))
    .filter(row => !!row.email || !!row.testerId)
    .slice(hasHeader ? 1 : 0),
    [sheet, hasHeader, emailField, testerIdField]
  )

  if (wb) {
    const sheetNamesOptions = wb.SheetNames.map(name => ({
      value: name,
      key: name,
      label: <><TableOutlined /> { name }</>
    }))

    const columns = [
      {
        title: <>
          อีเมล
          <Select
            className="d-block"
            value={emailField}
            options={fieldOptions}
            onChange={setEmailField}
            size="small"
          />
        </>,
        dataIndex: 'email',
        ellipsis: true
      },
      {
        title: <>
          รหัสประจำตัวผู้เข้าสอบ
          <Select
            className="d-block"
            value={testerIdField}
            options={fieldOptions}
            onChange={setTesterIdField}
            size="small"
          />
        </>,
        dataIndex: 'testerId',
        ellipsis: true
      }
    ]

    return (
      <>
        <div style={{ marginBottom: '10px' }}>
          <FileExcelOutlined /> {fileName}
          <Select
            className="w-100"
            placeholder={<><TableOutlined /> เลือกแผ่นเอกสาร</>}
            value={sheetName}
            options={sheetNamesOptions}
            onChange={setSheetName}
            allowClear
          />
        </div>
        { 
          sheet.length === 0 &&
          <Alert type="info" message={sheetName ? 'แผ่นนี้ไม่มีข้อมูล' : 'กรุณาเลือกแผ่นที่ต้องการ'} banner />
        }
        {
          sheet.length > 0 &&
          <>
            { sheet.length > 1 &&
              <Checkbox
                checked={hasHeader}
                onChange={onCheckHasHeader}
              >
                ตัดข้อมูลแถวแรก (ส่วนหัว) ออก
              </Checkbox>
            }
            { 
              emailField === testerIdField && 
              <Alert
                type="error"
                message="ช่อง [อีเมล] และ [รหัสประจำตัวฯ] ต้องเป็นคนละช่องกัน"
                banner
              />
            }
            <Table
              size="small"
              columns={columns}
              dataSource={filteredSheet}
              pagination={{ pageSize: 5 }}
            />
            <Button
              type="primary"
              block
              disabled={emailField === testerIdField}
              onClick={() => onImport(filteredSheet)}
            >
              นำเข้า
            </Button>
          </>
        }
      </>
    )
  }
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
