export const jsonResponse = (status = 'ok', message = '') => ({ status, message })

export const wsBroadcast = (wss, data = {}) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
