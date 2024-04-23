import React, { useEffect, useState } from 'react'
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase-config'

function ListAuthores({ isAuth }) {
  const [authorLists, setAuthorList] = useState([])
  const postsCollectionRef = collection(db, 'users')

  const getAuthors = async () => {
    const data = await getDocs(postsCollectionRef)
    setAuthorList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getAuthors()
  }, [])

  return (
    <div className='homePage'>
      {authorLists?.length > 0 ? (
        authorLists?.map((user) => (
          <div
            className='bg-teal-200 text-zinc-800 p-4 rounded-3xl flex flex-col justify-center items-center gap-5'
            key={user.id}
          >
            <div className='px-2 font-semibold text-violet-900'>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt='author-photo'
                  width='100px'
                  height='100px'
                  className='rounded-full'
                />
              ) : (
                <div>{user?.displayName.subString(0, 1)}</div>
              )}
            </div>

            <div className='flex flex-col justify-center items-center bg-teal-400 p-3 rounded-lg'>
              <h1 className='w-full mb-1 font-bold text-xl'>
                {user?.displayName}
              </h1>
              <div className='postTextContainer'>{user?.email}</div>
            </div>
          </div>
        ))
      ) : (
        <h4>Loading Authoers...</h4>
      )}
    </div>
  )
}

export default ListAuthores
