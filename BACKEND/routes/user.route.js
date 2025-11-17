import express from 'express'
import { GetUsersData } from '../controllers/user.controller.js'
const router = express.Router()

router.get('/', GetUsersData)

export default router