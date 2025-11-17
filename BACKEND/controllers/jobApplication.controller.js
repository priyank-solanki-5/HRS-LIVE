import * as jobApplicationService from '../services/jobApplication.services.js'

export const create = async (req, res) => {
  try {
    const payload = req.body || {}
    
    // Required fields validation
    const requiredFields = ['jobId', 'firstName', 'lastName', 'email', 'phone']
    const missingFields = requiredFields.filter(field => !payload[field])
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      })
    }
    
    const result = await jobApplicationService.createApplication(payload)
    return res.status(result.success ? 201 : 400).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const list = async (req, res) => {
  try {
    const filters = {
      jobId: req.query.jobId,
      status: req.query.status
    }
    const result = await jobApplicationService.listApplications(filters)
    return res.status(result.success ? 200 : 400).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const getOne = async (req, res) => {
  try {
    const result = await jobApplicationService.getApplication(req.params.id)
    return res.status(result.success ? 200 : 404).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const update = async (req, res) => {
  try {
    const result = await jobApplicationService.updateApplication(req.params.id, req.body)
    return res.status(result.success ? 200 : 404).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const remove = async (req, res) => {
  try {
    const result = await jobApplicationService.deleteApplication(req.params.id)
    return res.status(result.success ? 200 : 404).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

