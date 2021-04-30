const mongoose = require('mongoose')
require('dotenv').config()

const { MONGO_DB_URI_DEV, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString =
  NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI_DEV

// conexión a mongodb
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    NODE_ENV === 'test'
      ? console.log('TEST Database connected')
      : console.log('DEV Database connected')
  })
  .catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.log('Error, database closed')
  console.error(error)
  mongoose.disconnect()
})
