import StatusBadge from '../components/StatusBadge'

type AdminSub = 'data-sources' | 'ai-models' | 'users' | 'audit-logs'

const dataSources = [
  { name: 'PubMed / MEDLINE', type: 'مقالات علمی', records: '35M+', status: 'active', lastSync: '۱۴ مرداد ۱۴۰۳', freq: 'روزانه' },
  { name: 'ClinicalTrials.gov', type: 'کارآزمایی بالینی', records: '480K+', status: 'active', lastSync: '۱۴ مرداد ۱۴۰۳', freq: 'روزانه' },
  { name: 'FDA Drug Database', type: 'رگولاتوری', records: '22K+', status: 'active', lastSync: '۱۳ مرداد ۱۴۰۳', freq: 'هفتگی' },
  { name: 'EMA Medicines Database', type: 'رگولاتوری', records: '18K+', status: 'active', lastSync: '۱۲ مرداد ۱۴۰۳', freq: 'هفتگی' },
  { name: 'DrugBank', type: 'داده دارویی', records: '14K+', status: 'active', lastSync: '۱۰ مرداد ۱۴۰۳', freq: 'ماهانه' },
  { name: 'ChEMBL', type: 'داده شیمیایی', records: '2.3M+', status: 'syncing', lastSync: 'در حال همگام‌سازی', freq: 'ماهانه' },
]

const aiModels = [
  { name: 'Avid-LLM v3', type: 'LLM', params: '7B', status: 'active', accuracy: 94, deployed: '۱ مرداد ۱۴۰۳' },
  { name: 'EfficacyNet-2', type: 'Deep Learning', params: '340M', status: 'active', accuracy: 91, deployed: '۱۵ تیر ۱۴۰۳' },
  { name: 'ToxPredict-AI', type: 'ML', params: '45M', status: 'active', accuracy: 88, deployed: '۱ خرداد ۱۴۰۳' },
  { name: 'DrugAssess v2', type: 'Ensemble', params: 'Multi', status: 'active', accuracy: 92, deployed: '۱۰ اردیبهشت ۱۴۰۳' },
  { name: 'ClinicalBERT-P', type: 'BERT', params: '110M', status: 'training', accuracy: 85, deployed: 'در حال آموزش' },
]

const users = [
  { name: 'علی محمدی', email: 'a.mohammadi@avid.ir', role: 'محقق ارشد', status: 'active', lastLogin: '۱۴ مرداد ۱۴۰۳' },
  { name: 'فاطمه رضایی', email: 'f.rezaei@avid.ir', role: 'مدیر سیستم', status: 'active', lastLogin: '۱۴ مرداد ۱۴۰۳' },
  { name: 'محمد حسینی', email: 'm.hosseini@avid.ir', role: 'محقق', status: 'active', lastLogin: '۱۳ مرداد ۱۴۰۳' },
  { name: 'زهرا کریمی', email: 'z.karimi@avid.ir', role: 'کارشناس رگولاتوری', status: 'inactive', lastLogin: '۱ مرداد ۱۴۰۳' },
]

const auditLogs = [
  { action: 'ورود به سیستم', user: 'علی محمدی', ip: '192.168.1.45', time: '۱۴:۳۲', level: 'info' },
  { action: 'تحلیل استامینوفن', user: 'علی محمدی', ip: '192.168.1.45', time: '۱۴:۳۵', level: 'info' },
  { action: 'صدور هشدار رگولاتوری', user: 'سیستم', ip: 'internal', time: '۱۳:۱۵', level: 'warning' },
  { action: 'بروزرسانی پایگاه داده', user: 'سیستم', ip: 'internal', time: '۰۶:۰۰', level: 'info' },
  { action: 'خطای اتصال به EMA', user: 'سیستم', ip: 'internal', time: '۰۵:۴۵', level: 'error' },
]

export default function AdminPage({ subPage }: { subPage: AdminSub }) {
  const Head = ({ children }: { children: React.ReactNode }) => (
    <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>{children}</div>
  )

  if (subPage === 'data-sources') return (
    <div className="p-6 animate-fade-in">
      <div className="card-pharma overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--pharma-border)', background: 'var(--pharma-bg-elevated)' }}>
          <Head>منابع داده</Head>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pharma-border)', background: 'var(--pharma-bg-elevated)' }}>
              {['وضعیت', 'آخرین همگام‌سازی', 'تناوب', 'رکوردها', 'نوع', 'منبع'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-right text-xs font-semibold" style={{ color: 'var(--pharma-text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSources.map((s, i) => (
              <tr key={i} className="hover:bg-[var(--pharma-bg-hover)] transition-colors" style={{ borderBottom: i < dataSources.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}>
                <td className="px-4 py-3"><StatusBadge label={s.status === 'active' ? 'فعال' : 'همگام'} color={s.status === 'active' ? 'var(--pharma-success)' : 'var(--pharma-warning)'} /></td>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{s.lastSync}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--pharma-text-2)' }}>{s.freq}</td>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-cyan)' }}>{s.records}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--pharma-text-2)' }}>{s.type}</td>
                <td className="px-4 py-3 text-right font-medium text-sm" style={{ color: 'var(--pharma-text)' }}>{s.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  if (subPage === 'ai-models') return (
    <div className="p-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiModels.map((m) => (
          <div key={m.name} className="card-pharma p-4">
            <div className="flex items-start justify-between mb-3">
              <StatusBadge label={m.status === 'active' ? 'فعال' : 'در حال آموزش'} color={m.status === 'active' ? 'var(--pharma-success)' : 'var(--pharma-warning)'} />
              <div className="text-right">
                <div className="font-semibold text-sm" style={{ color: 'var(--pharma-text)' }}>{m.name}</div>
                <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{m.type} · {m.params}</div>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="font-mono" style={{ color: 'var(--pharma-cyan)' }}>{m.accuracy}% accuracy</span>
              <span style={{ color: 'var(--pharma-text-muted)' }}>{m.deployed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (subPage === 'users') return (
    <div className="p-6 animate-fade-in">
      <div className="card-pharma overflow-x-auto">
        <table className="w-full" style={{ minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pharma-border)', background: 'var(--pharma-bg-elevated)' }}>
              {['وضعیت', 'آخرین ورود', 'نقش', 'ایمیل', 'نام'].map((h) => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold" style={{ color: 'var(--pharma-text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-[var(--pharma-bg-hover)] transition-colors" style={{ borderBottom: i < users.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}>
                <td className="px-4 py-3"><StatusBadge label={u.status === 'active' ? 'فعال' : 'غیرفعال'} color={u.status === 'active' ? 'var(--pharma-success)' : 'var(--pharma-text-muted)'} /></td>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{u.lastLogin}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--pharma-text-2)' }}>{u.role}</td>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{u.email}</td>
                <td className="px-4 py-3 text-right font-medium text-sm" style={{ color: 'var(--pharma-text)' }}>{u.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // audit-logs
  return (
    <div className="p-6 animate-fade-in">
      <div className="space-y-2">
        {auditLogs.map((l, i) => (
          <div key={i} className="card-pharma px-4 py-3 flex items-center justify-between">
            <StatusBadge
              label={l.level === 'info' ? 'اطلاعاتی' : l.level === 'warning' ? 'هشدار' : 'خطا'}
              color={l.level === 'info' ? 'var(--pharma-cyan-light)' : l.level === 'warning' ? 'var(--pharma-warning)' : 'var(--pharma-danger)'}
            />
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
              <span className="font-mono">{l.ip}</span>
              <span>{l.time}</span>
              <span style={{ color: 'var(--pharma-text-2)' }}>{l.user}</span>
              <span className="font-medium" style={{ color: 'var(--pharma-text)' }}>{l.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
