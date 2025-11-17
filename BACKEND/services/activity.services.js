import Activity from '../models/Activity.model.js'

export const createActivity = async (payload) => {
  try {
    const activity = await Activity.create(payload)
    return {
      success: true,
      message: 'Activity created successfully',
      data: activity
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create activity'
    }
  }
}

export const getActivities = async ({ category }) => {
  try {
    const query = {}
    if (category) {
      query.category = category
    }
    const activities = await Activity.find(query).sort({ category: 1, order: 1, createdAt: -1 })
    return {
      success: true,
      data: activities
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch activities'
    }
  }
}

export const getActivityById = async (id) => {
  try {
    const activity = await Activity.findById(id)
    if (!activity) {
      return {
        success: false,
        message: 'Activity not found'
      }
    }

    return {
      success: true,
      data: activity
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch activity'
    }
  }
}

export const updateActivity = async (id, payload) => {
  try {
    const activity = await Activity.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    })

    if (!activity) {
      return {
        success: false,
        message: 'Activity not found'
      }
    }

    return {
      success: true,
      message: 'Activity updated successfully',
      data: activity
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update activity'
    }
  }
}

export const deleteActivity = async (id) => {
  try {
    const activity = await Activity.findByIdAndDelete(id)
    if (!activity) {
      return {
        success: false,
        message: 'Activity not found'
      }
    }

    return {
      success: true,
      message: 'Activity deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to delete activity'
    }
  }
}

export const reorderActivities = async (updates = []) => {
  const session = await Activity.startSession()
  session.startTransaction()

  try {
    for (const update of updates) {
      const { id, order } = update
      await Activity.findByIdAndUpdate(
        id,
        { order },
        { session }
      )
    }

    await session.commitTransaction()

    return {
      success: true,
      message: 'Activities reordered successfully'
    }
  } catch (error) {
    await session.abortTransaction()
    return {
      success: false,
      message: error.message || 'Failed to reorder activities'
    }
  } finally {
    session.endSession()
  }
}

