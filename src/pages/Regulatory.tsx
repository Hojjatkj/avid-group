import StatusBadge from '../components/StatusBadge'

type SubPage = 'intel' | 'approvals' | 'alerts'

const approvals = [
  { drug: 'استامینوفن', nameEn: 'Acetaminophen', fda: 'OTC Approved', ema: 'Approved', year: 1955, indication: 'درد و تب', status: 'approved' },
  { drug: 'وارفارین', nameEn: 'Warfarin', fda: 'Prescription', ema: 'Approved', year: 1954, indication: 'ضد انعقاد', status: 'approved' },
  { drug: 'مورفین', nameEn: 'Morphine', fda: 'Schedule II', ema: 'Controlled', year: 1941, indication: 'درد شدید', status: 'controlled' },
  { drug: 'متوتروکسات', nameEn: 'Methotrexate', fda: 'BBW', ema: 'Specialist Rx', year: 1953, indication: 'سرطان / روماتولوژی', status: 'warning' },
  { drug: 'دیگوکسین', nameEn: 'Digoxin', fda: 'Prescription', ema: 'Approved', year: 1954, indication: 'نارسایی قلبی', status: 'approved' },
  { drug: 'لیتیم', nameEn: 'Lithium', fda: 'Prescription', ema: 'Approved', year: 1970, indication: 'اختلال دوقطبی', status: 'approved' },
]

const alerts = [
  { drug: 'متوتروکسات', agency: 'FDA', type: 'safety', title: 'هشدار تداخل با NSAIDs', desc: 'احتمال افزایش سمیت متوتروکسات با مصرف همزمان NSAID ها گزارش شده است.', date: '۱۴ مرداد ۱۴۰۳', severity: 'critical' },
  { drug: 'وارفارین', agency: 'EMA', type: 'update', title: 'بروزرسانی پروتکل INR', desc: 'دامنه هدف INR برای بیماران با دریچه قلبی مصنوعی بازنگری شد.', date: '۱۲ مرداد ۱۴۰۳', severity: 'warning' },
  { drug: 'دیگوکسین', agency: 'EMA', type: 'review', title: 'بازنگری دامنه درمانی', desc: 'EMA بازنگری در سطح درمانی توصیه‌شده دیگوکسین را آغاز کرده است.', date: '۱۱ مرداد ۱۴۰۳', severity: 'info' },
  { drug: 'مورفین', agency: 'FDA', type: 'safety', title: 'هشدار تداخل با بنزودیازپین‌ها', desc: 'مصرف همزمان با افزایش خطر افسردگی تنفسی همراه است.', date: '۸ مرداد ۱۴۰۳', severity: 'warning' },
  { drug: 'لیتیم', agency: 'FDA', type: 'update', title: 'راهنمای جدید مانیتورینگ کلیوی', desc: 'توصیه‌های جدید برای مانیتورینگ عملکرد کلیوی در مصرف دراز‌مدت.', date: '۵ مرداد ۱۴۰۳', severity: 'info' },
]

const severityColors: Record<string, string> = {
  critical: 'var(--pharma-danger)',
  warning: 'var(--pharma-warning)',
  info: 'var(--pharma-cyan-light)',
}
const severityLabels: Record<string, string> = {
  critical: 'بحرانی',
  warning: 'هشدار',
  info: 'اطلاعاتی',
}

const statusColors: Record<string, string> = {
  approved: 'var(--pharma-success)',
  controlled: 'var(--pharma-warning)',
  warning: 'var(--pharma-danger)',
}
const statusLabels: Record<string, string> = {
  approved: 'تأیید شده',
  controlled: 'کنترل‌شده',
  warning: 'هشدار',
}

export default function Regulatory({ subPage }: { subPage: SubPage }) {
  if (subPage === 'alerts') {
    return (
      <div className="p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {['همه', 'critical', 'warning', 'info'].map((s) => (
              <button key={s} className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--pharma-bg-card)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }}>
                {s === 'همه' ? 'همه' : severityLabels[s]}
              </button>
            ))}
          </div>
          <div className="font-semibold" style={{ color: 'var(--pharma-text)' }}>هشدارهای رگولاتوری</div>
        </div>
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div key={i} className="card-pharma p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge label={severityLabels[a.severity]} color={severityColors[a.severity]} />
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)' }}>{a.agency}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--pharma-text)' }}>{a.title}</div>
                  <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{a.drug} · {a.date}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-right leading-6" style={{ color: 'var(--pharma-text-2)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (subPage === 'approvals') {
    return (
      <div className="p-6 animate-fade-in">
        <div className="card-pharma overflow-x-auto">
          <table className="w-full" style={{ minWidth: 680 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pharma-border)', background: 'var(--pharma-bg-elevated)' }}>
                {['وضعیت', 'EMA', 'FDA', 'سال', 'موارد مصرف', 'نام دارو'].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold" style={{ color: 'var(--pharma-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvals.map((a, i) => (
                <tr key={i} className="hover:bg-[var(--pharma-bg-hover)] transition-colors"
                  style={{ borderBottom: i < approvals.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}>
                  <td className="px-4 py-3">
                    <StatusBadge label={statusLabels[a.status]} color={statusColors[a.status]} />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-text-2)' }}>{a.ema}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-text-2)' }}>{a.fda}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{a.year}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--pharma-text-2)' }}>{a.indication}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-sm" style={{ color: 'var(--pharma-text)' }}>{a.drug}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{a.nameEn}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Intel page
  return (
    <div className="p-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {[
          { label: 'تأییدیه‌های فعال', value: '۱,۸۴۳', color: 'var(--pharma-success)', icon: '✓' },
          { label: 'در حال بررسی', value: '۱۲۴', color: 'var(--pharma-cyan-light)', icon: '◈' },
          { label: 'هشدارهای فعال', value: '۲۳', color: 'var(--pharma-danger)', icon: '⚠' },
        ].map((k) => (
          <div key={k.label} className="card-pharma p-5 text-center">
            <div className="text-3xl font-bold font-mono mb-2" style={{ color: k.color }}>{k.value}</div>
            <div className="text-sm" style={{ color: 'var(--pharma-text)' }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>آخرین هشدارها</div>
          {alerts.slice(0, 3).map((a, i) => (
            <div key={i} className="flex items-center gap-2 py-2 justify-end" style={{ borderBottom: i < 2 ? '1px solid var(--pharma-border)' : 'none' }}>
              <div className="text-right">
                <div className="text-xs font-medium" style={{ color: 'var(--pharma-text)' }}>{a.title}</div>
                <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{a.drug} · {a.agency}</div>
              </div>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: severityColors[a.severity] }} />
            </div>
          ))}
        </div>
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>وضعیت رگولاتوری داروها</div>
          {approvals.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < approvals.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}>
              <StatusBadge label={statusLabels[a.status]} color={statusColors[a.status]} />
              <span className="text-sm font-medium" style={{ color: 'var(--pharma-text)' }}>{a.drug}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
