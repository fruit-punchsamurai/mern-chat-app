import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Chatpage from './Pages/Chatpage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='/chats' element={<Chatpage />} />    
    </Routes>
  )
}

export default App
