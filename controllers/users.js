const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const UserModel = require('../models/users')
const jwt = require('jsonwebtoken')

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

userRouter.get('/', async (request, response, next) => {
  const token = getTokenFrom(request)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await UserModel.findById(decodedToken.id)
    response.json(user)
  } catch (exception) {
    next(exception)
  }
})

userRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    // console.log('body', body)
    if (body.password.length < 6) {
      throw new ValidationError('password length must be at least 6 digits long')
    }
    const pattern = new RegExp('.*[0-9].*')

    if (!pattern.test(body.password)) {
      throw new ValidationError('password has to have at least one number')
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new UserModel({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

userRouter.put('/favorites/', async (request, response, next) => {
  const body = request.body
  console.log('body', body)
  // console.log('request', request)
    
  const authorization = request.get('authorization')
  console.log('authorization ', authorization)
  
  const token = getTokenFrom(request)
  console.log('token ', token)
  
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await UserModel.findByIdAndUpdate(decodedToken.id,
      { $addToSet: { favorites: body.favorite } })
    // console.log('result', result)

    response.send(body.favorite)

  } catch (exception) {
    next(exception)
  }
})

userRouter.delete('/favorites/', async (request, response, next) => {
  const body = request.body
  const token = getTokenFrom(request)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const result = await UserModel.findByIdAndUpdate(decodedToken.id,
      { $pull: { favorites: body.favorite } })
      

    response.send(result)

  } catch (exception) {
    next(exception)
  }
})



module.exports = userRouter