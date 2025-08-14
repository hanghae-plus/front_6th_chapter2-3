import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import PostsManagerPageOrigin from './components/PostsManagerPageOrigin.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PostsManagerPageOrigin />
    </BrowserRouter>
  </React.StrictMode>,
)
