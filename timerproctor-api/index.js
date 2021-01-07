import http from 'http'
import { Server } from 'socket.io'
import socketioJwt from 'socketio-jwt'

import app from './app'
import routes from './routes'
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
  .on('connection', socketioJwt.authorize({
    secret: JWT_SOCKET_SECRET,
    timeout: 15000
  }))
  .on('authenticated', async socket => {
    const examId = getExamIdFromSocket(socket)
    const exam = await Exam.findById(examId)
    if (!exam) return socket.disconnect(true)

    const { userId, role } = socket.decode_token
    const user = await User.findById(userId)
    if (!user) return socket.disconnect(true)
    
    if (!role || ['proctor', 'testtaker'].includes(role)) return socket.disconnect(true)
    socket.join(role)

    console.log(`[socket.io] A ${role} ${userId} connected to ${examId}.`)
  })

app.locals.io = io
app.use('/', routes)

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
