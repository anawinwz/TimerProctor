import http from 'http'
import { Server } from 'socket.io'
import { authorize } from './utils/socketio-jwt'

import app from './app'
import routes from './routes'
import User from './models/user'
import Exam from './models/exam'
import { ioNamespace } from './utils/const'
import { getExamIdFromSocket } from './utils/helpers'
import { JWT_SOCKET_SECRET } from './config'

require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.of(ioNamespace)
  .on('connection', authorize({
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
      
      onSuccess()

      socket.join(role)
      console.log(`[socket.io] A ${role} ${userId} connected to ${examId}.`)
    }
  }))

app.locals.io = io
app.use('/', routes)

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
