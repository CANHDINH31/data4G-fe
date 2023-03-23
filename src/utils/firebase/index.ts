import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-1tCvknBMnZinisKbhXpYgQHc6kjfwA0",
  authDomain: "instagram-demo-bee28.firebaseapp.com",
  projectId: "instagram-demo-bee28",
  storageBucket: "instagram-demo-bee28.appspot.com",
  messagingSenderId: "203553021052",
  appId: "1:203553021052:web:d9426b1f85991117d4bdf9",
  measurementId: "G-KM5D9SN9YR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, auth, provider, analytics, storage };
