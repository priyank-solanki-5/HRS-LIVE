import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Activity category is required'],
      enum: ['curricular', 'co-curricular', 'extra-curricular'],
      lowercase: true,
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

activitySchema.index({ category: 1, order: 1 })

const Activity = mongoose.model('Activity', activitySchema)

export default Activity

