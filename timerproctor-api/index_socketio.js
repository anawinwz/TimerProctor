import { Server } from 'socket.io'
import server from './index_http'

import { JWT_SOCKET_SECRET } from './config'

import User from './models/user'
import Exam from './models/exam'

import { ioNamespace } from './utils/const'

import { authorize } from './utils/socketio-jwt'
import { getExamIdFromSocket } from './utils/helpers'
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
  secret: JWT_SOCKET_SECRET,
  timeout: 15000,
  additional_auth: async (decoded, onSuccess, onError, socket) => {
    const examId = getExamIdFromSocket(socket)
    const exam = await Exam.findById(examId)
    if (!exam) {
      console.log(`Exam not found: ${examId}`)
      return onError({ message: 'ไม่พบห้องสอบ' }, 'exam_notfound')
    }

    const { userId, role } = decoded
    const user = await User.findById(userId)
    if (!user) {
      console.log(`User not found: ${userId}`)
      return onError({ message: 'ไม่พบข้อมูลผู้ใช้' }, 'user_notfound')
    }
    
    if (!role || !['proctor', 'testtaker'].includes(role)) {
      console.log(`Role incorrect: ${role}`)
      return onError({ message: 'บทบาทผู้ใช้ไม่ถูกต้อง' }, 'invalid_role')
    }
    
    if (user.socketId) {
      const oldSocketId = user.socketId
      const oldSocket = socket.nsp?.sockets?.[oldSocketId]
      if (oldSocket) oldSocket.disconnect(true)
    }

    user.socketId = socket.id
    user = await user.save()
    onSuccess()

    socket.join(role)
    
    bindSocketListener(socket, role, user)
    console.log(`[socket.io] A ${role} ${userId} connected to ${examId}.`)
  }
}))
