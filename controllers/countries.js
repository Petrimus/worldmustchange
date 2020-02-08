const countryRouter = require('express').Router()
const { downloadData } = require('../dataCollection')

let countryData

(async function data() {
  const data = await downloadData()
  // console.log('Country data ready')
  // console.log('type of data', typeof data)
  countryData = data
  console.log('country data length ', countryData.length)
  
})()

countryRouter.get('/info', (req, res) => {
  res.send('<h1>Wolrd must change!</h1>')
})

countryRouter.get('/', (req, res) => {
  console.log('req query ', req.query)
  if (req.query.page) {    
    
    const countryCount = countryData.length
    // console.log('countrycount', countryCount)

    const perPage = 10
    const pageCount = Math.ceil(countryCount / perPage)

    let page = parseInt(req.query.page)
    if (page < 1) page = 1
    if (page > pageCount) page = pageCount

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

countryRouter.get('/all', (req, res) => {
  res.json(countryData)
})

module.exports = countryRouter


