import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDBaQifIkGxhb_IA8am9O9k5pYWSf9foH0',
  authDomain: 'csi015-webtechnologies.firebaseapp.com',
  projectId: 'csi015-webtechnologies',
  storageBucket: 'csi015-webtechnologies.appspot.com',
  messagingSenderId: '155555964270',
  appId: '1:155555964270:web:254a41291587b5b0c08d7f',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
