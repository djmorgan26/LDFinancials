import React from 'react'
import { createRoot } from 'react-dom/client'
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import App from './App'
import './index.css'

const firebaseConfig = {
  apiKey: "AIzaSyAa3bzY6N4erq_n41iwLRo6t9eG31DvY6E",
  authDomain: "artificial-finance.firebaseapp.com",
  projectId: "artificial-finance",
  storageBucket: "artificial-finance.firebasestorage.app",
  messagingSenderId: "644537614156",
  appId: "1:644537614156:web:e3c49b2ed207ce1ec059e9",
  measurementId: "G-V556D8T4DH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
 



const rootElement = document.getElementById('root')

// Handle the potential null value
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Now TypeScript knows rootElement is not null
const root = createRoot(rootElement)

root.render(
    <React.StrictMode>
        <App auth={auth} />
    </React.StrictMode>
)