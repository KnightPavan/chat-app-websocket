import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.CHAT_SSID
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' })
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }
    const user = await User.findById(decoded.userId).select('-password')
    req.user = user

    next()
  } catch (error) {
    console.log('Error in protect route middleware', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default protectRoute
