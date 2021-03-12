import { useState, useMemo, useCallback } from 'react'
import { Row, Radio, Pagination } from 'antd'
import { CheckSquareOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/admin'

import ApproveView from './views/approve'
import GridView from './views/grid'
import ListView from './views/list'

const gridDisabled = ['loggedin', 'authenticating', 'completed']

const ExamTesters = ({ status }) => {
  const { ExamAdminStore: examAdmin } = useStore()

  const [viewMode, setViewMode] = useState(status === 'authenticating' ? 'approve' : 
    (gridDisabled.includes(status) ? 'list' : 'grid')
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const isLoading = examAdmin?.loading || false
  const testers = Object.values(examAdmin.testers)

  const changePage = useCallback(page => {
    setPage(page)
  }, [])
  const changePageSize = useCallback((current, pageSize) => {
    setPageSize(pageSize)
  }, [])
  const changeViewMode = useCallback(e => {
    setViewMode(e.target.value)
  }, [])

  const filteredTesters = useMemo(() => {
    return (
      status === 'all' ? 
      testers : 
      testers.filter(tester => tester.status === status)
    )
  }, [testers, status])

  const pagedTesters = useMemo(() => {
    return filteredTesters.slice((page - 1) * pageSize, page * pageSize)
  }, [filteredTesters, page, pageSize])

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
            status === 'authenticating' && 
            <Radio.Button value="approve"><CheckSquareOutlined /> โหมดอนุมัติ (1 จอ)</Radio.Button>
          }
          {
            !gridDisabled.includes(status) &&
            <Radio.Button value="grid"><TableOutlined /> ตารางภาพ</Radio.Button>
          }
          <Radio.Button value="list"><UnorderedListOutlined /> รายชื่อ</Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify="center" gutter={4}>
        { viewMode === 'approve' && <ApproveView testers={pagedTesters} /> }
        { viewMode === 'grid' && <GridView pageSize={pageSize} testers={pagedTesters} noStatus={status !== 'all'} /> }
        { viewMode === 'list' && <ListView pageSize={pageSize} testers={pagedTesters} noDescription={status !== 'all'} /> }
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

export default observer(ExamTesters)
