require('./mongo')
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
// const Note = require('./models/Note')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send(`<h1>Hello World!!!</h1>`)
// })

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
