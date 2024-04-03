import { useState } from 'react'
import './App.css'
import Login from './pages/login/Login.jsx'
import SignUp from './pages/signup/SignUp.jsx'
import Home from './pages/home/Home.jsx'

function App () {
  const [count, setCount] = useState(0)

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      {/* <Login /> */}
      {/* <SignUp /> */}
      <Home />
    </div>
  )
}

export default App
