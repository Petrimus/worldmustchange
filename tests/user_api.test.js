// const mongoose = require('mongoose')
const dbHandler = require('./db-handler')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const UserModel = require('../models/users')

describe('Test User api, when inially 2 users at db', () => {
  beforeAll(async () => await dbHandler.connect())
  beforeEach(async () => {
    await dbHandler.clearDatabase()
    let userObject = new UserModel(helper.initialUsers[0])
    await userObject.save()
    userObject = new UserModel(helper.initialUsers[1])
    await userObject.save()
  })
  // afterEach(async () => await dbHandler.clearDatabase())
  afterAll(async () => await dbHandler.closeDatabase())

  test('get initial users', async () => {
    const users = await UserModel.find({})
    const userNames = users.map(u => u.username)

    expect(users.length).toBe(2)
    expect(userNames).toContain('testertest')
  })

  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'palmupe',
      name: 'Petri Palmu',
      password: 'salainen1',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.name).toBe('Petri Palmu')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(userAtStart.length + 1)

    const userNames = usersAtEnd.map(u => u.username)
    expect(userNames).toContain(newUser.username)
  })

  test('creation fails with a reserved username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'doejoe',
      name: 'John Doe',
      password: 'johndooe2'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      // console.log('error', response.body.error)      

    expect(response.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(userAtStart.length)

    const userNames = usersAtEnd.map(u => u.username)
    expect(userNames).toContain(newUser.username)
  })

  test('creation fails with too short password', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'doejoe',
      name: 'John Doe',
      password: 'john2'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      // console.log('error', response.body.error)      

    expect(response.body.error).toContain('password length must be atleast 6 digits long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(userAtStart.length)

    const userNames = usersAtEnd.map(u => u.username)
    expect(userNames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testertest',
      name: 'Test Tester',
      password: 'tester1',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is incorrect', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testertest',
      name: 'Test Tester',
      password: 'tester',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password has to have atleast one number')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(userAtStart.length)

    const userNames = usersAtEnd.map(u => u.username)
    expect(userNames).toContain(newUser.username)
  })
  
})
