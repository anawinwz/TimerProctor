import { useState, useCallback } from 'react'
import { Row, Radio, Pagination } from 'antd'
import { CheckSquareOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons'

const ExamTesters = ({ status }) => {
  const [viewMode, setViewMode] = useState(status === 'authenticate' ? 'approve' : 'grid')
  const [currPage, setCurrPage] = useState(1)
  const changePage = useCallback(page => {
    setCurrPage(page)
  }, [setCurrPage])

  const changeViewMode = useCallback(e => {
    setViewMode(e.target.value)
  }, [setViewMode])

  return (
    <>
      <Row justify="center">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={viewMode}
          onChange={changeViewMode}
        >
          { 
            status === 'authenticate' && 
            <Radio.Button value="approve"><CheckSquareOutlined /> โหมดอนุมัติ (1 จอ)</Radio.Button>
          }
          <Radio.Button value="grid"><TableOutlined /> ตารางภาพ</Radio.Button>
          <Radio.Button value="list"><UnorderedListOutlined /> รายชื่อ</Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify="center">
        { status }
      </Row>
      { viewMode !== 'approve' &&
        <Row justify="center">
          <Pagination
            current={currPage}
            total={0}
            onChange={changePage}
          />
        </Row>
      }
    </>
  )
}

export default ExamTesters
