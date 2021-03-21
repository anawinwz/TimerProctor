import 'core-js/stable'
import 'regenerator-runtime/runtime'

import server from './index_http'
import io from './index_socketio'

import app from './app'
import routes from './routes'

require('dotenv-flow').config()

const PORT = process.env.PORT || 5000

app.locals.io = io
app.use('/', routes)

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
