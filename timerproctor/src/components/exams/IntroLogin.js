import { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Space, Button, message, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/stores/index'

import { APIFailedError } from '~/utils/api'
import { showModal } from '~/utils/modal'

import GoogleLoginButton from '~/components/buttons/GoogleLoginButton'

const IntroLogin = () => {
  const { ExamStore: exam, AuthStore: auth, AttemptStore: attempt } = useStore()
  const loginMethods = exam.info?.authentication?.login?.methods || []
  
  const history = useHistory()

  const removeEmailParams = useCallback(() => {
    const q = new URLSearchParams(history.location.search)
    q.delete('apiKey')
    q.delete('oobCode')
    q.delete('mode')
    q.delete('lang')
    history.replace({ search: q.toString() })
  }, [])

  const enterExam = useCallback(async result => {
    if (result === true) {
      try {
        await attempt.getAttempt()
        history.replace(`/exams/${exam.id}/authenticate`)
      } catch (err) {
        if (err instanceof APIFailedError) {
          showModal('error', 'ไม่สามารถขอเข้าสู่การสอบได้', err.message)
        } else {
          throw err
        }
      }
    } else if (result?.message) {
      showModal('info', 'ข้อความ', result.message, {
        onOk: result?.onOk || (() => {})
      })
    }
  }, [])

  useEffect(async () => {
    try {
      const result = await auth.doEmailCallback()
      removeEmailParams()
      await enterExam(result)
    } catch (err) {
      removeEmailParams()
      message.error(err.message)
    }
  }, [])
  
  const login = useCallback(async method => {
    try {
      const result = await auth.doAuthen(method)
      await enterExam(result)
    } catch (err) {
      message.error(err.message)
    }
  }, [enterExam])

  return (
    <Card className="text-center">
      {
        loginMethods.length > 0 ?
        <>
          <p>โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          <Spin spinning={auth.loggingIn} tip={auth.emailLoggingIn ? `กำลังเข้าสู่ระบบด้วยอีเมล ${auth.emailLoggingIn}...` : 'กำลังเข้าสู่ระบบ...'}>
            <Space direction="vertical">
              {loginMethods?.map(method => {
                const key = `login-${method}`
                switch (method) {
                  case 'google':
                    return (
                      <GoogleLoginButton
                        key={key}
                        onClick={() => login('google')}
                        disabled={auth.loggingIn}
                      />
                    )
                  case 'email':
                    return (
                      <Button
                        key={key}
                        onClick={() => login('email')}
                        disabled={auth.loggingIn}
                      >
                        เข้าสู่ระบบด้วยอีเมล
                      </Button>
                    )
                }
              })}
            </Space>
          </Spin>
        </> :
        <>
          อาจารย์ผู้สอนยังไม่ได้ระบุช่องทางการเข้าสู่ระบบ ไม่สามารถขอเข้าสู่การสอบได้
        </>
      }
    </Card>
  )
}

export default observer(IntroLogin)
