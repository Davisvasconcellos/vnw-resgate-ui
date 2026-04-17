import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";

// As configuracoes serao pegas do arquivo .env.local do User
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializa ou reaproveita o Firebase App (ideal para o fluxo do Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta o Auth para logar o usuario
const auth = getAuth(app);

// Exporta o Provider e o metodo para facilitar na hora do Botao do Login
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup };
