import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBR_9RtgnySURKiLzvVfeKe98_QGlBLrcI",
  authDomain: "around-the-world-a3abb.firebaseapp.com",
  projectId: "around-the-world-a3abb",
  storageBucket: "around-the-world-a3abb.firebaseapp.com",
  messagingSenderId: "673287429339",
  appId: "1:673287429339:web:8d42b7c91e51e832fb80fe",
  measurementId: "G-C4553S5N48",
};

// Инициализация Firebase (однократная)
const app = initializeApp(firebaseConfig);

// Экспорт экземпляров Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
