const express = require('express')
const app = express()
const logger = require('./loggers/logger')
const httpLogger = require('./loggers/httpLogger')
const {
  logError,
  logErrorMiddleware,
  returnError,
  isTrustedError
} = require('./errors/errorHandler')

const Api500Error = require('./errors/api500Error')

app.get('/bam', (req, res, next) => {
  console.log('Bam!')
  res.status(200).send('Bam!')
})

app.use(httpLogger)

app.get('/', (req, res, next) => {
  res.status(200).send('Hello World!')
})

app.get('/boom', (req, res, next) => {
  try {
    throw new Error('Wowza!')
  } catch (error) {
    logger.error('Whooops! This broke with error: ', error)
    res.status(500).send('Error!')
  }
})

app.get('/errorhandler', (req, res, next) => {
  try {
    throw new Api500Error('Wowza!')
  } catch (error) {
    next(error)
  }
})

app.use(logErrorMiddleware)
app.use(returnError)

process.on('uncaughtException', error => {
  logError(error)

  if (!isTrustedError(error)) {
    process.exit(1)
  }
})

const port = process.env.PORT || 80
app.listen(port, () => logger.info(`Express.js listening on port ${port}.`))
