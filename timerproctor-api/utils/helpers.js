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
