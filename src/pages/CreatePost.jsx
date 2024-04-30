import React, { useState, useEffect } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from '../firebase-config'
import { useNavigate } from 'react-router-dom'

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState('')
  const [postText, setPostText] = useState('')

  const postsCollectionRef = collection(db, 'posts')
  let navigate = useNavigate()

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      date: new Date(),
      author: {
        name: auth?.currentUser?.displayName,
        id: auth?.currentUser?.uid,
      },
    })
    navigate('/')
  }

  useEffect(() => {
    if (!isAuth) {
      navigate('/login')
    }
  }, [])

  return (
    <div className='createPostPage flex justify-center lg:flex-row flex-col gap-10 lg:mt-0 mt-36 bg-violet-200'>
      <img
        src='https://media.istockphoto.com/id/1164538944/vector/woman-with-laptop-studying-or-working-concept-table-with-books-lamp-coffee-cup-vector.jpg?s=612x612&w=0&k=20&c=VhUj_AZoUnilUKdRessjsK6JQUjXCfum7RQyuzOr6_0='
        alt=''
        className='rounded-3xl shadow-lg'
      />
      <div className='cpContainer rounded-3xl shadow-lg bg-violet-900'>
        <h1 className='text-3xl font-bold'>Write Something to Share</h1>
        <div className='inputGp'>
          <label> Title:</label>
          <input
            className='text-violet-800'
            placeholder='Title...'
            onChange={(event) => {
              setTitle(event.target.value)
            }}
          />
        </div>
        <div className='inputGp'>
          <label> Post:</label>
          <textarea
            className='text-violet-800'
            placeholder='Post...'
            onChange={(event) => {
              setPostText(event.target.value)
            }}
          />
        </div>
        <button onClick={createPost}> Submit Post</button>
      </div>
    </div>
  )
}

export default CreatePost
