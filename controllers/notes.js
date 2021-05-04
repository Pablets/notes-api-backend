const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middlewares/userExtractor')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  res.json(notes)
})

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body

  // sacar userId de req
  const { userId } = req

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({
      error: 'required "content" field is missing',
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id,
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', userExtractor, (req, res, next) => {
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

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const id = req.params.id

  try {
    await Note.findByIdAndDelete(id).then(() => {
      res.status(204).end()
    })
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', userExtractor, (req, res, next) => {
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

module.exports = notesRouter
