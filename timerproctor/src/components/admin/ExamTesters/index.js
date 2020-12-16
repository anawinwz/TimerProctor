import { useState, useCallback, useMemo } from 'react'
import { Row, Radio, Pagination } from 'antd'
import { CheckSquareOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons'

import ApproveView from './views/approve'
import GridView from './views/grid'
import ListView from './views/list'
import { getTesters } from '../../../utils/demo'

const demoTesters = getTesters(16)

const ExamTesters = ({ status }) => {
  const [viewMode, setViewMode] = useState(status === 'authenticate' ? 'approve' : 'grid')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const changePage = useCallback(page => {
    setPage(page)
  }, [setPage])
  const changePageSize = useCallback((current, pageSize) => {
    setPageSize(pageSize)
  }, [setPageSize])

  const changeViewMode = useCallback(e => {
    setViewMode(e.target.value)
  }, [setViewMode])

  const testers = demoTesters
  const filteredTesters = useMemo(() => {
    if (status === 'all') return testers
    return testers.filter(tester => tester.status === status)
  }, [testers])
  const pagedTesters = filteredTesters.slice(0 + pageSize * (page - 1), 0 + pageSize * page) 

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
            status === 'authenticate' && 
            <Radio.Button value="approve"><CheckSquareOutlined /> โหมดอนุมัติ (1 จอ)</Radio.Button>
          }
          <Radio.Button value="grid"><TableOutlined /> ตารางภาพ</Radio.Button>
          <Radio.Button value="list"><UnorderedListOutlined /> รายชื่อ</Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify="center">
        { viewMode === 'approve' && <ApproveView testers={pagedTesters} /> }
        { viewMode === 'grid' && <GridView pageSize={pageSize} testers={pagedTesters} /> }
        { viewMode === 'list' && <ListView pageSize={pageSize} testers={pagedTesters} /> }
      </Row>
      { viewMode !== 'approve' &&
        <Row justify="center">
          <Pagination
            current={page}
            total={filteredTesters.length}
            onChange={changePage}
            showSizeChanger
            pageSize={pageSize}
            onShowSizeChange={changePageSize}
            pageSizeOptions={[6, 12, 16, 20, 24]}
          />
        </Row>
      }
    </>
  )
}

export default ExamTesters
