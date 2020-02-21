const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)


describe('test countries route', () => {


test('info returned', () => {
  api
    .get('api/countries/info')
    .expect(200)
  // .expect('Content-Type', /application\/json/)
})

test('countries are returned as json', () => {
  api
    .get('/api/countries')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('right content length', async () => {
  const response = await api.get('/api/countries')

  expect(200)
  expect(response.body.length).toBe(264)
})

test('request to wrong path', () => {
 api
 .get('/countries')
 .expect(404)  
})

test('request with query page = 1', async () => {
  const response = await api.get('/api/countries?page=1')
  const response2 = await api.get('/api/countries?page=3')

  expect(response.body.countries).toContain('Albania')  
  expect(response2.body.countries).toContain('Belize')  
 })

 test('get certain country', async () => {
  const response = await api.get('/api/countries?country=finland')  

  expect(response.body.name).toBe('Finland')    
 })

 test('if certain country not found', () => {
  api
  .get('/api/countries?country=suomi')  
   .expect(404)    
 })

})



