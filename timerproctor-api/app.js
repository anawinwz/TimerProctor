import express from 'express'
import mongoose from 'mongoose'

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('Please specify MongoDB URI.')
  process.exit(1)
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.on('error', err => {
  console.error('MongoDB Connection Error', err)
  process.exit(1)
})

const app = express()
app.use(express.json())
app.disable('etag')

export default app
