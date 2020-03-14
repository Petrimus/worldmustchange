const countryRouter = require('express').Router()
const { downloadData } = require('../dataCollection')

countryRouter.get('/info', (req, res) => {
  res.send('<h1>Wolrd must change!</h1>')
})

countryRouter.get('/', async (req, res) => {
  // console.log('req query ', req.query)
  // console.log('country data length', countryData.length)
  const data = await downloadData()
  // console.log('data in route', data)
  if (req.query.page) {

    const countryCount = data.length
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
      countries: data.slice(from, to).map(c => c.name),
      page,
      pageCount
    })

  } else if (req.query.country) {
    const country = req.query.country   
    const nameCapitalized = country.charAt(0).toUpperCase() + country.slice(1)    
    const resCountry = data.find((c) => c.name === nameCapitalized)
    
    if (resCountry !== undefined) {
      res.json(resCountry)
    } else {
      res.status(404).end()
    }
  }
  else {
    const countrynames = data.map(c => c.name)
    res.json(countrynames)
  }
})

countryRouter.get('/all', async (req, res) => {
  const data = await downloadData()
  res.json(data)
})

module.exports = countryRouter


