const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
// const UserModel = require('../models/users')
const logger = require('../utils/logger')

const mongod = new MongoMemoryServer()

module.exports.connect = async () => {
  console.log('db-handler')
  
  const uri = await mongod.getConnectionString()

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
  logger.info('connecting to test MongoDB')
  await mongoose.connect(uri, mongooseOpts)
    .then(() => {
      logger.info('connected to test MongoDB')
    })
}

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}

