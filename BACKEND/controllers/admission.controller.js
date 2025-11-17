import * as admissionService from '../services/admission.services.js'

export const create = async (req, res) => {
  try {
    const payload = req.body || {}
    
    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'gender', 'dateOfBirth', 'age', 'category',
      'className', 'mobileNumber', 'email', 'permanentAddress', 'city', 'state', 'pinCode',
      'fatherName', 'fatherMobileNumber', 'motherName', 'motherMobileNumber'
    ]
    
    const missingFields = requiredFields.filter(field => !payload[field])
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      })
    }
    
    // Calculate age from date of birth if not provided
    if (payload.dateOfBirth && !payload.age) {
      const dob = new Date(payload.dateOfBirth)
      const today = new Date()
      payload.age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        payload.age--
      }
    }
    
    const result = await admissionService.createAdmission(payload)
    return res.status(result.success ? 201 : 400).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const list = async (_req, res) => {
  const result = await admissionService.listAdmissions()
  return res.status(result.success ? 200 : 400).json(result)
}

export const getOne = async (req, res) => {
  const result = await admissionService.getAdmission(req.params.id)
  return res.status(result.success ? 200 : 404).json(result)
}

export const update = async (req, res) => {
  const result = await admissionService.updateAdmission(req.params.id, req.body)
  return res.status(result.success ? 200 : 404).json(result)
}

export const remove = async (req, res) => {
  const result = await admissionService.deleteAdmission(req.params.id)
  return res.status(result.success ? 200 : 404).json(result)
}


