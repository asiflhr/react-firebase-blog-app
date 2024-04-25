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
    <div className='createPostPage flex justify-center lg:flex-row flex-col gap-10 lg:mt-0 mt-36'>
      <img
        src='https://media.istockphoto.com/id/1335774549/photo/night-study-online-learning-woman-typing.jpg?s=612x612&w=0&k=20&c=_ykNUKYdMg77n-YtO3O1qi0MMGP0k4mh-Uhp72dQE-8='
        alt=''
        className='rounded-3xl shadow-lg'
      />
      <div className='cpContainer rounded-3xl shadow-lg'>
        <h1>Create A Post</h1>
        <div className='inputGp'>
          <label> Title:</label>
          <input
            className='text-teal-800'
            placeholder='Title...'
            onChange={(event) => {
              setTitle(event.target.value)
            }}
          />
        </div>
        <div className='inputGp'>
          <label> Post:</label>
          <textarea
            className='text-teal-800'
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
