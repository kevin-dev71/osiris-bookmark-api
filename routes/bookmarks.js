const express = require('express')
const router = express.Router()
const Bookmark = require('../models/bookmark')

// Getting all
router.get('/', async (req , res) => {
  try {
    const bookmarks = await Bookmark.find()
    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ message: err.message })
  }
})

// Getting one
router.get('/:id', getBookmark, (req , res) => {
  res.json(res.bookmark)
})

// Creating one
router.post('/', async (req , res) => {
  const bookmark = new Bookmark({
    name: req.body.name,
    link: req.body.link,
    tags: req.body.tags.split(',').map(a => a.trim())
  })
  try {
    const newBookmark = await bookmark.save()
    res.status(201).json(newBookmark)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// UPdating one
router.patch('/:id', getBookmark, async (req , res) => {
  const {name, tags, link} = req.body
  if(name != null) res.bookmark.name = name
  if(tags != null) res.bookmark.tags = tags
  if(link != null) res.bookmark.link = link
  
  try {
    const updatedBookmark = await res.bookmark.save()
    res.json(updatedBookmark)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// delete one
router.delete('/:id', getBookmark, async (req , res) => {
  try {
    await res.bookmark.remove()
    res.json({ message: 'Deleted Bookmark'})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// middleware for routes that require an id
async function getBookmark(req, res, next) {
  let bookmark
  try {
    bookmark = await Bookmark.findById(req.params.id)
    if(bookmark == null) return res.status(404).json({message: 'Cannot find bookmark with id: ' + req.params.id }) 
  } catch (error) {
    return res.status(500).json({ message: error.message})
  }

  res.bookmark = bookmark
  next()
}

module.exports = router