import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_IN = '7d'

export const ensureDefaultAdmin = async (email, password) => {
  if (!email || !password) return
  const existing = await Admin.findOne({ email })
  if (existing) return
  const passwordHash = await bcrypt.hash(password, 10)
  await Admin.create({ email, passwordHash, name: 'Admin' })
}

export const login = async ({ email, password }) => {
  const admin = await Admin.findOne({ email })
  if (!admin) {
    return { success: false, message: 'Invalid credentials', data: null }
  }
  const ok = await bcrypt.compare(password, admin.passwordHash)
  if (!ok) {
    return { success: false, message: 'Invalid credentials', data: null }
  }
  const token = jwt.sign({ sub: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  return { success: true, message: 'Login successful', data: { token } }
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export const updateCredentials = async (adminId, { email, password, currentPassword }) => {
  try {
    const admin = await Admin.findById(adminId)
    if (!admin) {
      return {
        success: false,
        message: 'Admin not found',
        data: null
      }
    }

    // If password is being changed, verify current password
    if (password) {
      if (!currentPassword) {
        return {
          success: false,
          message: 'Current password is required to change password',
          data: null
        }
      }
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.passwordHash)
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect',
          data: null
        }
      }
      // Hash new password
      admin.passwordHash = await bcrypt.hash(password, 10)
    }

    // Update email if provided
    if (email && email !== admin.email) {
      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email })
      if (existingAdmin && existingAdmin._id.toString() !== adminId.toString()) {
        return {
          success: false,
          message: 'Email already in use',
          data: null
        }
      }
      admin.email = email.toLowerCase().trim()
    }

    await admin.save()

    return {
      success: true,
      message: 'Credentials updated successfully',
      data: {
        email: admin.email,
        name: admin.name
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error updating credentials',
      data: null
    }
  }
}

export const getAdminById = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId).select('-passwordHash')
    if (!admin) {
      return {
        success: false,
        message: 'Admin not found',
        data: null
      }
    }
    return {
      success: true,
      data: admin,
      message: 'Admin retrieved successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error retrieving admin',
      data: null
    }
  }
}


