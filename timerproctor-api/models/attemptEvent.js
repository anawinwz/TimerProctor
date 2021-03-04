import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    attempt: { 
      type: Schema.Types.ObjectId,
      ref: 'Attempt',
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['snapshot', 'face', 'window'],
      required: true
    },
    info: {
      facesCount: Number,
      windowEvent: String,
      timeDiff: Number
    },
    evidence: {
      type: { type: String, enum: ['photo'] },
      url: String
    }
  }
)

export default mongoose.model('AttemptEvent', schema)
