import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDlkrPS80ZHApqdNbsPYKFX3Zh2CkAxCT8',
  authDomain: 'renaissance-7d41e.firebaseapp.com',
  projectId: 'renaissance-7d41e',
  storageBucket: 'renaissance-7d41e.firebasestorage.app',
  messagingSenderId: '409700702855',
  appId: '1:409700702855:web:6b83c706247d4873b5b622'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);