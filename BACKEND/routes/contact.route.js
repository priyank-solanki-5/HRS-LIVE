import express from 'express'
import * as contactController from '../controllers/contact.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Create a new contact submission (public)
router.post('/', contactController.createContact)

// Get all contacts (admin only)
router.get('/', requireAdmin, contactController.getAllContacts)

// Get a specific contact by ID (admin only)
router.get('/:id', requireAdmin, contactController.getContactById)

// Update a contact (admin only)
router.put('/:id', requireAdmin, contactController.updateContact)

// Delete a contact (admin only)
router.delete('/:id', requireAdmin, contactController.deleteContact)

export default router

