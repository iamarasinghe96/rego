// Dev-server entry only. The shipped file is built by scripts/build-static.mjs
// and contains no JavaScript at all — this exists so `npm run dev` shows the
// same markup while editing.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StaticApp from './static/StaticApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StaticApp />
  </StrictMode>,
)
