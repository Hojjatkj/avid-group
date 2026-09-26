import { Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { getPostBySlug, formatPersianDate } from '../../lib/blog';
import { renderMarkdown } from '../../lib/markdown';

interface BlogPostProps { slug: string; onLoginClick: () => void; onAboutClick: () => void; }

export default function BlogPost({ slug, onLoginClick, onAboutClick }: BlogPostProps) {
  const post = getPostBySlug(slug);
  return (
    <div className="avid-site font-sans antialiased" dir="rtl">
      <Header onLoginClick={onLoginClick} onAboutClick={onAboutClick} />
      <main className="avid-blog-post-page min-h-screen pt-28 pb-24">
        {!post ? <div className="container mx-auto px-4 text-center py-24 avid-muted"><p className="mb-6">این مطلب پیدا نشد.</p><a href="/blog" className="avid-blog-all-link inline-flex items-center gap-2">بازگشت به وبلاگ <ArrowLeft size={16}/></a></div> : (
          <>
            <section className="avid-blog-post-hero container mx-auto px-4 md:px-8">
              <div className="avid-section-kicker"><Sparkles size={14}/> Avid Intelligence / Journal</div>
              <div className="grid lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-8">
                  {post.data.category && <span className="avid-blog-category">{post.data.category}</span>}
                  <h1>{post.data.title}</h1><p>{post.data.excerpt}</p>
                  <div className="avid-blog-meta"><span>{post.data.author || 'تیم Avid AI'}</span><span>{formatPersianDate(post.data.date)}</span>{post.data.readMinutes && <span className="flex items-center gap-1"><Clock size={13}/>{post.data.readMinutes} دقیقه مطالعه</span>}</div>
                </div>
                <div className="lg:col-span-4 avid-post-module"><div className="avid-blog-module-grid"/><span className="avid-blog-module-orb"/><b>AVID<br/>INTELLIGENCE</b></div>
              </div>
            </section>
            <section className="container mx-auto px-4 md:px-8 mt-12">
              <div className="grid lg:grid-cols-12 gap-10">
                <aside className="lg:col-span-3 order-2 lg:order-1"><div className="avid-blog-aside"><span>در این مطلب</span><a href="#article">مطالعه مقاله</a><a href="/blog">سایر مطالب</a><a href="#site-footer">ارتباط با Avid</a></div></aside>
                <article id="article" className="avid-blog-article lg:col-span-9 order-1 lg:order-2">{renderMarkdown(post.content)}</article>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
