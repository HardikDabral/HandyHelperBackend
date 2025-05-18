import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...')
    const conn = await mongoose.connect(process.env.MONGO_URI, {  // Changed from MONGODB_URI to MONGO_URI
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB