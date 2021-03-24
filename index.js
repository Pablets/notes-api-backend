require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const { response } = require('express')

require('dotenv').config()
app.use(cors())
app.use(express.json())

let notes = []

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
  return maxId + 1
}

app.get('/', (req, res) => {
  res.send(`<h1>Hello World!!!</h1>`)
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note.findById(id)
    .then((note) => {
      if (note) {
        return res.json(note)
      } else {
        res.status(404).end
      }
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note.findByIdAndRemove(id)
    .then((response) => {
      response.status(204)
    })
    .catch((error) => next(error))

  res.status(202).json(notes)
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  })

  newNote.save().then((savedNote) => {
    res.json(savedNote)
  })

  res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)

  const body = req.body

  if (typeof body.important === 'undefined') {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const noteToUpdate = notes.findIndex((note) => note.id === id)

  notes[noteToUpdate].important = body.important

  res.status(200).json(notes)
})

app.use((err, req, res, next) => {
  console.error(err)
  if (err.name === 'CastError') {
    res.status(400).end()
  } else {
    res.status(500).end()
  }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`)
})
