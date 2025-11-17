import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  date: {
    type: String,
    required: [true, 'Event date is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isHighlighted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const Event = mongoose.model('Event', eventSchema)

export default Event

