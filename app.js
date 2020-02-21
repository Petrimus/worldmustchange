const express = require('express')
const app = express()
const morgan = require('morgan')
const countryRouter = require('./controllers/countries')
const middleware = require('./utils/middleware')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())
// app.use(morgan('tiny'))
app.use(middleware.requestLogger)
app.use('/api/countries', countryRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

