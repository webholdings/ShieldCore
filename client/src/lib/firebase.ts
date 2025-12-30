import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "coreshield-cae1b.firebaseapp.com",
  projectId: "coreshield-cae1b",
  storageBucket: "coreshield-cae1b.firebasestorage.app",
  messagingSenderId: "85537261644",
  appId: "1:85537261644:web:384707ca347e5881a6cce9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
