import express from 'express'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import { app, server } from './socket/socket.js'

dotenv.config()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

server.listen(port, () => {
  connectDB()
  console.log(`Listening to port ${port}`)
})
