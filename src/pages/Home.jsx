import React, { useEffect, useState } from 'react'
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase-config'

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([])
  const [showFullContent, setShowFullContent] = useState(false)
  const postsCollectionRef = collection(db, 'posts')

  const toggleContent = () => setShowFullContent(!showFullContent)

  const deletePost = async (id) => {
    const postDoc = doc(db, 'posts', id)
    await deleteDoc(postDoc)
  }

  const getPosts = async () => {
    const data = await getDocs(postsCollectionRef)
    setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div className='homePage'>
      {postLists?.length > 0 ? (
        postLists?.map((post) => (
          <div className='post bg-teal-200 text-zinc-800 p-2' key={post.id}>
            <div className='flex flex-row items-center bg-teal-400 p-2 rounded-lg'>
              <h1 className='w-full mb-1 font-bold text-xl'>{post?.title}</h1>
              {isAuth && post?.author.id === auth.currentUser.uid && (
                <div className='bg-teal-800 py-2 px-[14px] rounded-full text-xl text-gray-100'>
                  <button
                    onClick={() => {
                      deletePost(post?.id)
                    }}
                  >
                    {' '}
                    &#128465;
                  </button>
                </div>
              )}
            </div>
            <div className='postTextContainer px-2 pt-2'>
              {showFullContent ? (
                <span>{post?.postText}</span>
              ) : (
                <span>{post?.postText.substring(0, 100)}...</span>
              )}
              {post?.postText.length > 100 && (
                <button
                  onClick={toggleContent}
                  className='text-teal-900 font-medium'
                >
                  {showFullContent ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
            <h3 className='px-2 font-semibold text-violet-900'>
              @ {post?.author?.name}
            </h3>
          </div>
        ))
      ) : (
        <h4>Loading Posts...</h4>
      )}
    </div>
  )
}

export default Home