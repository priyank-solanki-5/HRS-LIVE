import mongoose from 'mongoose'

const jobApplicationSchema = new mongoose.Schema({
  // Job Reference
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // Personal Information
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pinCode: { type: String, trim: true },
  
  // Professional Information
  currentPosition: { type: String, trim: true },
  currentCompany: { type: String, trim: true },
  yearsOfExperience: { type: Number },
  education: { type: String, trim: true },
  skills: { type: String, trim: true },
  resume: { type: String, trim: true }, // URL or file path if file upload is implemented
  
  // Additional Information
  coverLetter: { type: String, trim: true },
  expectedSalary: { type: String, trim: true },
  availability: { type: String, trim: true },
  
  // Application Status
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'],
    default: 'Pending'
  },
  
  // Notes (for admin use)
  notes: { type: String, trim: true }
}, { timestamps: true })

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema)

export default JobApplication

