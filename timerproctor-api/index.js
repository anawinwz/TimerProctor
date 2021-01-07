import http from 'http'
import { Server } from 'socket.io'
import socketioJwt from 'socketio-jwt'

import app from './app'
import routes from './routes'
import Exam from './models/exam'
import { ioNamespace } from './utils/const'
import { getExamIdFromSocket } from './utils/helpers'

require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = http.createServer(app)
const io = new Server(server)

io.of(ioNamespace)
  .on('connection', socketioJwt.authorize({
    secret: 'testsocketio',
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
