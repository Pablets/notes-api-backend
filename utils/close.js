const mongoose = require('mongoose')
const { server } = require('../index')

mongoose.connection.close()
server.close()
