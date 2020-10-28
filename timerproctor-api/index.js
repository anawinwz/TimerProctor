  
import http from 'http'
import WebSocket from 'ws'

import app from './app'
import routes from './routes'

require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
wss.shouldHandle = (req) => {
  return false 
}

app.use((req, res, next) => {
  req.locals = {}
  req.locals.wss = wss
  next()
})
app.use('/', routes)


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
