const express = require('express')
const app = express()
const { downloadData } = require('./dataCollection')
// const { parseObjects } = require('./parseData')


let countryData = null

const initializeData = (async () => {
  const data = await downloadData()
  countryData = data
  console.log('Country data ready')  
})()

app.get('/', (req, res) => {
res.send('<h1>Wolrd must change!</h1>')
})

app.get('/countries', (req, res) => {
const countrynames = countryData.map(c => c.name)
res.json(countrynames)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
