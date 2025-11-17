import * as eventService from '../services/event.services.js'

export const createEvent = async (req, res) => {
  try {
    const { title, date, description, image, isHighlighted } = req.body

    if (!title || !date || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, and description are required'
      })
    }

    const result = await eventService.createEvent({
      title,
      date,
      description,
      image: image || '',
      isHighlighted: isHighlighted || false
    })

    if (result.success) {
      return res.status(201).json(result)
    } else {
      return res.status(400).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEvents()
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await eventService.getEventById(id)
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(404).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const result = await eventService.updateEvent(id, updateData)
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(404).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const result = await eventService.deleteEvent(id)
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(404).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const toggleHighlight = async (req, res) => {
  try {
    const { id } = req.params
    const result = await eventService.toggleHighlight(id)
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(404).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getHighlightedEvents = async (req, res) => {
  try {
    const result = await eventService.getHighlightedEvents()
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

