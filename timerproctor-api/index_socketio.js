import { Server } from 'socket.io'
import server from './index_http'

import { JWT_SOCKET_SECRET } from './config'

import User from './models/user'
import Exam from './models/exam'
import Attempt from './models/attempt'
import AttemptEvent from './models/attemptEvent'
import Proctoring from './models/proctoring'

import { ioNamespace } from './utils/const'

import { authorize } from './utils/socketio-jwt'
import { getExamIdFromSocket, getExamNsp } from './utils/helpers'
import bindSocketListener from './socketio'

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

export default io

export const ioExam = io.of(ioNamespace)

ioExam.on('connection', authorize({
  required: true,
  secret: JWT_SOCKET_SECRET,
  timeout: 15000,
  decodedPropertyName: 'attempt',
  additional_auth: async (decoded, onSuccess, onError, socket) => {
    console.log('[socket.io] try to execute additional_auth')
    
    const examId = getExamIdFromSocket(socket)
    const exam = await Exam.findById(examId)
    if (!exam) {
      console.log(`Exam not found: ${examId}`)
      return onError({ message: 'ไม่พบห้องสอบ' }, 'exam_notfound')
    }

    const { id, userId, role } = decoded
    let user = await User.findById(userId)
    if (!user) {
      console.log(`User not found: ${userId}`)
      return onError({ message: 'ไม่พบข้อมูลผู้ใช้' }, 'user_notfound')
    }
    
    if (!role || !['proctor', 'testtaker'].includes(role)) {
      console.log(`Role incorrect: ${role}`)
      return onError({ message: 'บทบาทผู้ใช้ไม่ถูกต้อง' }, 'invalid_role')
    }
    
    if (role === 'testtaker') {
      const attempt = await Attempt.findById(id, { socketId: 1 })

      const oldSocketId = attempt.socketId
      const oldSocket = socket.nsp?.sockets?.[oldSocketId]
      if (oldSocket) oldSocket.disconnect(true)

      attempt.socketId = socket.id
      await attempt.save()
      
      const newEvent = new AttemptEvent({
        attempt: id,
        timestamp: Date.now(),
        type: 'socket',
        info: {
          socketEvent: {
            name: 'authorized'
          }
        }
      })
      newEvent.save((err, newEvent) => {
        if (err) return false
        
        let toSend = newEvent.toJSON()
        delete toSend._id
        delete toSend.attempt
  
        getExamNsp(examId).to('proctor').emit('newEvent', {
          id: id,
          event: toSend
        })
      })
    } else if (role === 'proctor') {
      if (String(userId) === String(exam.owner)) {
      } else {
        const proctoring = await Proctoring.findOne({
          user: userId,
          exam: examId,
          status: 'accepted'
        }, { socketId: 1 })

        if (!proctoring) 
          return onError({ message: 'ไม่พบสถานะการเป็นกรรมการคุมสอบของคุณ' }, 'no_proctoring')
        
        const oldSocketId = proctoring.socketId
        const oldSocket = socket.nsp?.sockets?.[oldSocketId]
        if (oldSocket) oldSocket.disconnect(true)

        proctoring.socketId = socket.id
        await proctoring.save()
      }
    }
    
    onSuccess()

    socket.attempt = decoded
    socket.join(role)
    
    bindSocketListener(socket, role, user)
    console.log(`[socket.io] A ${role} ${userId} connected to ${examId}.`)
  }
}))
