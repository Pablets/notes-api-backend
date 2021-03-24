const mongoose = require('mongoose')
require('dotenv').config()

const connectionString = process.env.MONGO_DB_URI_DEV

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
  .catch((err) => {
    console.log(err)
  })

