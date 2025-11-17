import express from 'express'
import { requireAdmin } from '../middleware/auth.js'
import {
  createActivityHandler,
  getActivitiesHandler,
  getActivityByIdHandler,
  updateActivityHandler,
  deleteActivityHandler,
  reorderActivitiesHandler
} from '../controllers/activity.controller.js'

const router = express.Router()

router.post('/', requireAdmin, createActivityHandler)
router.get('/', getActivitiesHandler)
router.post('/reorder', requireAdmin, reorderActivitiesHandler)
router.get('/:id', getActivityByIdHandler)
router.put('/:id', requireAdmin, updateActivityHandler)
router.delete('/:id', requireAdmin, deleteActivityHandler)

export default router

