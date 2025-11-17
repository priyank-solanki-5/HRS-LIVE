import Contact from '../models/Contact.model.js'

export const createContact = async (contactData) => {
  try {
    const contact = new Contact(contactData)
    const savedContact = await contact.save()
    return {
      success: true,
      data: savedContact,
      message: 'Contact form submitted successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error submitting contact form'
    }
  }
}

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    return {
      success: true,
      data: contacts,
      message: 'Contacts retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving contacts'
    }
  }
}

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId)
    if (!contact) {
      return {
        success: false,
        data: null,
        message: 'Contact not found'
      }
    }
    return {
      success: true,
      data: contact,
      message: 'Contact retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving contact'
    }
  }
}

export const updateContact = async (contactId, updateData) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    if (!contact) {
      return {
        success: false,
        data: null,
        message: 'Contact not found'
      }
    }
    return {
      success: true,
      data: contact,
      message: 'Contact updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error updating contact'
    }
  }
}

export const deleteContact = async (contactId) => {
  try {
    const contact = await Contact.findByIdAndDelete(contactId)
    if (!contact) {
      return {
        success: false,
        data: null,
        message: 'Contact not found'
      }
    }
    return {
      success: true,
      data: contact,
      message: 'Contact deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error deleting contact'
    }
  }
}

