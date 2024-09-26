const express = require('express') 
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const port = 3000 
require('dotenv').config();

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...
const mongoDB = process.env.MONGO_DB_URL
mongoose.connect(mongoDB, {/*useNewUrlParser: true, useUnifiedTopology: true*/})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database test connected")
})

// Mongoose Scheema and Model here...
// scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true } 
  })
  
// model
const Todo = mongoose.model('Todo', todoSchema, 'todos')

// Routes here...
//POST
app.post('/todos', async (request, response) => {
const { text } = request.body
const todo = new Todo({
    text: text
})
const savedTodo = await todo.save()
response.json(savedTodo)  
})

//GET ALL
app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
  })

//GET
app.get('/todos/:id', async (request, response) => {
const todo = await Todo.findById(request.params.id)
if (todo) response.json(todo)
else response.status(404).end()
})
  
//DELETE
app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndDelete(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
  })

//PUT
app.put('/todos/:id', async (request, response) => {
  // Haetaan päivityspyynnön runko (request.body), jossa on uusi tehtäväteksti
  const { text } = request.body;

  // Luodaan päivitettävä tehtäväobjekti
  const todo = {
      text: text
  };

  // Etsitään tehtävä tietokannasta ID:n perusteella ja päivitetään sen tiedot
  const filter = { _id: request.params.id }; // Hae tehtävä ID:llä
  const updatedTodo = await Todo.findOneAndUpdate(filter, todo, {
      new: true // Palautetaan päivitetty tehtävä
  });

  // Palautetaan päivitetty tehtävä vastauksena
  response.json(updatedTodo);
});



// todos-route
app.get('/todos', (request, response) => {
  response.send('Todos')
})

// app listen port 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})