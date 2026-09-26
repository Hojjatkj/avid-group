import { motion } from 'motion/react';
import { Building2, Award, Users } from 'lucide-react';

const milestones = [
  {
    id: 1,
    title: 'توسعه زیرساخت پژوهشی ملی',
    client: 'دانشگاه علوم پزشکی تهران',
    year: '۱۴۰۰ - تاکنون',
    description: [
      'طراحی و اجرای سامانه جامع مدیریت پژوهش',
      'بهینه‌سازی دیتاسنتر و ارتقای امنیت سایبری',
      'مشاوره استراتژیک در حوزه سلامت الکترونیک'
    ]
  },
  {
    id: 2,
    title: 'پروژه ملی احراز هویت متمرکز (SSO)',
    client: 'هلدینگ فناپ',
    year: '۱۳۹۸ - ۱۴۰۰',
    description: [
      'معماری سیستم یکپارچه دسترسی برای هزاران کاربر',
      'ادغام پایگاه‌های داده توزیع‌شده',
      'پیاده‌سازی استانداردهای امنیتی بانکی'
    ]
  },
  {
    id: 3,
    title: 'تاسیس واحد نوآوری آموزشی',
    client: 'لرنیتو (Learnitto)',
    year: '۱۳۹۶ - ۱۳۹۸',
    description: [
      'توسعه پلتفرم آموزش تعاملی با ۱۰۰ هزار کاربر',
      'جذب سرمایه مرحله بذری و گسترش تیم فنی',
      'طراحی الگوریتم‌های هوشمند تطبیقی'
    ]
  },
  {
    id: 4,
    title: 'مشاوره تحول دیجیتال',
    client: 'وزارت بهداشت',
    year: '۱۳۹۵ - ۱۳۹۷',
    description: [
      'تدوین نقشه راه پرونده الکترونیک سلامت',
      'استانداردسازی تبادل داده‌های پزشکی'
    ]
  }
];

export const AboutAndExperience = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
             <h4 className="text-teal-600 font-bold mb-2">درباره Avid</h4>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
               ما پلی میان <span className="text-teal-600">نیازهای امروز</span> و <span className="text-blue-600">تکنولوژی فردا</span> هستیم
             </h2>
             <p className="text-slate-600 leading-8 text-lg mb-8 text-justify">
               Avid یک زیرساخت هوشمند برای تحلیل داده‌های دارویی و علمی است که با تکیه بر هوش مصنوعی، تحلیل داده و معماری‌های نوین نرم‌افزاری، مسیر رسیدن از داده به تصمیم را ساده‌تر می‌کند. 
               تخصص ما ترکیب هوش مصنوعی، تحلیل داده و معماری‌های نوین نرم‌افزاری برای حل چالش‌های پیچیده سازمانی است.
               ما باور داریم که فناوری باید در خدمت انسان و توسعه پایدار کسب‌وکارها باشد.
             </p>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                   <Users className="text-teal-600 mb-3" size={32} />
                   <h5 className="font-bold text-slate-900 mb-1">تیم متخصص</h5>
                   <p className="text-sm text-slate-500">متشکل از نخبگان دانشگاهی و صنعتی</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                   <Award className="text-blue-600 mb-3" size={32} />
                   <h5 className="font-bold text-slate-900 mb-1">تضمین کیفیت</h5>
                   <p className="text-sm text-slate-500">رعایت استانداردهای بین‌المللی</p>
                </div>
             </div>
          </motion.div>
          
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-blue-600 rounded-[3rem] transform rotate-3 opacity-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1686676104932-3d7b6bbaef52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" 
               alt="Modern Office" 
               className="relative rounded-[3rem] shadow-2xl w-full object-cover h-[500px]"
             />
          </div>
        </div>

        {/* Timeline Section */}
        <div id="experience" className="bg-slate-50 rounded-[3rem] p-8 md:p-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">مسیر رشد و دستاوردها</h2>
            <p className="text-slate-500">نگاهی به پروژه‌های اثرگذار ما در سال‌های اخیر</p>
          </div>
          
          <div className="relative border-r-2 border-slate-200 pr-8 space-y-12 max-w-4xl mx-auto">
            {milestones.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
              >
                {/* Timeline Dot */}
                <span className="absolute -right-[43px] top-8 w-5 h-5 bg-white border-4 border-teal-500 rounded-full z-10"></span>
                <span className="absolute -right-[43px] top-[42px] w-8 h-[2px] bg-teal-500"></span>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-teal-700 font-medium text-sm">
                          <Building2 size={14} />
                          {exp.client}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full mt-3 md:mt-0 w-fit">
                        {exp.year}
                    </span>
                </div>
                
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {exp.description.map((item, idx) => (
                        <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 bg-teal-400 rounded-full shrink-0"></span>
                            {item}
                        </li>
                    ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
