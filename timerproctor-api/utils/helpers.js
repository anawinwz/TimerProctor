import WebSocket from 'ws'

export const jsonResponse = (status = 'ok', payload) => {
  if (!payload) return { status }
  if (typeof payload === 'string') return { status, message: payload }
  return { status, payload }
}

export const wsBroadcast = (app, data = {}, target = 'all') => {
  const clients = target === 'all' ? app.locals.wss.clients : app.locals[target]
  clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
