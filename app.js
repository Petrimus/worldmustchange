const config = require('./utils/config')
const express = require('express')
const app = express()
const countryRouter = require('./controllers/countries')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('./utils/logger')


if (process.env.NODE_ENV !== 'test') {
  logger.info('connecting to MongoDB')
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connection to MongoDB:', error.message)
    })
} else if (process.env.NODE_ENV === 'test') {
  const { MongoMemoryServer } = require('mongodb-memory-server')
  
  logger.info('connecting to test MongoDB')
  const mongoServer = new MongoMemoryServer()
  

  mongoose.Promise = Promise
  mongoServer.getUri().then((mongoUri) => {
    const mongooseOpts = {      
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }    
    mongoose.connect(mongoUri, mongooseOpts)

    mongoose.connection.on('error', (e) => {
      if (e.message.code === 'ETIMEDOUT') {
        console.log(e)
        mongoose.connect(mongoUri, mongooseOpts)
      }
      console.log(e)
    })

    mongoose.connection.once('open', () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`)
    })
  })
}

app.use(bodyParser.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use('/api/countries', countryRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

