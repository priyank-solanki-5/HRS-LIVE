import JobApplication from '../models/JobApplication.model.js'
import Job from '../models/Job.model.js'

export const createApplication = async (payload) => {
  try {
    // Verify job exists
    const job = await Job.findById(payload.jobId)
    if (!job) {
      return { success: false, data: null, message: 'Job not found' }
    }
    
    // Check if job is active
    if (!job.isActive) {
      return { success: false, data: null, message: 'This job posting is no longer active' }
    }
    
    // Check if deadline has passed
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return { success: false, data: null, message: 'Application deadline has passed' }
    }
    
    const application = await JobApplication.create(payload)
    return { success: true, data: application, message: 'Application submitted successfully' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to submit application' }
  }
}

export const listApplications = async (filters = {}) => {
  try {
    const query = {}
    if (filters.jobId) {
      query.jobId = filters.jobId
    }
    if (filters.status) {
      query.status = filters.status
    }
    
    const applications = await JobApplication.find(query)
      .populate('jobId', 'title employmentType location')
      .sort({ createdAt: -1 })
    
    return { success: true, data: applications, message: 'Applications retrieved successfully' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to retrieve applications' }
  }
}

export const getApplication = async (id) => {
  try {
    const application = await JobApplication.findById(id)
      .populate('jobId', 'title employmentType location description deadline')
    
    if (!application) {
      return { success: false, data: null, message: 'Application not found' }
    }
    
    return { success: true, data: application, message: 'Application retrieved successfully' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to retrieve application' }
  }
}

export const updateApplication = async (id, update) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate('jobId', 'title employmentType location')
    
    if (!application) {
      return { success: false, data: null, message: 'Application not found' }
    }
    
    return { success: true, data: application, message: 'Application updated successfully' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to update application' }
  }
}

export const deleteApplication = async (id) => {
  try {
    const application = await JobApplication.findByIdAndDelete(id)
    if (!application) {
      return { success: false, data: null, message: 'Application not found' }
    }
    return { success: true, data: application, message: 'Application deleted successfully' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to delete application' }
  }
}

