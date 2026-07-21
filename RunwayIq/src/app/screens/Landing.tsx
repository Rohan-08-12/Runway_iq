import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import {
  Upload, LineChart, SlidersHorizontal, MessageCircle,
  ArrowRight, Check, Zap, FileDown, Menu, X, TrendingDown, AlertTriangle, HelpCircle,
} from 'lucide-react'

// ─── Shared bits ──────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
        <span className="text-white text-[11px] font-bold tracking-tight">RIQ</span>
      </div>
      <span className="text-white text-[15px] font-semibold tracking-tight">RunwayIQ</span>
    </div>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] font-semibold uppercase tracking-[0.14em] mb-5">
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Landing() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const goApp = () => navigate(session ? '/' : '/login')
  const goLogin = () => navigate('/login')

  return (
    <div className="min-h-screen bg-[#060609] text-zinc-300 antialiased" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── 1. NAVBAR ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#060609]/80 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <Logo />
          </a>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-zinc-400">
            <a href="#problem" className="hover:text-white transition-colors">Why RunwayIQ</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={goLogin} className="text-[13px] text-zinc-300 hover:text-white px-3 py-2 transition-colors">
              Sign in
            </button>
            <button
              onClick={goApp}
              className="text-[13px] font-semibold text-white px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
            >
              Try Free
            </button>
          </div>

          <button className="md:hidden text-zinc-300 p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0A0A10] px-5 py-4 space-y-3">
            {[['#problem', 'Why RunwayIQ'], ['#features', 'Features'], ['#how', 'How it works'], ['#pricing', 'Pricing']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block text-[14px] text-zinc-400 hover:text-white py-1">
                {label}
              </a>
            ))}
            <div className="pt-3 flex gap-3 border-t border-white/[0.06]">
              <button onClick={goLogin} className="flex-1 text-[13px] text-zinc-200 border border-white/10 rounded-lg py-2.5">Sign in</button>
              <button onClick={goApp} className="flex-1 text-[13px] font-semibold text-white rounded-lg py-2.5 bg-indigo-600">Try Free</button>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-36 pb-24 px-5">
        {/* Ambient glow + grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-indigo-600/20 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[12px] text-zinc-300 mb-8">
            <Zap size={12} className="text-indigo-400" />
            CSV in. CFO-grade analysis out — in seconds.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.06] tracking-[-0.03em] max-w-4xl mx-auto">
            Know your runway.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Before it runs out.
            </span>
          </h1>

          <p className="mt-6 text-[16px] sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            RunwayIQ is your AI-powered virtual CFO. Upload your transactions and a
            3-agent Claude pipeline delivers burn rate, runway, forecasts, and a
            board-ready action plan — no accountant required.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={goApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] font-semibold transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Try Free
              <ArrowRight size={16} />
            </button>
            <a
              href="#how"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-200 text-[15px] font-medium transition-colors"
            >
              See how it works
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-zinc-500">
            <span>No credit card required</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block" />
            <span>Free plan forever</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block" />
            <span>Your data stays yours</span>
          </div>

          {/* Product glimpse */}
          <div className="relative mt-16 max-w-3xl mx-auto">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/40 to-transparent" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0B0B12] p-5 sm:p-6 text-left shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-[11px] text-zinc-600 font-mono">runwayiq · live analysis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Runway', value: '8.7 mo', tone: 'text-emerald-400', sub: 'Healthy' },
                  { label: 'Burn rate', value: '$115K', tone: 'text-rose-400', sub: '+12% MoM' },
                  { label: 'Revenue', value: '$1.3M', tone: 'text-white', sub: '+7.4% MoM' },
                  { label: 'Risk score', value: '18/100', tone: 'text-emerald-400', sub: 'Low risk' },
                ].map(kpi => (
                  <div key={kpi.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">{kpi.label}</div>
                    <div className={`text-lg sm:text-xl font-bold ${kpi.tone}`}>{kpi.value}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4">
                <div className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold mb-1.5">AI CFO · Recommended action</div>
                <p className="text-[13px] text-zinc-300 leading-relaxed">
                  Cut OPEX by 20% and secure client prepayments to extend runway from
                  <span className="text-white font-semibold"> 2.6 → 4.4 months</span> without external funding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM ────────────────────────────────────────────────────── */}
      <section id="problem" className="px-5 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <SectionEyebrow>The problem</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Stop guessing your runway.
            </h2>
            <p className="mt-4 text-[15px] text-zinc-400 leading-relaxed">
              Most founders find out they're in trouble when it's already too late to fix it.
              Spreadsheets go stale, accountants report on the past, and "we're probably fine"
              isn't a financial strategy.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <HelpCircle size={18} className="text-amber-400" />,
                title: '"How many months do we have left?"',
                desc: 'If answering that takes you more than ten seconds, you don\'t have visibility — you have vibes.',
              },
              {
                icon: <TrendingDown size={18} className="text-rose-400" />,
                title: 'Burn creeps up silently',
                desc: 'A few new tools, one hire, a price hike from a vendor — burn grows 10% a month and nobody notices until the runway chart bends.',
              },
              {
                icon: <AlertTriangle size={18} className="text-indigo-400" />,
                title: 'Decisions made blind',
                desc: 'Hiring, pricing, fundraising timing — the biggest calls get made without modeling what they do to your cash.',
              },
            ].map(p => (
              <div key={p.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.12] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2 leading-snug">{p.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="px-5 py-24 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <SectionEyebrow>Features</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Everything a CFO would tell you.
              <br className="hidden sm:block" />
              <span className="text-zinc-500"> None of the retainer.</span>
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: <LineChart size={20} />,
                iconBg: 'from-indigo-500 to-blue-600',
                title: 'Live metrics & 3-month forecast',
                desc: 'Burn rate, runway, gross margin, net burn and more — computed from raw transactions on every upload, then projected forward with confidence bands and cash-out risk flags.',
              },
              {
                icon: <SlidersHorizontal size={20} />,
                iconBg: 'from-emerald-500 to-teal-600',
                title: 'What-if simulator',
                desc: 'Drag sliders to model OPEX cuts, COGS optimization, revenue targets, and cash infusions. Watch runway and risk score recalculate live before you commit to anything.',
              },
              {
                icon: <MessageCircle size={20} />,
                iconBg: 'from-violet-500 to-purple-600',
                title: 'Ask Your CFO chat',
                desc: 'A Claude-powered CFO that knows your live numbers. Ask "can we afford another engineer?" and get an answer grounded in your actual burn — not generic advice.',
              },
              {
                icon: <FileDown size={20} />,
                iconBg: 'from-rose-500 to-orange-500',
                title: 'Board-ready PDF reports',
                desc: 'A 3-agent AI pipeline — Analyst, Strategist, CFO Writer — produces a risk-scored report with three prioritized actions. Export to PDF and send it to your board as-is.',
              },
            ].map(f => (
              <div key={f.title} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-[17px] font-semibold text-white mb-2.5">{f.title}</h3>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how" className="px-5 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              From CSV to clarity in three steps
            </h2>
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-4 sm:gap-6 relative">
            {/* connector line (desktop) */}
            <div className="hidden sm:block absolute top-[27px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {[
              {
                n: '01',
                icon: <Upload size={18} />,
                title: 'Upload your CSV',
                desc: 'Export transactions from your bank or accounting tool and drop them in. RunwayIQ parses, validates, and categorizes every row automatically.',
              },
              {
                n: '02',
                icon: <Zap size={18} />,
                title: 'AI runs the numbers',
                desc: 'Metrics compute instantly; then three Claude agents analyze problems, retrieve proven financial playbooks, and write your CFO report.',
              },
              {
                n: '03',
                icon: <ArrowRight size={18} />,
                title: 'Act with confidence',
                desc: 'Get your runway, risk score, forecast, and three prioritized actions. Simulate scenarios, chat with your CFO, export the PDF.',
              },
            ].map(s => (
              <div key={s.n} className="relative text-center sm:text-left">
                <div className="relative z-10 mx-auto sm:mx-0 w-[54px] h-[54px] rounded-2xl bg-[#0D0D15] border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/50">
                  {s.icon}
                </div>
                <div className="mt-5 text-[11px] font-mono font-bold text-indigo-400 tracking-widest">{s.n}</div>
                <h3 className="mt-1.5 text-[16px] font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-[13px] text-zinc-500 leading-relaxed max-w-xs mx-auto sm:mx-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-5 py-24 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto">
            <SectionEyebrow>Pricing</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Start free. Upgrade when you're ready.
            </h2>
            <p className="mt-4 text-[14px] text-zinc-500">No credit card required to start.</p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col">
              <div className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Free</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-[13px] text-zinc-500">/ month</span>
              </div>
              <p className="mt-3 text-[13px] text-zinc-500 leading-relaxed">
                For founders who want a real answer to "how long do we have?"
              </p>
              <div className="my-6 h-px bg-white/[0.06]" />
              <ul className="space-y-3 flex-1">
                {['5 AI CFO reports / hour', 'CSV upload up to 5,000 rows', 'All 10 live financial metrics', 'Risk score + 3-month forecast', 'What-if simulator'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-zinc-400">
                    <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={goApp}
                className="mt-8 w-full py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[14px] font-semibold transition-colors"
              >
                Try Free
              </button>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.08] to-white/[0.02] p-8 flex flex-col shadow-2xl shadow-indigo-950/40">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-indigo-600/40">
                Most popular
              </div>
              <div className="text-[12px] font-bold uppercase tracking-widest text-indigo-300">Pro</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-[13px] text-zinc-500">/ month</span>
              </div>
              <p className="mt-3 text-[13px] text-zinc-500 leading-relaxed">
                For operators who run their business on the numbers.
              </p>
              <div className="my-6 h-px bg-white/[0.06]" />
              <ul className="space-y-3 flex-1">
                {['Unlimited AI CFO reports', 'Everything in Free', 'Ask Your CFO chat with saved history', 'Board-ready PDF export', 'Priority support'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                    <Check size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@runwayiq.app?subject=RunwayIQ%20Pro"
                className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[14px] font-semibold transition-colors text-center shadow-lg shadow-indigo-600/30"
              >
                Get Pro
              </a>
              <p className="mt-3 text-center text-[11px] text-zinc-600">Self-serve checkout coming soon — email us to upgrade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="px-5 py-28 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/25 blur-[140px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Your runway won't
            <br />
            check itself.
          </h2>
          <p className="mt-5 text-[15px] text-zinc-400 max-w-md mx-auto">
            Upload your first CSV and get a full CFO analysis in seconds. Free, no card, no excuses.
          </p>
          <button
            onClick={goApp}
            className="mt-9 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] font-semibold transition-all shadow-xl shadow-indigo-600/40 hover:-translate-y-0.5"
          >
            Try Free
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 8. FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-5 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-[1.5fr_1fr_1fr] gap-10">
            <div>
              <Logo />
              <p className="mt-4 text-[12px] text-zinc-600 leading-relaxed max-w-[240px]">
                AI-powered financial intelligence for founders, freelancers, and small businesses.
                Built at Hack Canada 2026.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Product</div>
              <div className="space-y-2.5">
                <a href="#features" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">Features</a>
                <a href="#how" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">How it works</a>
                <a href="#pricing" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">Pricing</a>
                <a href="#" onClick={e => { e.preventDefault(); goApp() }} className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">Open the app</a>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Resources</div>
              <div className="space-y-2.5">
                <a href="https://github.com/Rohan-08-12/Runway_iq#readme" target="_blank" rel="noreferrer" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">Documentation</a>
                <a href="https://github.com/Rohan-08-12/Runway_iq/blob/master/backend/README.md#api-endpoints" target="_blank" rel="noreferrer" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">API reference</a>
                <a href="https://github.com/Rohan-08-12/Runway_iq" target="_blank" rel="noreferrer" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">GitHub</a>
                <a href="mailto:hello@runwayiq.app" className="block text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-700">
            <span>© 2026 RunwayIQ. Built at Hack Canada 2026.</span>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
