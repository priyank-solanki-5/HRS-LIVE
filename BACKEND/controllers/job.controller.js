import * as jobService from '../services/job.services.js'

export const createJob = async (req, res) => {
  try {
    const { title, employmentType, location, description, deadline, isActive } = req.body

    if (!title || !employmentType || !location || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, employment type, location, description, and deadline are required'
      })
    }

    const result = await jobService.createJob({
      title,
      employmentType,
      location,
      description,
      deadline,
      isActive: typeof isActive === 'boolean' ? isActive : true
    })

    if (result.success) {
      return res.status(201).json(result)
    }

    return res.status(400).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getPublicJobs = async (_req, res) => {
  try {
    const result = await jobService.getJobs({ includeInactive: false })
    if (result.success) {
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getAdminJobs = async (_req, res) => {
  try {
    const result = await jobService.getJobs({ includeInactive: true })
    if (result.success) {
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await jobService.getJobById(id)
    if (result.success) {
      return res.status(200).json(result)
    }
    return res.status(404).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const result = await jobService.updateJob(id, updateData)
    if (result.success) {
      return res.status(200).json(result)
    }
    return res.status(404).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params
    const result = await jobService.deleteJob(id)
    if (result.success) {
      return res.status(200).json(result)
    }
    return res.status(404).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}


