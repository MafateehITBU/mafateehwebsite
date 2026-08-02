import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageProvider.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { StaticInfoProvider } from './context/StaticInfoContext.jsx'
import { SeoProvider } from './context/SeoProvider.jsx'
import { ToastProvider } from './components/ui/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <StaticInfoProvider>
          <SeoProvider>
            <ToastProvider />
            <App />
          </SeoProvider>
        </StaticInfoProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
