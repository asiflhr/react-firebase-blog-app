import React from 'react'
import { auth, db, provider } from '../firebase-config'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'

function Login({ setIsAuth }) {
  let navigate = useNavigate()

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Check if user exists in the database
        const userRef = doc(db, 'users', result.user.uid)
        getDoc(userRef)
          .then((docSnap) => {
            if (!docSnap.exists()) {
              // User does not exist in the database, add them
              setDoc(userRef, {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                createdAt: new Date(),
                // Add any other user properties you want to store
              })
                .then(() => {
                  console.log('User added to the database')
                })
                .catch((error) => {
                  console.error('Error adding user to the database: ', error)
                })
            }
          })
          .catch((error) => {
            console.error('Error checking if user exists: ', error)
          })

        // Set local storage and navigate
        localStorage.setItem('isAuth', true)
        setIsAuth(true)
        navigate('/')
      })
      .catch((error) => {
        console.error('Sign in error: ', error)
      })
  }

  return (
    <div className='loginPage'>
      <p>Sign In With Google to Continue</p>
      <button className='login-with-google-btn' onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}

export default Login
