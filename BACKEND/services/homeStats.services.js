import HomeStats from '../models/HomeStats.model.js'

export const getStats = async () => {
  try {
    const stats = await HomeStats.getStats()
    return { success: true, data: stats, message: 'Stats retrieved successfully' }
  } catch (err) {
    return { success: false, data: null, message: err.message || 'Failed to retrieve stats' }
  }
}

export const updateStats = async ({ years, teachers, students }) => {
  try {
    let stats = await HomeStats.findOne()
    if (!stats) {
      stats = await HomeStats.create({ years, teachers, students })
    } else {
      stats.years = years
      stats.teachers = teachers
      stats.students = students
      await stats.save()
    }
    return { success: true, data: stats, message: 'Stats updated successfully' }
  } catch (err) {
    return { success: false, data: null, message: err.message || 'Failed to update stats' }
  }
}

