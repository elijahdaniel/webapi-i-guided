// Nodemon - yarn run server || npm run server
// data being stored in data > hubs.db3 (do not delete)

// importing libraries
const express = require('express')

// other files
const db = require('./data/hubs-model.js')

// global objects (we want to access)
const server = express()

// middleware -- plug in before route handlers
server.use(express.json()) // generating middleware

// request handler -- takes two arguments (route, callback)

// GET /
server.get('/', (req, res) => {
  // request(incoming), response(outgoing)

  // server has to know
  // what is the datatype?
  // res.send auto detects. can write <h1> hello world </h1>
  // express takes care of that for us
  // what is my status code?
  // express will send back a status code of 200 by default (ex. 404 not found)
  // what am i sending back?

  res.send('Hello world')
})

// GET /now
// send back a timestamp
server.get('/now', (req, res) => {
  const now = new Date().toISOString()
  res.send(now)
})

// GET /hubs
server.get('/hubs', (req, res) => {
  // get hubs from db (database)
  // console.log('hubs', hubs)
  db.find()
    .then(hubs => {
      res.json(hubs)
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: 'failed to get hubs'
      })
    })
})

// POST /hubs
server.post('/hubs', (req, res) => {
  // in express req.body is not auto defined -- see middleware on top
  const newHub = req.body
  console.log('new hub', newHub)
  db.add(newHub)
    .then(hub => {
      res.status(201).json(hub)
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: 'failed to create new hub'
      })
    })
})

// DESTROY! /hubs/:id
server.delete('/hubs/:id', (req, res) => {
  // expect to find the params on req, because they relate to what's coming in
  // not what's going out
  const { id } = req.params

  db.remove(id)
    .then(deletedHub => {
      if (deletedHub) {
        res.json(deletedHub)
      } else {
        res.status(404).json({
          message: 'invalid hub id'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: 'failed to destroy hub'
      })
    })
})

// PUT /hubs/:id
server.put('/hubs/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.json(updated)
      } else {
        res.status(404).json({
          message: 'invalid hub id'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: 'failed to update hub'
      })
    })
})

server.get('/hubs/:id', (req, res) => {
  const { id } = req.params

  db.findById(id)
    .then(hub => {
      if (hub) {
        res.json(hub)
      } else {
        res.status(404).json({
          message: 'invalid hub id'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: 'failed to update hub'
      })
    })
})

// should be last step -- once this step is setup the server is ready for requests
server.listen(4000, () => {
  console.log('Server is running on port 4000')
})
