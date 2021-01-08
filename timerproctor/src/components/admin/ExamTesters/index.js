import { useState, useCallback, useEffect } from 'react'
import { Row, Radio, Pagination, message } from 'antd'
import { CheckSquareOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons'

import ApproveView from './views/approve'
import GridView from './views/grid'
import ListView from './views/list'
import { fetchAPIwithToken } from '../../../utils/api'

const ExamTesters = ({ status }) => {
  const [viewMode, setViewMode] = useState(status === 'authenticate' ? 'approve' : 'grid')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const [isLoading, setIsLoading] = useState(false)
  const [testers, setTesters] = useState([])

  const changePage = useCallback(page => {
    setPage(page)
  }, [])
  const changePageSize = useCallback((current, pageSize) => {
    setPageSize(pageSize)
  }, [])
  const changeViewMode = useCallback(e => {
    setViewMode(e.target.value)
  }, [])

  useEffect(async () => {
    setIsLoading(true)
    try {
      const res = await fetchAPIwithToken(`/exams/5f991c780953aa4110686e76/testers?status=${status}&page=${page}&pageSize=${pageSize}`)
      if (res.status === 'success') {
        setTesters(res.payload.testers)
        setIsLoading(false)
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหน้านี้')
      }
    } catch (err) {
      message.error(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหน้านี้')
    }
  }, [status, page, pageSize])

  return (
    <>
      <Row justify="center">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={viewMode}
          onChange={changeViewMode}
          style={{ marginBottom: '8px' }}
        >
          { 
            status === 'loggedin' && 
            <Radio.Button value="approve"><CheckSquareOutlined /> โหมดอนุมัติ (1 จอ)</Radio.Button>
          }
          <Radio.Button value="grid"><TableOutlined /> ตารางภาพ</Radio.Button>
          <Radio.Button value="list"><UnorderedListOutlined /> รายชื่อ</Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify="center" gutter={4}>
        { viewMode === 'approve' && <ApproveView testers={testers} /> }
        { viewMode === 'grid' && <GridView pageSize={pageSize} testers={testers} /> }
        { viewMode === 'list' && <ListView pageSize={pageSize} testers={testers} /> }
      </Row>
      { viewMode !== 'approve' &&
        <Row justify="center">
          <Pagination
            current={page}
            total={1}
            onChange={changePage}
            showSizeChanger
            pageSize={pageSize}
            onShowSizeChange={changePageSize}
            pageSizeOptions={[6, 12, 16, 20, 24]}
            disabled={isLoading}
          />
        </Row>
      }
    </>
  )
}

export default ExamTesters
