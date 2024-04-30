import React, { useState, useEffect } from 'react'
import { auth, db, storage } from '../firebase-config'
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { ImagePicker } from 'react-file-picker'

function AuthorProfile({ isAuth }) {
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [fullName, setFullName] = useState(currentUser?.displayName || '') // State for full name
  const [email, setEmail] = useState(currentUser?.email || '') // State for email
  const [profession, setProfession] = useState('') // State for profession
  const [bio, setBio] = useState('') // State for bio

  const getCurrentAuthors = async () => {
    const usersCollectionRef = collection(db, 'users')
    const data = await getDocs(usersCollectionRef)
    setCurrentUser(
      data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((user) => user.id === auth?.currentUser?.uid)[0]
    )
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      // Update display name in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid)
      // await updateDoc(userDocRef, { displayName })

      // Update profile photo in storage
      if (profilePhoto) {
        const storageRef = storage.ref()
        const photoRef = storageRef.child(`profilePhotos/${currentUser.uid}`)
        await photoRef.put(profilePhoto)
        const photoURL = await photoRef.getDownloadURL()

        // Update profile photo URL in Firestore
        await updateDoc(userDocRef, {
          photoURL,
          displayName: fullName,
          email: email,
          profession: profession,
          bio: bio,
        })
      }

      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.currentUser) {
      getCurrentAuthors()
      // setProfilePhoto(currentUser?.photoURL || '')
      // setFullName(currentUser?.displayName || '')
      // setEmail(currentUser?.email || '')
      // setProfession(currentUser?.profession || '')
      // setBio(currentUser?.bio || '')
    }
  }, [auth])

  console.log('profile photo: ', profilePhoto)

  return (
    <div className='profilePage mx-auto px-4 py-8 bg-violet-200 w-full'>
      {!currentUser ? (
        <div>Loading...</div>
      ) : (
        <main className='w-full min-h-screen py-1 md:w-2/3 lg:w-3/4'>
          <div className='p-2 md:p-4'>
            <div className='w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg'>
              <h2 className='pl-6 text-2xl font-bold sm:text-xl'>
                Author's Public Profile
              </h2>

              <div className='grid max-w-2xl mx-auto mt-8'>
                <div className='flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0'>
                  <img
                    className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500'
                    src={profilePhoto ?? currentUser?.photoURL}
                    alt='Bordered avatar'
                  />

                  <div className='flex flex-col space-y-5 sm:ml-8'>
                    <ImagePicker
                      extensions={['jpg', 'jpeg', 'png']}
                      dims={{
                        minWidth: 100,
                        maxWidth: 500,
                        minHeight: 100,
                        maxHeight: 500,
                      }}
                      value={profilePhoto}
                      onChange={(base64) => setProfilePhoto(base64)}
                      onError={(errMsg) => {}}
                    >
                      <button
                        type='button'
                        className='py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-violet-700 rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 '
                      >
                        Change picture
                      </button>
                    </ImagePicker>
                    <button
                      type='button'
                      className='py-3.5 px-7 text-base font-medium text-indigo-700 focus:outline-none bg-indigo-100 rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 '
                    >
                      Delete picture
                    </button>
                  </div>
                </div>

                <div className='items-center mt-8 sm:mt-14 text-[#202142]'>
                  <div className='flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6'>
                    <div className='w-full'>
                      <label
                        htmlFor='last_name'
                        className='block mb-2 text-sm font-medium text-indigo-900'
                      >
                        Your full name
                      </label>
                      <input
                        type='text'
                        id='full_name'
                        className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                        placeholder='Your last name'
                        value={currentUser?.displayName || fullName}
                        onChange={(e) => {
                          setFullName(e.target.value)
                        }}
                        // required
                      />
                    </div>
                  </div>

                  <div className='mb-2 sm:mb-6'>
                    <label
                      htmlFor='email'
                      className='block mb-2 text-sm font-medium text-indigo-900'
                    >
                      Your email
                    </label>
                    <input
                      type='email'
                      id='email'
                      className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                      placeholder='your.email@mail.com'
                      value={currentUser?.email || email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      // required
                    />
                  </div>

                  <div className='mb-2 sm:mb-6'>
                    <label
                      htmlFor='profession'
                      className='block mb-2 text-sm font-medium text-indigo-900'
                    >
                      Profession
                    </label>
                    <input
                      type='text'
                      id='profession'
                      className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                      placeholder='your profession'
                      value={currentUser?.profession || profession}
                      onChange={(e) => {
                        setProfession(e.target.value)
                      }}
                      // required
                    />
                  </div>

                  <div className='mb-6'>
                    <label
                      htmlFor='message'
                      className='block mb-2 text-sm font-medium text-indigo-900'
                    >
                      Bio
                    </label>
                    <textarea
                      id='message'
                      rows='4'
                      className='block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 '
                      placeholder='Write your bio here...'
                      value={currentUser?.bio || bio}
                      onChange={(e) => {
                        setBio(e.target.value)
                      }}
                    ></textarea>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      disabled={!loading}
                      type='button'
                      onClick={handleUpdateProfile}
                      className='text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
                    >
                      {loading ? 'Updating Profile' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

export default AuthorProfile
