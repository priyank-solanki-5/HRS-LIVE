import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    trim: true,
    maxlength: [100, 'Employment type cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [120, 'Location cannot exceed 120 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Job = mongoose.model('Job', jobSchema)

export default Job


