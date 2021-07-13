require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

app.use(express.json())
const PORT = process.env.PORT|| 5000
const DATABASE_URL = process.env.DATABASE_URL

const posts = [
  { username: 'Jim', title: 'Post 1'},
  { username: 'John', title: 'Post 2'}
]
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login' , (req, res) => {
  // Authenticate user
  const username = req.body.username
  const user = { name: username }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

  res.json({ accessToken })
})

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if ( token == null ) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const bookmarksRouter = require('./routes/bookmarks')

app.use('/bookmarks', bookmarksRouter)

app.listen(PORT, () => console.log('Server listening on port: ' + PORT))