import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Store from './pages/Store'
import Admin from './pages/Admin'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Store />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
)
