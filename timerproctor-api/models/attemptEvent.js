import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    attempt: { type: Schema.Types.ObjectId, ref: 'Attempt' },
    timestamp: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['snapshot', 'noFaceDetected', 'tabSwitching']
    },
    info: {
      facesCount: Number
    },
    evidence: {
      type: { type: String, enum: ['photo'] },
      url: String
    }
  }
)

export default mongoose.model('AttemptEvent', schema)
