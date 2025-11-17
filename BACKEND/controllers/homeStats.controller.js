import * as homeStatsService from '../services/homeStats.services.js'

export const getStats = async (req, res) => {
  try {
    const result = await homeStatsService.getStats()
    if (!result.success) {
      return res.status(500).json(result)
    }
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const updateStats = async (req, res) => {
  try {
    const { years, teachers, students } = req.body || {}
    if (!years || !teachers || !students) {
      return res.status(400).json({ success: false, message: 'Years, teachers, and students are required' })
    }
    const result = await homeStatsService.updateStats({ years, teachers, students })
    if (!result.success) {
      return res.status(500).json(result)
    }
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

