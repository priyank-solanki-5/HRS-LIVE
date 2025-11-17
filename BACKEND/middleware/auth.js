import { verifyToken } from '../services/admin.services.js'

export const requireAdmin = (req, res, next) => {
  // Try to get token from cookie first, then from Authorization header
  let token = req.cookies?.adminToken || null
  
  if (!token) {
    const auth = req.headers.authorization || ''
    token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing token' })
  }
  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
  req.admin = payload
  next()
}


