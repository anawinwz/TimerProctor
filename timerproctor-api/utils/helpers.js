import WebSocket from 'ws'

export const jsonResponse = (status = 'ok', message) => {
  if (!message) return { status }
  if (typeof message === 'string') return { status, message }
  return { status, ...message }
}

export const wsBroadcast = (app, data = {}, target = 'all') => {
  const clients = target === 'all' ? app.locals.wss.clients : app.locals[target]
  clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
