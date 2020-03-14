const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UserModel = require('../models/users')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await UserModel.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // console.log('secret ', process.env.SECRET)

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, user })
})

module.exports = loginRouter