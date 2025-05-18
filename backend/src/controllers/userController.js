import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log('Registration attempt:', { name, email }) // Debug log

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    console.log('User created:', user) // Debug log

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error('Registration error:', error) // Debug log
    res.status(500).json({ message: 'Server error' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', email) // Debug log

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error('Login error:', error) // Debug log
    res.status(500).json({ message: 'Server error' })
  }
}