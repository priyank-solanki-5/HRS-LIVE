import * as adminService from '../services/admin.services.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }
    const result = await adminService.login({ email, password })
    if (!result.success) {
      return res.status(401).json(result)
    }
    
    // Set token in HTTP-only cookie (secure, not accessible via JavaScript)
    const token = result.data?.token
    if (token) {
      const isProduction = process.env.NODE_ENV === 'production'
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: isProduction, // Must be true in production for cross-origin
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      // Set a flag cookie for frontend to check auth status (not httpOnly so JS can read it)
      res.cookie('adminAuthed', 'true', {
        httpOnly: false,
        secure: isProduction, // Must be true in production for cross-origin
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
    }
    
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    })
    res.clearCookie('adminAuthed', {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    })
    return res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
  }
}

export const updateCredentials = async (req, res) => {
  try {
    const adminId = req.admin?.sub || req.admin?._id
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { email, password, currentPassword } = req.body

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message: 'Email or password must be provided'
      })
    }

    const result = await adminService.updateCredentials(adminId, {
      email,
      password,
      currentPassword
    })

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const adminId = req.admin?.sub || req.admin?._id
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const result = await adminService.getAdminById(adminId)
    
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(404).json(result)
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}


