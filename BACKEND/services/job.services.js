import Job from '../models/Job.model.js'

const parseDeadline = (deadline) => {
  if (!deadline) {
    return null
  }

  const parsed = new Date(deadline)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid deadline date provided')
  }
  return parsed
}

export const createJob = async (jobData) => {
  try {
    const payload = {
      ...jobData,
      deadline: parseDeadline(jobData.deadline)
    }

    const job = new Job(payload)
    const savedJob = await job.save()
    return {
      success: true,
      data: savedJob,
      message: 'Job created successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error creating job'
    }
  }
}

export const getJobs = async ({ includeInactive = false } = {}) => {
  try {
    const filter = includeInactive ? {} : { isActive: true }
    const jobs = await Job.find(filter).sort({ createdAt: -1 })
    return {
      success: true,
      data: jobs,
      message: 'Jobs retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving jobs'
    }
  }
}

export const getJobById = async (jobId) => {
  try {
    const job = await Job.findById(jobId)
    if (!job) {
      return {
        success: false,
        data: null,
        message: 'Job not found'
      }
    }
    return {
      success: true,
      data: job,
      message: 'Job retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving job'
    }
  }
}

export const updateJob = async (jobId, updateData) => {
  try {
    const payload = { ...updateData }
    if (Object.prototype.hasOwnProperty.call(updateData, 'deadline')) {
      payload.deadline = parseDeadline(updateData.deadline)
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { $set: payload },
      { new: true, runValidators: true }
    )

    if (!job) {
      return {
        success: false,
        data: null,
        message: 'Job not found'
      }
    }

    return {
      success: true,
      data: job,
      message: 'Job updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error updating job'
    }
  }
}

export const deleteJob = async (jobId) => {
  try {
    const job = await Job.findByIdAndDelete(jobId)
    if (!job) {
      return {
        success: false,
        data: null,
        message: 'Job not found'
      }
    }

    return {
      success: true,
      data: job,
      message: 'Job deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error deleting job'
    }
  }
}


