import Event from '../models/Event.model.js'

export const createEvent = async (eventData) => {
  try {
    const event = new Event(eventData)
    const savedEvent = await event.save()
    return {
      success: true,
      data: savedEvent,
      message: 'Event created successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error creating event'
    }
  }
}

export const getAllEvents = async () => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    return {
      success: true,
      data: events,
      message: 'Events retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving events'
    }
  }
}

export const getEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return {
        success: false,
        data: null,
        message: 'Event not found'
      }
    }
    return {
      success: true,
      data: event,
      message: 'Event retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving event'
    }
  }
}

export const updateEvent = async (eventId, updateData) => {
  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    if (!event) {
      return {
        success: false,
        data: null,
        message: 'Event not found'
      }
    }
    return {
      success: true,
      data: event,
      message: 'Event updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error updating event'
    }
  }
}

export const deleteEvent = async (eventId) => {
  try {
    const event = await Event.findByIdAndDelete(eventId)
    if (!event) {
      return {
        success: false,
        data: null,
        message: 'Event not found'
      }
    }
    return {
      success: true,
      data: event,
      message: 'Event deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error deleting event'
    }
  }
}

export const toggleHighlight = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return {
        success: false,
        data: null,
        message: 'Event not found'
      }
    }
    event.isHighlighted = !event.isHighlighted
    const updatedEvent = await event.save()
    return {
      success: true,
      data: updatedEvent,
      message: `Event ${updatedEvent.isHighlighted ? 'highlighted' : 'unhighlighted'} successfully`
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error toggling highlight'
    }
  }
}

export const getHighlightedEvents = async () => {
  try {
    const events = await Event.find({ isHighlighted: true }).sort({ createdAt: -1 })
    return {
      success: true,
      data: events,
      message: 'Highlighted events retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error retrieving highlighted events'
    }
  }
}

