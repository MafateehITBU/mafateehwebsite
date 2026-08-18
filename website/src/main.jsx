import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageProvider.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { StaticInfoProvider } from './context/StaticInfoContext.jsx'
import { ToastProvider } from './components/ui/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <StaticInfoProvider>
          <ToastProvider />
          <App />
        </StaticInfoProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
