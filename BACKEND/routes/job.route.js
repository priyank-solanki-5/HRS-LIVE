import express from 'express'
import * as jobController from '../controllers/job.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', requireAdmin, jobController.createJob)

router.get('/admin', requireAdmin, jobController.getAdminJobs)

router.get('/', jobController.getPublicJobs)

router.get('/:id', jobController.getJobById)

router.put('/:id', requireAdmin, jobController.updateJob)

router.delete('/:id', requireAdmin, jobController.deleteJob)

export default router


