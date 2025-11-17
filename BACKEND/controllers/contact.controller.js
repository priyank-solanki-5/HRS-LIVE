import * as contactService from '../services/contact.services.js'

export const createContact = async (req, res) => {
  try {
    const { name, email, mobileNumber, message } = req.body

    if (!name || !email || !mobileNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile number, and message are required'
      })
    }

    const result = await contactService.createContact({
      name,
      email,
      mobileNumber,
      message
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

export const getAllContacts = async (req, res) => {
  try {
    const result = await contactService.getAllContacts()
    
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

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await contactService.getContactById(id)
    
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

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const result = await contactService.updateContact(id, updateData)
    
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

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params
    const result = await contactService.deleteContact(id)
    
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

