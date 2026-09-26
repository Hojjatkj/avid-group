import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { getLatestPosts, formatPersianDate } from '../../lib/blog';

export const BlogSection = () => {
  const posts = getLatestPosts(3);
  const sectionRef = useRef<HTMLElement>(null);
  // Ties the section's own entrance to how far it has scrolled up from the
  // bottom of the viewport, so it gradually fades/slides into place over
  // the same scroll distance instead of just snapping into view the moment
  // the hero's sticky pin lets go — the "خشک" hand-off the section had.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 100%', 'start 55%'],
  })
  const sectionOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const sectionY = useTransform(scrollYProgress, [0, 1], [56, 0])

  if (posts.length === 0) return null;
  const featured = posts[0];
  const secondary = posts.slice(1);

  return (
    <motion.section
      id="blog"
      ref={sectionRef}
      className="avid-blog-section py-24"
      style={{ opacity: sectionOpacity, y: sectionY }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="avid-section-kicker"><Sparkles size={14} /> Avid Intelligence / Journal</div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h2 className="avid-section-title text-4xl md:text-5xl font-bold mb-3">وبلاگ Avid</h2>
            <p className="avid-section-subtitle text-base md:text-lg max-w-2xl">تحلیل‌ها، یافته‌ها و روایت‌های علمی درباره داده، دارو و هوش مصنوعی.</p>
          </div>
          <a href="/blog" className="avid-blog-all-link inline-flex items-center gap-2 font-semibold">همه مطالب <ArrowLeft size={16} /></a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.a key={featured.data.slug} href={`/blog/${featured.data.slug}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="avid-blog-feature lg:col-span-7 group">
            <div className="avid-blog-module">
              <div className="avid-blog-module-grid" />
              <span className="avid-blog-module-orb" />
              <div className="avid-blog-module-label">AVID / INSIGHT</div>
              <div className="avid-blog-feature-content">
                {featured.data.category && <span className="avid-blog-category">{featured.data.category}</span>}
                <h3>{featured.data.title}</h3>
                <p>{featured.data.excerpt}</p>
                <div className="avid-blog-meta"><span>{formatPersianDate(featured.data.date)}</span>{featured.data.readMinutes && <span className="flex items-center gap-1"><Clock size={13} />{featured.data.readMinutes} دقیقه مطالعه</span>}</div>
                <span className="avid-blog-read">ادامه مطلب <ArrowLeft size={16} /></span>
              </div>
            </div>
          </motion.a>

          <div className="lg:col-span-5 grid gap-6">
            {secondary.map((post, idx) => (
              <motion.a key={post.data.slug} href={`/blog/${post.data.slug}`} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * .08 }} className="avid-blog-row group">
                <div className="avid-blog-row-mark">{String(idx + 2).padStart(2, '0')}</div>
                <div className="min-w-0 flex-1">
                  {post.data.category && <span className="avid-blog-category">{post.data.category}</span>}
                  <h3>{post.data.title}</h3>
                  <p>{post.data.excerpt}</p>
                  <div className="avid-blog-meta"><span>{formatPersianDate(post.data.date)}</span>{post.data.readMinutes && <span>{post.data.readMinutes} دقیقه</span>}</div>
                </div>
                <ArrowLeft className="avid-blog-row-arrow" size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
