import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import Login from './pages/Login'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase-config'
import ListAuthores from './pages/ListAuthores'
import AuthorProfile from './pages/AuthorProfile'

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'))

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false)
      window.location.pathname = '/login'
    })
  }

  return (
    <Router>
      <nav className='navbar fixed top-0'>
        <Link to='/'> Home </Link>
        <Link to='/list-authors'> List Authors </Link>
        {!isAuth ? (
          <Link to='/login'> Login </Link>
        ) : (
          <>
            <Link to='/createpost'> Create Post </Link>
            <Link to='/profile'> Profile </Link>
            <button
              onClick={signUserOut}
              className='ml-3 font-bold bg-gradient-to-bl from-rose-800 to-red-600 px-4 py-2 rounded-lg shadow-lg'
            >
              Log Out
            </button>
          </>
        )}
      </nav>
      <div className='mt-20'>
        <Routes>
          <Route path='/' element={<Home isAuth={isAuth} />} />
          <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
          <Route path='/createpost' element={<CreatePost isAuth={isAuth} />} />
          <Route path='/profile' element={<AuthorProfile isAuth={isAuth} />} />
          <Route
            path='/list-authors'
            element={<ListAuthores isAuth={isAuth} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
