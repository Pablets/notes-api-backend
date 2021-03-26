require('./mongo')
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(`<h1>Hello World!!!</h1>`)
})

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if (note) {
        return res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

app.delete('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    await Note.findByIdAndDelete(id)
      .then(() => {
        res.status(204).end()
      })
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', async (req, res, next) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: 'required content missing',
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  })
  try {
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }