const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const MAX = 100000000000
const MIN = 10



const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// app.use(requestLogger)


let phonebook = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

// app.get('/', (request, response) => {
//   response.send('<h1>try a valid endpoint maybe?</h1>')
// })

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', (request, response) => {
  const now = new Date()
  // console.log(now)
  const n = phonebook.length
  response.send(`Phonebook has info for ${n} people. <br /> ${now}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(person => person.id === id)
  // console.log('id', id)
  if (person) { response.json(person) } else { response.status(404).end() }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})


const generateId = () => {
  return Math.floor((Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    response.status(400).json({
      error: 'name missing'
    })
    return
  }

  if (!body.number) {
    response.status(400).json({
      error: 'number missing'
    })
    return
  }

  if (phonebook.find(person => person.name === body.name)) {
    response.status(409).json({
      error: 'name must be unique'
    })
    return
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
