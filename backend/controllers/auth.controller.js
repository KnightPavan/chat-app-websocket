import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body

    const user = await User.findOne({ userName: userName })

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    )

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid Username or Password' })
    }

    generateTokenAndSetCookie(user._id, res)

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log('Error in login controller', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password's do not match" })
    }

    const user = await User.findOne({ userName })
    if (user) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password, salt)

    const profilePic = `https://avatar.iran.liara.run/public/${
      gender === 'male' ? 'boy' : 'girl'
    }?username=${userName}`

    const newUser = new User({
      fullName,
      gender,
      password: hashPass,
      profilePic,
      userName
    })

    if (newUser) {
      await newUser.save()

      generateTokenAndSetCookie(newUser._id, res)

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic
      })
    } else {
      res.status(400).json({ error: 'Invalid User Data' })
    }
  } catch (error) {
    console.log('Error in signup controller', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
export const logout = (req, res) => {
  try {
    res.cookie('CHAT_SSID', '', { max: 0 })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error in logout controller', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
