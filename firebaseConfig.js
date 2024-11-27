import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAoNGfFK_egeg4bGplA3VaIgjtgOFadq1Y",
    authDomain: "prvaapp-67489.firebaseapp.com",
    projectId: "prvaapp-67489",
    storageBucket: "prvaapp-67489.appspot.com",
    messagingSenderId: "995646695145",
    appId: "1:995646695145:web:addd2e0a9b62b53a87b278"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };