import Admission from '../models/Admission.model.js'

export const createAdmission = async (payload) => {
  try {
    const doc = await Admission.create(payload)
    return { success: true, data: doc, message: 'Application submitted' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to submit' }
  }
}

export const listAdmissions = async () => {
  try {
    const list = await Admission.find().sort({ createdAt: -1 })
    return { success: true, data: list, message: 'OK' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to load' }
  }
}

export const getAdmission = async (id) => {
  try {
    const doc = await Admission.findById(id)
    if (!doc) return { success: false, data: null, message: 'Not found' }
    return { success: true, data: doc, message: 'OK' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to load' }
  }
}

export const updateAdmission = async (id, update) => {
  try {
    const doc = await Admission.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true })
    if (!doc) return { success: false, data: null, message: 'Not found' }
    return { success: true, data: doc, message: 'Updated' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to update' }
  }
}

export const deleteAdmission = async (id) => {
  try {
    const doc = await Admission.findByIdAndDelete(id)
    if (!doc) return { success: false, data: null, message: 'Not found' }
    return { success: true, data: doc, message: 'Deleted' }
  } catch (error) {
    return { success: false, data: null, message: error.message || 'Failed to delete' }
  }
}


