import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Exam from '../models/exam'
import User from '../models/user'
import { jsonResponse, wsBroadcast } from '../utils/helpers'

const router = Router()

router.post('/create', async (req, res, next) => {
  try {
    const { token } = req.body
    const payload = jwt.verify(token, 'testaddons')
    if (!payload) {
      return jsonResponse('error', 'Access Denied.')
    }

    const { provider, id, ownerEmail, name, desc } = payload

    let ownerUser = await User.findOne({ email: ownerEmail })
    if (!ownerUser) {
      const newUser = new User({ email: ownerEmail })
      ownerUser = await newUser.save()
    }

    const newExam = new Exam({
      name,
      desc,
      owner: ownerUser._id,
      linked: {
        provider,
        id
      }
    })
    await newExam.save()
    
    return res.json(jsonResponse('success'))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการสร้างการสอบ'))
  }
  
})

router.get('/:id/info', async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
    if (!exam) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลการสอบดังกล่าว'))
    return res.json(exam)
  } catch {
    return res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/start', async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)

    if (!exam) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลการสอบดังกล่าว'))
    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'started')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งเริ่มการสอบนี้ได้'))
    
    wsBroadcast(req.app, { type: 'examStatus', payload: 'started' }, 'testtakers')
  
    exam.timeWindow.realtime.status = 'started'
    exam.timeWindow.realtime.startedAt = new Date()
    await exam.save()

    return res.json(jsonResponse('ok', 'สั่งเริ่มการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/stop', async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)

    if (!exam) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลการสอบดังกล่าว'))
    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'stopped')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งยุติการสอบนี้ได้'))

    wsBroadcast(req.app, { type: 'examStatus', payload: 'stopped' }, 'testtakers')
    
    exam.timeWindow.realtime.status = 'stopped'
    exam.timeWindow.realtime.stoppedAt = new Date()
    await exam.save()

    return res.json(jsonResponse('ok', 'สั่งยุติการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/update', async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)

    if (!exam) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลการสอบดังกล่าว'))
    Object.assign(exam, req.body)
    await exam.save()

    return res.json(jsonResponse('ok', 'อัปเดตข้อมูลการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/demo/annoucement', (req, res, next) => {
  const text = req.body?.text
  wsBroadcast(req.app, { type: 'examAnnoucement', payload: { text } }, 'testtakers')
  return res.json(jsonResponse('ok'))
})

router.get('/demo/create', async (req, res, next) => {
  const newExam = new Exam({
    name: 'ข้อสอบกลางภาค วิชา มนุษย์กับทะเล',
    desc: `เป็นข้อสอบปรนัย 3 ข้อ <br/>
    มีเวลาในการทำข้อสอบ 50 นาที<br/>
    โดยจะเริ่มจับเวลาพร้อมกันทุกคน ขอให้นิสิตเข้าสู่ห้องสอบโดยเร็ว`,
    timeWindow: {
      mode: 'realtime',
      realtime: {
        status: 'pending'
      }
    },
    timer: { duration: 50 },
    authentication: {
      loginMethods: [{ method: 'google' }]
    }
  })
  const exam = await newExam.save()
  res.json(jsonResponse('success', exam))
})

export default router
