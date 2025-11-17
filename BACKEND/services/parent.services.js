import Parent from '../models/Parent.model.js'

export const createParent = async (parentData) => {
  try {
    const parent = new Parent(parentData)
    const savedParent = await parent.save()
    return {
      success: true,
      data: savedParent,
      message: 'Parent testimonial created successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error creating parent testimonial'
    }
  }
}

export const getAllParents = async () => {
  try {
    const parents = await Parent.find().sort({ createdAt: -1 })
    return {
      success: true,
      data: parents,
      message: 'Parent testimonials retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving parent testimonials'
    }
  }
}

export const getParentById = async (parentId) => {
  try {
    const parent = await Parent.findById(parentId)
    if (!parent) {
      return {
        success: false,
        data: null,
        message: 'Parent testimonial not found'
      }
    }
    return {
      success: true,
      data: parent,
      message: 'Parent testimonial retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving parent testimonial'
    }
  }
}

export const updateParent = async (parentId, updateData) => {
  try {
    const parent = await Parent.findByIdAndUpdate(
      parentId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    if (!parent) {
      return {
        success: false,
        data: null,
        message: 'Parent testimonial not found'
      }
    }
    return {
      success: true,
      data: parent,
      message: 'Parent testimonial updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error updating parent testimonial'
    }
  }
}

export const deleteParent = async (parentId) => {
  try {
    const parent = await Parent.findByIdAndDelete(parentId)
    if (!parent) {
      return {
        success: false,
        data: null,
        message: 'Parent testimonial not found'
      }
    }
    return {
      success: true,
      data: parent,
      message: 'Parent testimonial deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error deleting parent testimonial'
    }
  }
}

