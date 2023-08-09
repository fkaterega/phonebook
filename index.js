const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3002
const cors = require('cors')
const date = new Date()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), req.body, 'ms'
    ].join(' ')
  })

const generateId = () => {
   return persons.length + Math.floor(Math.random() * 1000)
}

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Node JS Phonebook</h1>')
})


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people
        <p>${date}</p>`
        )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(p => p.id !== id)
   //Return only status code
    res.status(204).end()
})

app.post('/api/persons', morgan(),(req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'The name or number is missing'
        })
    } 

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number

    }

    if(persons.find(name => name.name === person.name)) {
        res.status(400).json({
            error: 'name must be unique'
        })
    } else {
        persons = persons.concat(person)
        res.json(person)
    }

   
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


app.listen(PORT)
    console.log(`listening on port ${PORT}`)

 