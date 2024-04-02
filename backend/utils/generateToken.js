import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '7d' })

  res.cookie('CHAT_SSID', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict'
  })
}

export default generateTokenAndSetCookie
