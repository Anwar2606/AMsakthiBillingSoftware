import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
    apiKey: "AIzaSyDUAqiJ6521EprdUZyehRYZl9mkdeIHrJs",
  authDomain: "billingsoftware-712e4.firebaseapp.com",
  projectId: "billingsoftware-712e4",
  storageBucket: "billingsoftware-712e4.appspot.com",
  messagingSenderId: "525578324246",
  appId: "1:525578324246:web:0063b46c3bf2c49ac5e837"
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 

export { db, storage, auth }; 
