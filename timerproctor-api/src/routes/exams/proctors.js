import { Router } from 'express'

import { adminAuthen } from '../../middlewares/authentication'
import { onlyExamOwner, onlyExamPersonnel, populateExam } from '../../middlewares/exam'

import User from '../../models/user'
import Proctoring from '../../models/proctoring'

import { isEmail, jsonResponse } from '../../utils/helpers'
import { defaultMailOptions, sendMail } from '../../utils/mail'

const router = Router({ mergeParams: true })

router.get('/', adminAuthen, populateExam, onlyExamPersonnel, async (req, res) => {
  const { status: qStatus, socketId } = req.query
  if (
    (qStatus && !['all', 'invited', 'accepted', 'rejected'].includes(qStatus)) ||
    (typeof socketId !== 'undefined' && Number(socketId) !== 0 && Number(socketId) !== 1)
  )
    return res.json(jsonResponse('error', 'Invalid request.'))
  
  const exam = req.exam
  const user = req.user
  const isExamOwner = String(exam.owner) === String(user._id)
  try {  
    const results = await Proctoring.find(
      {
        exam: exam._id, 
        ...(qStatus && qStatus !== 'all' ? 
          { status: qStatus } :
          { status: { $nin: ['cancelled'] } }
        ),
        ...(Number(socketId) === 1 ?
          { 
            status: 'accepted',
            socketId: { $exists: true }
          } :
          {}
        )
      }, 
      {
        exam: 0,
        ...(isExamOwner ? {} : {
          invitedAt: 0,
          respondedAt: 0
        })
      }
    )
    .lean()
    .populate('user', '_id info email')

    const proctors = results.reduce((acc, proctor) => {
      const { _id, user = {}, status, socketId } = proctor
      if (status !== 'accepted')
        delete user.info
      
      return {
        ...acc,
        [_id]: {
          ...user,
          status,
          online: !!socketId,
          ...(isExamOwner ? { socketId } : {})
        }
      }
    }, {})

    return res.json(jsonResponse('ok', { proctors }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})
router.post('/', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
  const exam = req.exam
  const { email = '', notify = false } = req.body

  if (!email || !isEmail(email))
    return res.json(jsonResponse('failed', 'คุณยังไม่ได้กรอกอีเมล หรืออีเมลไม่ถูกรูปแบบ'))

  const sendProctorEmail = (callback = () => {}) => new Promise((resolve, reject) => {
    const { email: inviterEmail, info: { displayName } } = req.user
          
    const inviterEmailDomain = inviterEmail.split('@')[1].toLowerCase()
    const emailDomain = email.split('@')[1].toLowerCase()
    
    if (emailDomain !== inviterEmailDomain) {
      res.json(jsonResponse('ok', `เชิญโดยไม่มีเมลสำเร็จ (เพื่อความน่าเชื่อถือของระบบ อนุญาตให้ส่งแจ้งเตือนได้เฉพาะโดเมน ${inviterEmailDomain} เท่านั้น)`))

      callback()
      return resolve()
    }

    sendMail({
      ...defaultMailOptions,
      to: email,
      subject: '[TimerProctor] คำเชิญเป็นกรรมการคุมสอบ',
      html: `
        <p><i>- ข้อความนี้มาจากระบบที่เป็นส่วนหนึ่งของโครงงานฯ หากท่านได้รับความไม่สะดวก ต้องขออภัยมา ณ ที่นี้ -</i></p>

        <p>
          <b>${displayName ? `คุณ ${displayName}` : ''} [${inviterEmail}]</b> เชิญคุณมาร่วมเป็นกรรมการคุมสอบ <b>[${exam.name}]</b>
        </p>
        
        <ul>
          <li>หากต้องการตอบรับ/ปฏิเสธ สามารถทำได้ที่ <a href="https://timerproctor.anawinwz.me/admin">https://timerproctor.anawinwz.me/admin</a></li>
          <li>หากคุณได้รับอีเมลนี้อย่างไม่ถูกต้อง สามารถเพิกเฉยอีเมลนี้ได้ทันที (ผู้เชิญจะไม่สามารถส่งอีเมลซ้ำ้ได้อีก)</li>
        </ul>
      `
    }, (err, info) => {
      if (err) {
        callback(err)
        return reject(err)
      }

      callback(err, info)
      resolve(info)
    })
  })
  
  try {
    const results = await Proctoring.aggregate([
      { '$match': { exam: exam._id } },
      { '$project': { exam: 0 } },
      {
        '$lookup': {
          'from': 'users', 
          'localField': 'user', 
          'foreignField': '_id', 
          'as': 'user'
        }
      },
      { '$unwind': { 'path': '$user' } },
      {
        '$match': { 'user.email': email }
      }
    ])

    if (results.length > 0) {
      const proctor = results[0]
      const { status } = proctor

      if (['invited', 'accepted'].includes(status)) {
        return res.json(jsonResponse(
          'failed',
          status === 'invited' ?
            'คุณเคยเชิญบุคคลนี้ไปแล้ว แต่ยังไม่มีการตอบรับ/ปฏิเสธ' :
            'บุคคลนี้กำลังเป็นกรรมการคุมสอบอยู่แล้ว'
        ))
      } else {
        await Proctoring.updateOne({ _id: proctor._id }, {
          $set: {
            status: 'invited',
            invitedAt: Date.now(),
            respondedAt: undefined,
            cancelledAt: undefined
          }
        })

        if (notify) {
          return sendProctorEmail()
            .then(() => {
              res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] พร้อมอีเมลแจ้งเตือนอีกครั้งเรียบร้อยแล้ว`))
            })
            .catch(() => {
              res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] อีกครั้งเรียบร้อยแล้ว (การส่งเมลล้มเหลว)`))
            })
        } else {
          return res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] อีกครั้งเรียบร้อยแล้ว`))
        }
      }
    }
  } catch {
    return res.json(jsonResponse('failed', 'ไม่สามารถตรวจสอบสถานะของบุคคลนี้ได้'))
  }

  try {
    let proctorUser = await User.findOne({ email: email })
    if (!proctorUser) {
      const newUser = new User({ email: email })
      proctorUser = await newUser.save()
    } else if (String(proctorUser._id) === String(exam.owner)) {
      return res.json(jsonResponse('failed', 'ไม่สามารถเชิญอาจารย์เจ้าของการสอบเป็นกรรมการฯ ได้'))
    }

    const proctor = new Proctoring({
      exam: exam._id,
      user: proctorUser._id
    })
    await proctor.save()

    if (notify) {
      return sendProctorEmail()
        .then(() => {
          res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] พร้อมอีเมลแจ้งเตือนเรียบร้อยแล้ว`))
        })
        .catch(() => {
          res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] เรียบร้อยแล้ว (การส่งเมลล้มเหลว)`))
        })
    } else {
      return res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] ${notify ? 'พร้อมอีเมลแจ้งเตือน' : ''}เรียบร้อยแล้ว`))
    }
  } catch {
    return res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในการเชิญบุคคลนี้'))
  }
})

router.delete('/:proctorId', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
  const { proctorId } = req.params
  try {
    const proctoring = await Proctoring.findOne({
      _id: proctorId,
      exam: req.exam._id,
      status: { $in: ['invited', 'accepted'] }
    })

    if (!proctoring)
      return res.json(jsonResponse('failed', 'ไม่พบสิทธิ์การคุมสอบที่ต้องการยกเลิก'))
    
    proctoring.status = 'cancelled'
    proctoring.cancelledAt = Date.now()
    await proctoring.save()

    return res.json(jsonResponse('ok', 'ยกเลิกสิทธิ์การคุมสอบดังกล่าวเรียบร้อยแล้ว'))
  } catch {
    res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในระบบยกเลิกสิทธิ์คุมสอบ'))
  }
})

export default router
