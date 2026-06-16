import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCK0P515w8hDC92HcH1FvonK6jAGyPPjEg",
    authDomain: "controle-acesso-fortepar.firebaseapp.com",
    projectId: "controle-acesso-fortepar",
    storageBucket: "controle-acesso-fortepar.firebasestorage.app",
    messagingSenderId: "1072031478643",
    appId: "1:1072031478643:web:b590733d6acad5c006cb06"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

console.log("Firebase conectado!");