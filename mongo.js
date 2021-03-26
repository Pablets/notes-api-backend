const mongoose = require('mongoose')
require('dotenv').config()

const { MONGO_DB_URI_DEV, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString =
  NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI_DEV

NODE_ENV === 'close'
  ? 'closed'
  : // conexión a mongodb
    mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        console.log('Database connected')
      })
      .catch(err => {
        console.error(err)
      })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
