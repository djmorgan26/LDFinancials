import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')

// Handle the potential null value
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Now TypeScript knows rootElement is not null
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)