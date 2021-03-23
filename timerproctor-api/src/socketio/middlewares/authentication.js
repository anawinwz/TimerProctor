import jwt from 'jsonwebtoken'
import { getExamIdFromSocket } from '../../utils/helpers'

import User from '../../models/user'
import Exam from '../../models/exam'
import Attempt from '../../models/attempt'
import Proctoring from '../../models/proctoring'

export const jwtAuthorize = (options = {}) => {
  options = Object.assign({}, options, {
    decodedPropertyName: 'decoded_token',
    encodedPropertyName: 'encoded_token'
  })

  if (typeof options.secret !== 'string') {
    throw new Error(`Invalid secret provided.`)
  }

  return (socket, next) => {
    const token = socket.handshake.auth?.token || ''

    if (!token || typeof token !== 'string') {
      return next(new Error('ไม่พบ Socket Token'))
    }

    socket.request[options.encodedPropertyName] = token

    jwt.verify(token, options.secret, (err, decoded) => {
      if (err) {
        return next(new Error('Token ไม่ถูกต้อง'))
      }
      
      socket.request[options.decodedPropertyName] = decoded
      next()
    })
  }
}

export const validateRole = async (socket, next) => {
  console.log('[socket.io] validate: execute start')

  const examId = getExamIdFromSocket(socket)
  socket.request.examId = examId

  const exam = await Exam.findById(examId, { owner: 1 })
  if (!exam) {
    return next(new Error('ไม่พบข้อมูลการสอบ'))
  }

  const { id, userId, role } = socket.request.decoded_token
  const user = await User.findById(userId, { _id: 1 })
  if (!user) {
    return next(new Error('ไม่พบข้อมูลผู้ใช้'))
  }
  socket.request.userId = userId
  
  const isExamOwner = String(userId) === String(exam.owner)
  socket.request.isExamOwner = isExamOwner
  if (!role || !['proctor', 'testtaker'].includes(role)) {
    return next(new Error('บทบาทผู้ใช้ไม่ถูกต้อง'))
  }
  
  if (role === 'testtaker') {
    const attempt = await Attempt.findById(id, { socketId: 1 })
    if (!attempt)
      return next(new Error('ไม่พบข้อมูลการเข้าสอบ'))
    
    socket.request.attempt = attempt
  } else if (role === 'proctor' && !isExamOwner) {
    const proctoring = await Proctoring.findOne({
      user: userId,
      exam: examId,
      status: 'accepted'
    }, { _id: 1, socketId: 1 })

    if (!proctoring) 
      return next(new Error('ไม่พบสถานะการเป็นกรรมการคุมสอบของคุณ'))
    
    socket.request.proctoring = proctoring
  }
  
  socket.request.role = role
  next()
}
