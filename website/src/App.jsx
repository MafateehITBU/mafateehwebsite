import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/common/ScrollToTop.jsx'
import { SiteShell } from './components/layout/SiteShell.jsx'
import { BlogPost } from './pages/BlogPost.jsx'
import { Blogs } from './pages/Blogs.jsx'
import { Home } from './pages/Home.jsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy.jsx'
import { About } from './pages/About.jsx'
import { IT } from './pages/IT.jsx'
import { Marketing } from './pages/Marketing.jsx' 
import { Branding } from './pages/Branding.jsx'
import { Packages } from './pages/Packages.jsx'
import { Contact } from './pages/Contact.jsx'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/it-solutions" element={<IT />} />
          <Route path="/digital-marketing" element={<Marketing />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </SiteShell>
    </BrowserRouter>
  )
}

export default App
