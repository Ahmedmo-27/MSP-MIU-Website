import React from 'react'
import { createRoot } from 'react-dom/client'

import './assets/CSS/styles.css'
import AppRouter from "./AppRouter.jsx";

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)