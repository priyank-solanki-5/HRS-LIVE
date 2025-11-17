import express from 'express'
import * as parentController from '../controllers/parent.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Create a new parent testimonial (admin only)
router.post('/', requireAdmin, parentController.createParent)

// Get all parent testimonials
router.get('/', parentController.getAllParents)

// Get a specific parent testimonial by ID
router.get('/:id', parentController.getParentById)

// Update a parent testimonial (admin only)
router.put('/:id', requireAdmin, parentController.updateParent)

// Delete a parent testimonial (admin only)
router.delete('/:id', requireAdmin, parentController.deleteParent)

export default router

