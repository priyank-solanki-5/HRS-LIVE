import express from 'express'
import * as eventController from '../controllers/event.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Create a new event (admin only)
router.post('/', requireAdmin, eventController.createEvent)

// Get all events
router.get('/', eventController.getAllEvents)

// Get highlighted events
router.get('/highlighted', eventController.getHighlightedEvents)

// Get a specific event by ID
router.get('/:id', eventController.getEventById)

// Update an event (admin only)
router.put('/:id', requireAdmin, eventController.updateEvent)

// Delete an event (admin only)
router.delete('/:id', requireAdmin, eventController.deleteEvent)

// Toggle highlight status (admin only)
router.patch('/:id/highlight', requireAdmin, eventController.toggleHighlight)

export default router

