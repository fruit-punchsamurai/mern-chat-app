const express = require("express")
const {chats} = require("./data/data")
const dotenv = require("dotenv")
dotenv.config()


const app = express()

app.get('/api/chats', (req,res) => {
  res.send(chats)
})

app.get('/api/chats/:id', (req,res) => {
  const chat = chats.find(c=>c._id === req.params.id)
  res.send(chat)
})

app.get('/',(req,res) => {
  res.send("API is running successfully")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started at Port: ${PORT}`))