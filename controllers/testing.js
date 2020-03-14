const testingRouter = require('express').Router()
const UserModel = require('../models/users')

testingRouter.post('/reset', async (request, response) => {
  await UserModel.deleteMany({})
  await UserModel.deleteMany({})

  response.status(204).end()
})

testingRouter.post('/newUser', async (request, response) => {
  const body = request.body

  try {
    await UserModel.save(body.user)

    response.status(204).end()
  } catch (exception) {
    console.log('failed')

  }
})

module.exports = testingRouter