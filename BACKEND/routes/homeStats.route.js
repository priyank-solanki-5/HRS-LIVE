import express from 'express'
import { getStats, updateStats } from '../controllers/homeStats.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getStats)
router.put('/', requireAdmin, updateStats)

export default router

