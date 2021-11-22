const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const port = 3003
let db = {}
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.get('/', (req, res) => res.send('ok'))

app.post('/users/:name/todos', (req, res) => {
    const name = String(req.params.name)
    const { text } = req.body
    const todo = { id: uuidv4(), text, done: false }
    if (name in db) {
        db[name].push(todo)
    } else {
        db[name] = [todo]
    }
    res.sendStatus(201)
})

app.get('/users/:name/todos', (req, res) => {
    const name = String(req.params.name)
    if (name in db) {
        res.json(db[name])
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.get('/users/:name/todos/:id', (req, res) => {
    const name = String(req.params.name)
    const id = String(req.params.id)
    if (name in db) {
        const todos = db[name]
        const index = todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
            res.json(todos[index])
        } else {
            res.status(404).json({
                message: 'id not found'
            })
        }
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.put('/users/:name/todos/:id', (req, res) => {
    const name = String(req.params.name)
    const id = String(req.params.id)
    const { text, done } = req.body
    if (name in db) {
        const todos = db[name]
        const index = todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
            todos.splice(index, 1, { id, text, done })
            db[name] = todos
            res.sendStatus(200)
        } else {
            res.status(404).json({
                message: 'id not found'
            })
        }
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.delete('/users/:name/todos/:id', (req, res) => {
    const name = String(req.params.name)
    const id = String(req.params.id)
    if (name in db) {
        const todos = db[name]
        const index = todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
            todos.splice(index, 1)
            db[name] = todos
            res.sendStatus(200)
        } else {
            res.status(404).json({
                message: 'id not found'
            })
        }
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.post('/users/:name/reset', (req, res) => {
    const name = String(req.params.name)
    if (name in db) {
        db[name] = []
        res.sendStatus(200)
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.post('/reset', (req, res) => {
    db = {}
    res.sendStatus(200)
})

app.get('/all', (req, res) => {
    res.json(db)
})

app.listen(port, () => console.log(`server started at ${port}`))