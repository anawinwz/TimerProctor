  
import http from 'http'
import WebSocket from 'ws'
import url from 'url'

import app from './app'
import routes from './routes'

require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.locals.testtakers = []
app.locals.proctors = []

wss.shouldHandle = (req) => {
  return true 
}
wss.on('connection', (ws, req) => {
  const path = url.parse(req.url).pathname
  if (path === '/testtaker') {
    app.locals.testtakers.push(ws)
    console.log(`[ws] A testtaker connected.`)
  } else if (path === '/proctor') {
    app.locals.proctors.push(ws)
    console.log(`[ws] A proctor connected.`)
  }
})
wss.on('close', (ws) => {
  for (const type of ['testtakers', 'proctors']) {
    const idx = app.locals[type].indexOf(ws)
    if (idx !== -1) {
      console.log(`[ws] A ${type} disconnected.`)
      app.locals[type].splice(idx, 1)
    }
  }
})

app.locals.users = {}
app.locals.wss = wss
app.use('/', routes)


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
