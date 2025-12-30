import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOiEvwPSbmbCnXisb7ec8vGlLMGweTnKc",
  authDomain: "creativewavesapp2.firebaseapp.com",
  projectId: "creativewavesapp2",
  storageBucket: "creativewavesapp2.firebasestorage.app",
  messagingSenderId: "673109519698",
  appId: "1:673109519698:web:87bc69b9ade050c4ec9e8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
