import mongoose from 'mongoose'

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true
  },
  photo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Parent = mongoose.model('Parent', parentSchema)

export default Parent

