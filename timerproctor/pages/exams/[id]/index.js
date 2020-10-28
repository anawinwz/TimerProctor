import { Space } from 'antd'
import IntroCard from '../../../components/exams/IntroCard'
import IntroLogin from '../../../components/exams/IntroLogin'

const IntroPage = ({ error, examInfo }) => {
  if (error) return <></>
  return (
    <Space direction="vertical" size="large">
      <IntroCard examInfo={examInfo} />
      <IntroLogin loginMethods={examInfo?.authentication.loginMethods} />
    </Space>
  )
}

export async function getServerSideProps({ params: { id }, res}) {
  const examInfo = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${id}/info`)).json()

  if (!examInfo) {
    res.statusCode = 404
    return { 
      props: { error: 'ไม่พบการสอบดังกล่าว' }
    }
  }
  return {
    props: { examInfo }
  }
}

export default IntroPage
