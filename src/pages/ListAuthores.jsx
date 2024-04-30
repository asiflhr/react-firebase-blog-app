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
    <div className='authorsPage mx-auto items-center justify-center flex'>
      {authorLists?.length > 0 ? (
        authorLists?.map((user) => (
          <div
            className='bg-violet-300 text-violet-200 p-4 shadow-lg rounded-xl flex justify-center items-center gap-5 w-[400px] h-[200px] min-w-[250px]'
            key={user.id}
          >
            <div className='px-2'>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt='author-photo'
                  width='300px'
                  height='300px'
                  className='rounded-full object-contain'
                />
              ) : (
                <div>{user?.displayName.subString(0, 1)}</div>
              )}
            </div>

            <div className='flex flex-col justify-center bg-violet-800 p-3 rounded-lg w-full'>
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
