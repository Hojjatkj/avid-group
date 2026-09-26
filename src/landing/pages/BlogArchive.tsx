import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { getAllPosts, formatPersianDate } from '../../lib/blog';

interface BlogArchiveProps { onLoginClick: () => void; onAboutClick: () => void; }

export default function BlogArchive({ onLoginClick, onAboutClick }: BlogArchiveProps) {
  const posts = getAllPosts();
  const featured = posts[0];
  return (
    <div className="avid-site font-sans antialiased" dir="rtl">
      <a href="#main-content" className="skip-link">رفتن به محتوای اصلی</a>
      <Header onLoginClick={onLoginClick} onAboutClick={onAboutClick} />
      <main id="main-content" className="avid-blog-page min-h-screen pt-28 pb-24">
        <section className="avid-blog-hero container mx-auto px-4 md:px-8">
          <div className="avid-section-kicker"><Sparkles size={14} /> Avid Intelligence / Journal</div>
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <h1>دانش، داده و تصمیم‌های هوشمند</h1>
              <p>مرجع محتوایی Avid برای روایت پژوهش، تحلیل داده‌های دارویی، هوش مصنوعی و بینش‌های علمی.</p>
            </div>
            <div className="lg:col-span-4 avid-blog-stats"><span><b>{posts.length}</b> مطلب</span><span><b>AI</b> Drug Intelligence</span></div>
          </div>
          <div className="avid-blog-quicklinks">{['هوشمندی دارویی','هوش مصنوعی','پژوهش','رگولاتوری'].map(x => <span key={x}>{x}</span>)}</div>
        </section>

        {posts.length === 0 ? <div className="container mx-auto px-4 text-center py-24 avid-muted">هنوز مطلبی منتشر نشده است.</div> : (
          <section className="container mx-auto px-4 md:px-8 mt-12">
            <div className="grid lg:grid-cols-12 gap-7">
              {featured && <a href={`/blog/${featured.data.slug}`} className="avid-blog-archive-feature lg:col-span-7">
                <div className="avid-blog-archive-visual"><div className="avid-blog-module-grid" /><span className="avid-blog-module-orb" /><b>AVID / FEATURED</b></div>
                <div className="p-7">
                  {featured.data.category && <span className="avid-blog-category">{featured.data.category}</span>}
                  <h2>{featured.data.title}</h2><p>{featured.data.excerpt}</p>
                  <div className="avid-blog-meta"><span>{formatPersianDate(featured.data.date)}</span>{featured.data.readMinutes && <span>{featured.data.readMinutes} دقیقه مطالعه</span>}</div>
                </div>
              </a>}
              <div className="lg:col-span-5 grid gap-4">
                {posts.slice(1).map(post => <a key={post.data.slug} href={`/blog/${post.data.slug}`} className="avid-blog-list-card">
                  <div><span className="avid-blog-category">{post.data.category || 'Avid'}</span><h3>{post.data.title}</h3><p>{post.data.excerpt}</p><div className="avid-blog-meta"><span>{formatPersianDate(post.data.date)}</span>{post.data.readMinutes && <span className="flex items-center gap-1"><Clock size={13}/>{post.data.readMinutes} دقیقه</span>}</div></div><ArrowLeft size={18}/></a>)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
