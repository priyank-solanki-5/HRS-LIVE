import express from 'express'
import * as jobApplicationController from '../controllers/jobApplication.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public route - anyone can apply
router.post('/', jobApplicationController.create)

// Admin routes - require authentication
router.get('/', requireAdmin, jobApplicationController.list)
router.get('/:id', requireAdmin, jobApplicationController.getOne)
router.put('/:id', requireAdmin, jobApplicationController.update)
router.delete('/:id', requireAdmin, jobApplicationController.remove)

export default router

