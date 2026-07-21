import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

// Shared shell for /terms and /privacy — plain-language legal pages
// styled to match the dark landing page.

function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060609] text-zinc-300 antialiased" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-2xl mx-auto px-5 py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors mb-10">
          <ArrowLeft size={14} />
          Back to RunwayIQ
        </Link>

        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="mt-2 text-[13px] text-zinc-600">Last updated {updated}</p>

        <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-zinc-400">
          {children}
        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.06] text-[12px] text-zinc-600">
          Questions? Email <a href="mailto:hello@runwayiq.app" className="text-indigo-400 hover:text-indigo-300">hello@runwayiq.app</a>.
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[16px] font-semibold text-white mb-2.5">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

export function Terms() {
  return (
    <LegalShell title="Terms of Service" updated="July 2026">
      <p>
        RunwayIQ is an early-stage product, currently offered free of charge while we're in
        beta. By creating an account or using RunwayIQ, you agree to these terms.
      </p>

      <Section title="What RunwayIQ does">
        <p>
          You upload transaction data (via CSV) and RunwayIQ computes financial metrics,
          generates an AI-written report using Anthropic's Claude API, and lets you chat with
          an AI assistant about your numbers. Everything you see is generated from the data
          you provide — RunwayIQ does not connect to your bank or accounting software.
        </p>
      </Section>

      <Section title="Not financial advice">
        <p>
          RunwayIQ is a software tool, not a licensed financial advisor, accountant, or CFO.
          Metrics, forecasts, risk scores, and AI-generated recommendations are informational
          only and may be inaccurate or incomplete. Don't make financial decisions based solely
          on RunwayIQ's output — verify anything material with a qualified professional.
        </p>
      </Section>

      <Section title="Your data, your account">
        <p>
          You're responsible for the accuracy of the data you upload and for keeping your
          account credentials secure. You can delete your business and all associated data at
          any time from Settings → Danger Zone — this permanently removes your transactions,
          reports, and chat history.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>
          Don't use RunwayIQ to upload data you don't have the right to use, to attempt to
          access another user's data, or to abuse the service (e.g. scripting excessive
          requests against the API or AI features).
        </p>
      </Section>

      <Section title="Beta software, no uptime guarantee">
        <p>
          RunwayIQ is actively developed and offered as-is, without warranty of any kind. We
          don't guarantee uninterrupted availability, and features may change or be removed as
          the product evolves.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms as the product changes. Material changes will be reflected
          by updating the date at the top of this page.
        </p>
      </Section>
    </LegalShell>
  )
}

export function Privacy() {
  return (
    <LegalShell title="Privacy Policy" updated="July 2026">
      <p>
        This page explains what data RunwayIQ collects, why, and what happens to it. We built
        RunwayIQ to be straightforward about this since you're trusting it with real financial
        data.
      </p>

      <Section title="What we collect">
        <ul className="list-disc list-inside space-y-1.5">
          <li>Your email address, used only for authentication (via Supabase Auth)</li>
          <li>The business name and cash balance you provide</li>
          <li>Transaction data you upload via CSV — dates, amounts, categories, descriptions, and merchant names</li>
          <li>Messages you send to the AI CFO chat, and the AI-generated reports produced from your data</li>
        </ul>
      </Section>

      <Section title="Where it's stored">
        <p>
          Your data lives in a Postgres database hosted by Supabase, encrypted at rest and in
          transit. Every table is scoped by your account — one user's business, transactions,
          and reports are never visible to another user. We don't use third-party analytics or
          tracking cookies; your session is stored locally in your browser via Supabase's auth
          client, not shared with ad networks or trackers.
        </p>
      </Section>

      <Section title="Third parties we use">
        <p>
          To generate reports and power the AI chat, your financial data (not your raw CSV
          file, just the parsed numbers and context) is sent to Anthropic's Claude API for
          processing. Authentication and data storage run on Supabase. Hosting runs on Railway
          (backend) and Vercel (frontend). We don't sell your data to anyone, and we don't share
          it with advertisers.
        </p>
      </Section>

      <Section title="Uploaded files">
        <p>
          Your CSV file itself is never stored — it's parsed on upload, the transaction rows
          are saved to the database, and the original file is deleted immediately afterward.
        </p>
      </Section>

      <Section title="Deleting your data">
        <p>
          You can permanently delete your business and everything tied to it — transactions,
          computed metrics, AI reports, and chat history — at any time from Settings → Danger
          Zone. This is irreversible and takes effect immediately.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If how we handle data changes materially, we'll update this page and the date above.
        </p>
      </Section>
    </LegalShell>
  )
}
