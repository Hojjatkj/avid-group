import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { BlogSection } from './components/BlogSection'
import { Footer } from './components/Footer'

interface LandingProps {
  onLoginClick: () => void
  onAboutClick: () => void
}

export default function Landing({ onLoginClick, onAboutClick }: LandingProps) {
  return (
    <div className="avid-site font-sans antialiased" dir="rtl">
      <a href="#main-content" className="skip-link">رفتن به محتوای اصلی</a>
      <Header onLoginClick={onLoginClick} onAboutClick={onAboutClick} />
      <main id="main-content">
        <Hero onLoginClick={onLoginClick} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}
