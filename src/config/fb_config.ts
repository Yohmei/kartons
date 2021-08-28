import { initializeApp } from 'firebase/app'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCTGcbwJTO8ilQGG-rpcgUWSylHo3lg-VI',
  authDomain: 'kartons.firebaseapp.com',
  projectId: 'kartons',
  storageBucket: 'kartons.appspot.com',
  messagingSenderId: '606020543865',
  appId: '1:606020543865:web:2f01f18c423ef900d3bba8',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
// enableIndexedDbPersistence(db).catch((err) => console.log(err.code))
