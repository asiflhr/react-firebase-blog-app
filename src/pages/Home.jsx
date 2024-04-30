import React, { useEffect, useState } from 'react'
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  addDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'
import { auth, db } from '../firebase-config'
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([])
  const [showFullContent, setShowFullContent] = useState({})
  const [comments, setComments] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const postsCollectionRef = collection(db, 'posts')

  const toggleContent = (id) => {
    setShowFullContent((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the visibility state for the specific post
    }))
  }

  const deletePost = async (id) => {
    const postDoc = doc(db, 'posts', id)
    await deleteDoc(postDoc)
  }

  const getPosts = async () => {
    try {
      // Fetch posts
      const postsSnapshot = await getDocs(postsCollectionRef)
      const postsData = postsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        comments: [], // Initialize comments array for each post
      }))

      // Fetch comments for each post and set up listeners for real-time updates
      const postsWithComments = await Promise.all(
        postsData.map(async (post) => {
          // Fetch initial comments
          const commentsSnapshot = await getDocs(
            collection(db, 'posts', post.id, 'comments')
          )
          const commentsData = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          post.comments = commentsData

          // Set up listener for real-time updates to comments
          const commentsRef = collection(db, 'posts', post.id, 'comments')
          const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
            const updatedComments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            // Update comments in state
            setPostList((prevPosts) => {
              return prevPosts.map((prevPost) => {
                if (prevPost.id === post.id) {
                  return { ...prevPost, comments: updatedComments }
                }
                return prevPost
              })
            })
          })

          // Save unsubscribe function for cleanup
          return { ...post, unsubscribe }
        })
      )

      // Update state with posts including comments
      setPostList(postsWithComments)
    } catch (error) {
      console.error('Error fetching posts and comments:', error)
    }
  }

  console.log('posts lists: ', postLists)

  const handleCommentSubmit = async (postId) => {
    const user = auth?.currentUser // Assuming you have a way to get the current user
    const comment = {
      text: commentTexts[postId],
      user: {
        id: user.uid,
        name: user.displayName,
      },
      createdAt: new Date(),
    }

    // Save the comment to Firestore
    const commentCollectionRef = collection(db, 'posts', postId, 'comments')
    const newCommentRef = doc(commentCollectionRef)
    await setDoc(newCommentRef, comment)

    // Update the local state
    setComments((prevState) => ({
      ...prevState,
      [postId]: [...(prevState[postId] || []), comment],
    }))
    setCommentTexts({ ...commentTexts, [postId]: '' })
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div className='homePage'>
      {postLists?.length > 0 ? (
        postLists?.map((post) => (
          <div
            id={post?.id}
            className='post bg-violet-900 text-zinc-100 p-2 h-fit'
            key={post.id}
          >
            <div className='flex flex-row items-center bg-violet-300 p-2 rounded-lg'>
              <h1 className='w-full mb-1 font-bold text-xl text-zinc-900'>
                {post?.title}
              </h1>
              {isAuth && post?.author.id === auth?.currentUser?.uid && (
                <div className='bg-violet-800 py-2 px-[14px] rounded-full text-xl text-gray-100'>
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
              {showFullContent[post.id] ? (
                <span>{post?.postText}</span>
              ) : (
                <span>{post?.postText.substring(0, 100)}...</span>
              )}
              {post?.postText.length > 100 && (
                <button
                  onClick={() => toggleContent(post.id)}
                  className='text-rose-200 font-medium'
                >
                  {showFullContent ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
            <div className='flex justify-between w-full items-center gap-5 mt-3'>
              <h3 className='px-2 font-semibold text-violet-100 w-fit'>
                @ {post?.author?.name}
              </h3>

              {/* comment text filed here */}
              <div className='flex flex-1'>
                <input
                  className='px-5 py-2 text-sm w-full text-violet-800 rounded-full bg-violet-100 shadow-lg'
                  type='text'
                  placeholder='Add a comment...'
                  value={commentTexts[post?.id] || ''}
                  onChange={(e) =>
                    setCommentTexts({
                      ...commentTexts,
                      [post.id]: e.target.value,
                    })
                  }
                />
                <button
                  className='ml-[-30px]'
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  <FacebookMessengerIcon size={22} round />
                </button>
              </div>

              <div className='flex gap-2 items-center w-fit'>
                <FacebookShareButton
                  url={`https://pen-craft-react.vercel.app/#${post?.id}`}
                  quote={post?.title}
                  hashtag='#penCraft'
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <WhatsappShareButton
                  url={`https://pen-craft-react.vercel.app/#${post?.id}`}
                  title={post?.title}
                  hashtag='#penCraft'
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <TwitterShareButton
                  url={`https://pen-craft-react.vercel.app/#${post?.id}`}
                  title={post?.title}
                  hashtag='#penCraft'
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </div>
            </div>

            {/* Display comments */}
            {post?.comments?.length > 0 && (
              <div className='flex gap-2 flex-col bg-violet-100 p-2 mt-4 rounded-xl text-violet-900'>
                {post?.comments?.map((comment, index) => (
                  <div
                    key={index}
                    className='comment bg-violet-300 rounded-lg py-1 px-2'
                  >
                    <p>{comment.text}</p>
                    <p>
                      By: <span className='font-bold'>{comment.user.name}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <h4>Loading Posts...</h4>
      )}
    </div>
  )
}

export default Home
