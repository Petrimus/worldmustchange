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
  if (req.query.p) {
    const countryCount = countryData.length;
    console.log('countrycount', countryCount)

    const perPage = 10
    const pageCount = Math.ceil(countryCount / perPage)

    let page = parseInt(req.query.p)
    if (page < 1) page = 1;
    if (page > pageCount) page = pageCount;

    let from = (page - 1) * perPage - 1
    const to = page * perPage

    if (from < 0) from = 0

    res.json({
      countries: countryData.slice(from, to).map(c => c.name),
      page,
      pageCount
    })
  } else {
    const countrynames = countryData.map(c => c.name)
    res.json(countrynames)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*
.map(c => c.name)
*/