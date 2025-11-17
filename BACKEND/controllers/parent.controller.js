import * as parentService from '../services/parent.services.js'

export const createParent = async (req, res) => {
  try {
    const { name, testimonial, photo } = req.body

    if (!name || !testimonial) {
      return res.status(400).json({
        success: false,
        message: 'Name and testimonial are required'
      })
    }

    const result = await parentService.createParent({
      name,
      testimonial,
      photo: photo || ''
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

export const getAllParents = async (req, res) => {
  try {
    const result = await parentService.getAllParents()
    
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

export const getParentById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await parentService.getParentById(id)
    
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

export const updateParent = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const result = await parentService.updateParent(id, updateData)
    
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

export const deleteParent = async (req, res) => {
  try {
    const { id } = req.params
    const result = await parentService.deleteParent(id)
    
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

