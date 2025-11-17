import mongoose from 'mongoose'

const admissionSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  religion: { type: String, trim: true },
  caste: { type: String, trim: true },
  category: { type: String, required: true, enum: ['General', 'SC', 'ST', 'OBC', 'EWS'] },
  aadhaarNumber: { type: String, trim: true },
  
  // Contact Information
  mobileNumber: { type: String, required: true, trim: true },
  alternateMobileNumber: { type: String, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  
  // Address Information
  permanentAddress: { type: String, required: true, trim: true },
  correspondenceAddress: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pinCode: { type: String, required: true, trim: true },
  
  // Father's Information
  fatherName: { type: String, required: true, trim: true },
  fatherOccupation: { type: String, trim: true },
  fatherMobileNumber: { type: String, required: true, trim: true },
  
  // Mother's Information
  motherName: { type: String, required: true, trim: true },
  motherOccupation: { type: String, trim: true },
  motherMobileNumber: { type: String, required: true, trim: true },
  
  // Guardian Information (optional)
  guardianName: { type: String, trim: true },
  
  // Additional Information
  annualFamilyIncome: { type: String, trim: true },
  
  // Class Information
  className: { type: String, required: true, trim: true },
  
  // Legacy fields for backward compatibility
  address: { type: String, trim: true }
}, { timestamps: true })

const Admission = mongoose.model('Admission', admissionSchema)

export default Admission


