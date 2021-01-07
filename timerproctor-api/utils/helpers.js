import WebSocket from 'ws'
import { ioNamespace } from './const'

export const jsonResponse = (status = 'ok', payload) => {
  if (!payload) return { status }
  if (typeof payload === 'string') return { status, message: payload }
  return { status, payload }
}

export const getExamIdFromSocket = socket => {
  const { name } = socket.nsp
  return name.match(ioNamespace)[1]
}

export const getExamNsp = (app, examId) => app.locals.io.of(`/exams/${examId}`)

export const wsBroadcast = (app, data = {}, target = 'all') => {
  const clients = target === 'all' ? app.locals.wss.clients : app.locals[target]
  clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
