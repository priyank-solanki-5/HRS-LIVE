import express from 'express'
import * as admissionController from '../controllers/admission.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public: submit application
router.post('/', admissionController.create)

// Admin: CRUD
router.get('/', requireAdmin, admissionController.list)
router.get('/:id', requireAdmin, admissionController.getOne)
router.put('/:id', requireAdmin, admissionController.update)
router.delete('/:id', requireAdmin, admissionController.remove)

export default router


