import mongoose from 'mongoose'

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log('Successfully connected to database')
  } catch (error) {
    console.log('Database connection failed : ', error.message)
  }
}

export default connectDB
