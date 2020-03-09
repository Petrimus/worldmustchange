const UserModel = require('../models/users')


const initialUsers = [
  {
    username: 'testertest',
    name: 'Test Tester',
    password: 'Tester1'
  },
  {
    username: 'doejoe',
    name: 'John Doe',
    password: 'johndoe2'
  },  
]

const nonExistingId = async () => {
  const user = new UserModel({
    username: 'tester',
    name: 'test tester',
    password: 'tester3'
  })
  user.save()
  user.remove()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await UserModel.find({})

  return users
}

module.exports = {
  initialUsers, nonExistingId, usersInDb
}