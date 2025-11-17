import express from 'express'
import { login, logout, updateCredentials, getProfile } from '../controllers/admin.controller.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', requireAdmin, logout)
router.get('/profile', requireAdmin, getProfile)
router.put('/credentials', requireAdmin, updateCredentials)

export default router


