import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AboutAndExperience } from '../components/AboutAndExperience'

interface AboutPageProps {
  onLoginClick: () => void
  onHomeClick: () => void
}

export default function AboutPage({ onLoginClick, onHomeClick }: AboutPageProps) {
  return (
    <div className="avid-site min-h-screen" dir="rtl">
      <a href="#main-content" className="skip-link">رفتن به محتوای اصلی</a>
      <Header onLoginClick={onLoginClick} onAboutClick={() => {}} />
      <main id="main-content" className="avid-about-page pt-24">
        <section className="avid-about-hero container mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="avid-section-kicker">Avid / About</div>
          <div className="max-w-4xl">
            <h1>درباره Avid</h1>
            <p>زیرساخت هوشمند Avid برای تبدیل داده‌های دارویی و علمی به بینش‌های قابل استفاده و تصمیم‌های دقیق‌تر.</p>
            <button type="button" className="avid-about-home-link" onClick={onHomeClick}>بازگشت به صفحه اصلی</button>
          </div>
        </section>
        <AboutAndExperience />
      </main>
      <Footer />
    </div>
  )
}
