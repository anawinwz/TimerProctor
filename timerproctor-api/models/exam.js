import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    name: String,
    desc: String,
    owner: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    timeWindow: {
      mode: { type: String, enum: ['realtime', 'schedule'] },
      realtime: {
        status: { type: String, enum: ['pending', 'started', 'stopped']},
        startedAt: Date,
        stoppedAt: Date
      },
      schedule: {
        startDate: Date,
        endDate: Date
      }
    },
    timer: {
      isShow: { type: Boolean, default: true },
      duration: { type: Number, default: 0 },
    },
    authentication: {
      loginMethods: [
        { 
          method: { type: String, enum: ['google', 'openid', 'email'] }
        }
      ],
      idCheckMode: { type: String, enum: ['none', 'prompt', 'post'], default: 'prompt' }
    }
  }
)

export default mongoose.model('Exam', schema)