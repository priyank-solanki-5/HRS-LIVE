import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  reorderActivities
} from '../services/activity.services.js'

const normalizeCategory = (value) => {
  if (!value) return value
  return value.toLowerCase()
}

export const createActivityHandler = async (req, res) => {
  try {
    const { title, description, category, image, order, isVisible } = req.body

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description and category are required'
      })
    }

    const payload = {
      title,
      description,
      category: normalizeCategory(category),
      image: image || '',
      order: typeof order === 'number' ? order : 0,
      isVisible: typeof isVisible === 'boolean' ? isVisible : true
    }

    const result = await createActivity(payload)

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(201).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getActivitiesHandler = async (req, res) => {
  try {
    const { category } = req.query
    const result = await getActivities({
      category: normalizeCategory(category)
    })

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getActivityByIdHandler = async (req, res) => {
  try {
    const { id } = req.params
    const result = await getActivityById(id)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const updateActivityHandler = async (req, res) => {
  try {
    const { id } = req.params
    const { category, ...rest } = req.body
    const payload = { ...rest }

    if (category) {
      payload.category = normalizeCategory(category)
    }

    const result = await updateActivity(id, payload)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const deleteActivityHandler = async (req, res) => {
  try {
    const { id } = req.params
    const result = await deleteActivity(id)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const reorderActivitiesHandler = async (req, res) => {
  try {
    const { updates } = req.body

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates must be a non-empty array'
      })
    }

    const result = await reorderActivities(updates)

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

