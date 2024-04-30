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
      <nav className='navbar fixed top-0 bg-violet-200 shadow-violet-300 shadow-sm'>
        <div className='flex mx-auto max-w-[1000px] justify-between w-full h-full flex-wrap'>
          <Link to='/'>
            <img
              width='150px'
              src='https://pencraftsa.com.au/cdn/shop/files/Pencraft_Logo_horizointal_30cc703f-0678-470d-9697-5ea1ffddd911.png?v=1680777431&width=2048'
              alt=''
            />
          </Link>

          <div className='flex gap-4 items-center flex-wrap text-violet-800'>
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
                  className='ml-3 font-bold h-fit bg-gradient-to-bl from-violet-600 to-violet-800 px-4 py-2 rounded-lg shadow-lg text-violet-100'
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
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
