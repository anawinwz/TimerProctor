import { Skeleton } from 'antd'
import ContentBox from '../ContentBox'

const ExamOverviewLoading = () => (
  <ContentBox style={{ minHeight: '75vh' }}>
    <Skeleton
      title={{ size: 'large' }}
      paragraph={{ rows: 1 }}
      butt
      active
    />
    <Skeleton.Button active style={{ width: '150px', marginBottom: '20px' }} />
    <Skeleton title={false} paragraph={{ rows: 3 }} active />
  </ContentBox>
)

export default ExamOverviewLoading
