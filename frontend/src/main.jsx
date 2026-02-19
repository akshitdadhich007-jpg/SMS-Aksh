import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from './components/ui/Toast.jsx'
import App from './App.jsx'
import './index.css'
import './styles/components.css'
import './styles/dark-mode.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToastProvider>
            <App />
        </ToastProvider>
    </React.StrictMode>,
)
