import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCi4OX2FQIbJu3pj8xIHiu-ijskoRC0WJs",
    authDomain: "loomslove-f4fb2.firebaseapp.com",
    projectId: "loomslove-f4fb2",
    storageBucket: "loomslove-f4fb2.firebasestorage.app",
    messagingSenderId: "395398649739",
    appId: "1:395398649739:web:c399719cf6c80ef40b018e",
    measurementId: "G-D1HWZ24HGP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const IMGBB_API_KEY = "9fb395bf1b8aeba531465cc61e955009";
