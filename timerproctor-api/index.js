import http from 'http'
import { Server } from 'socket.io'
import { authorize } from '@thream/socketio-jwt'

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
  .use(authorize({
    secret: JWT_SOCKET_SECRET,
    timeout: 15000
  }))
  .on('connection', async socket => {
    const examId = getExamIdFromSocket(socket)
    const exam = await Exam.findById(examId)
    if (!exam) {
      console.log(`Exam not found: ${examId}`)
      return socket.disconnect(true)
    }

    const { userId, role } = socket.decodedToken
    const user = await User.findById(userId)
    if (!user) {
      console.log(`User not found: ${userId}`)
      return socket.disconnect(true)
    }
    
    if (!role || !['proctor', 'testtaker'].includes(role)) {
      console.log(`Role incorrect: ${role}`)
      return socket.disconnect(true)
    }
    socket.join(role)

    console.log(`[socket.io] A ${role} ${userId} connected to ${examId}.`)
  })

app.locals.io = io
app.use('/', routes)

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
