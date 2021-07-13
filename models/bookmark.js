const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  link: {},
  tags: [String],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Bookmark' , bookmarkSchema)