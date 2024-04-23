import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

const firebaseConfig = {
  // Your firebase configuration goes here
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function AuthorProfile({ isAuth }) {
  const [authorData, setAuthorData] = useState(null)

  // Get the logged-in user ID from your authentication logic
  const loggedInUserId = 'YOUR_USER_ID'

  useEffect(() => {
    const getAuthor = async () => {
      const authorCollection = collection(db, 'authors')
      const q = query(authorCollection, where('id', '==', loggedInUserId))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.data())[0]
      setAuthorData(data)
    }

    getAuthor()
  }, [])

  if (!authorData) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row md:space-x-8'>
        <img
          src={authorData.profilePicture}
          alt='Author profile picture'
          className='w-48 h-48 rounded-full mx-auto md:mx-0'
        />
        <div className='flex-grow'>
          <h1 className='text-2xl font-bold'>{authorData.name}</h1>
          <p className='text-gray-600 mt-2'>{authorData.bio}</p>
          <div className='flex items-center mt-4'>
            <a
              href={authorData.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline'
            >
              {authorData.website}
            </a>
            {authorData.socialMedia && (
              <ul className='ml-4 flex space-x-2'>
                {authorData.socialMedia.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:underline'
                    >
                      {social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorProfile
