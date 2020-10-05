import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Card, Space,Button } from 'antd'
import { Google } from '../icons'

const IntroLogin = () => {
  const router = useRouter()
  const { id } = router.query

  const login = useCallback(() => {
    router.replace(`/exams/${id}/authenticate`)
  }, [router])

  return (
    <Card className="text-center">
      <p>โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      
      <Space direction="vertical">
        <Button onClick={login} block icon={<span className="anticon"><Google /></span>}>เข้าสู่ระบบด้วย Google</Button>
        <Button onClick={login} block>OpenID: Kasetsart University</Button>
      </Space>
    </Card>
  )
}

export default IntroLogin
