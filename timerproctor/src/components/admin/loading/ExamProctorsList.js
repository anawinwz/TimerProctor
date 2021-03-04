import { Skeleton } from 'antd'
const ExamProctorsListLoading = ({ addable = false }) => (
  <>
    { 
      addable && 
      <Skeleton.Input
        active
        style={{
          width: '200px',
          marginBottom: '10px'
        }}
        size="large"
      />
    }
    <Skeleton avatar active paragraph={{ rows: 0 }} />
    <Skeleton avatar active paragraph={{ rows: 0 }} />
    <Skeleton avatar active paragraph={{ rows: 0 }} />
  </>
)

export default ExamProctorsListLoading
