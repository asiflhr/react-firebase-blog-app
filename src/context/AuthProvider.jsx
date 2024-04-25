import React, { createContext, useState, useContext, useEffect } from 'react'
import { auth, db } from '../firebase-config'
import { collection, getDocs } from 'firebase/firestore'

// Create a context for managing the current user state
const AuthContext = createContext()

// Provider component to wrap your entire application
export const AuthProvider = ({ children }) => {
  // State to hold the current user
  const [currentUser, setCurrentUser] = useState(null)

  const postsCollectionRef = collection(db, 'users')

  const getCurrentAuthors = async () => {
    const data = await getDocs(postsCollectionRef)
    setCurrentUser(
      data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((user) => user.id === auth?.currentUser?.uid)[0]
    )
  }

  // Function to handle user logout
  const logout = async () => {
    try {
      setCurrentUser(null)
      await auth.signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Subscribe to authentication state changes
  useEffect(() => {
    getCurrentAuthors()
  }, [])

  // Provide the current user state and authentication functions to consuming components
  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to consume the AuthContext
export const useAuth = () => {
  return useContext(AuthContext)
}
