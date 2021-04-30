const supertest = require('supertest')
const User = require('../models/User')

const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo FullStack JS con midudev',
    important: true,
    date: new Date(),
  },
  {
    content: 'Sígueme en https://midu.tube',
    important: true,
    date: new Date(),
  },
  {
    content: 'Gracias al chat por vuestra ayuda! :D',
    important: true,
    date: new Date(),
  },
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response,
  }
}

const getUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  getAllContentFromNotes,
  initialNotes,
  api,
  getUsers,
}
