import { Phone, Mail, MapPin, Linkedin, Instagram, Youtube } from 'lucide-react';
import AvidLogo from '../../components/AvidLogo';

export const Footer = () => {
  return (
    <footer id="site-footer" className="avid-footer" dir="rtl">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-14">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5"><a href="/" aria-label="Avid — صفحه اصلی"><AvidLogo size={42} context="card"/></a><span className="avid-footer-brand">Avid AI</span></div>
            <p className="avid-footer-copy">زیرساخت هوشمند Avid برای جستجو، تحلیل و کشف ارتباطات داده‌های دارویی و علمی.</p>
            <div className="flex gap-2 mt-6">
              <a className="avid-social" href="#" aria-label="LinkedIn"><Linkedin size={17}/></a><a className="avid-social" href="#" aria-label="Instagram"><Instagram size={17}/></a><a className="avid-social" href="#" aria-label="YouTube"><Youtube size={17}/></a>
            </div>
          </div>
          <div className="md:col-span-2"><h3>دسترسی</h3><a href="/">خانه</a><a href="/blog">وبلاگ</a><a href="/about">درباره ما</a></div>
          <div className="md:col-span-2"><h3>ارتباط</h3><span><Phone size={15}/> <b dir="ltr">0912 943 946</b></span><span><Mail size={15}/> <b dir="ltr">avid-aigroup@info.com</b></span><span><MapPin size={15}/> بلوار کشاورز، خیابان قدس، خیابان پورسینا</span></div>
          <div className="md:col-span-3"><div className="avid-footer-module"><span>AVID / MEDICAL INTELLIGENCE</span><strong>From data<br/>to decisions.</strong><span className="text-xs text-white/60">Medical Intelligence · Avid AI</span></div></div>
        </div>
        <div className="avid-footer-bottom"><span>© ۱۴۰۳ Avid AI. تمامی حقوق محفوظ است.</span><div><a href="#">حریم خصوصی</a><a href="#">شرایط استفاده</a><a href="#">دسترسی‌پذیری</a></div></div>
      </div>
    </footer>
  );
};
