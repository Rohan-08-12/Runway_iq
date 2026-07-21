import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { LogIn, UserPlus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const MIN_PASSWORD_LENGTH = 6

export function Login() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const accent = mode === 'signin' ? '#1A56DB' : '#059669'

  // Navigate only once AuthContext's session actually updates — navigating
  // right after signIn/signUp resolves can race the context's async
  // onAuthStateChange subscription and bounce back to the landing page
  // before it registers as signed in.
  useEffect(() => {
    if (session) navigate('/', { replace: true })
  }, [session, navigate])

  function switchMode(next: 'signin' | 'signup') {
    setMode(next)
    setError(null)
    setInfo(null)
    setConfirmPassword('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (mode === 'signup') {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // useEffect above navigates once the session updates
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (!data.session) {
          // Email confirmation required — no session yet, nothing to redirect to
          setInfo('Check your email to confirm your account, then sign in.')
        }
        // if a session came back immediately, useEffect handles navigation
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-[360px]">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] mb-3 transition-colors"
            style={{ backgroundColor: accent }}
          >
            <span className="text-white text-[16px]" style={{ fontWeight: 700 }}>R</span>
          </div>
          <div className="text-[20px]" style={{ color: '#111827', fontWeight: 600 }}>
            RunwayIQ
          </div>
          <div className="text-[12px] mt-1" style={{ color: '#9CA3AF' }}>
            AI-powered financial intelligence
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex rounded-lg border border-[#E5E7EB] p-1 mb-4" style={{ backgroundColor: '#F3F4F6' }}>
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[12px] transition-colors"
            style={mode === 'signin'
              ? { backgroundColor: '#fff', color: '#1A56DB', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
              : { color: '#9CA3AF', fontWeight: 500 }}
          >
            <LogIn size={13} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[12px] transition-colors"
            style={mode === 'signup'
              ? { backgroundColor: '#fff', color: '#059669', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
              : { color: '#9CA3AF', fontWeight: 500 }}
          >
            <UserPlus size={13} />
            Sign Up
          </button>
        </div>

        {/* Card */}
        <div className="bg-white border-[0.5px] rounded-[10px] p-6 transition-colors" style={{ borderColor: '#E5E7EB', borderTopColor: accent, borderTopWidth: '2px' }}>
          <div className="flex items-center gap-2 mb-5">
            {mode === 'signin' ? <LogIn size={16} style={{ color: accent }} /> : <UserPlus size={16} style={{ color: accent }} />}
            <div className="text-[14px]" style={{ color: '#374151', fontWeight: 500 }}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: '#374151', fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[12px] focus:outline-none focus:ring-1"
                style={{ color: '#374151', '--tw-ring-color': accent } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: '#374151', fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={mode === 'signup' ? MIN_PASSWORD_LENGTH : undefined}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[12px] focus:outline-none focus:ring-1"
                style={{ color: '#374151', '--tw-ring-color': accent } as React.CSSProperties}
              />
              {mode === 'signup' && (
                <div className="mt-1 text-[10px]" style={{ color: '#9CA3AF' }}>
                  At least {MIN_PASSWORD_LENGTH} characters
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] mb-1.5" style={{ color: '#374151', fontWeight: 500 }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded-md text-[12px] focus:outline-none focus:ring-1"
                  style={{
                    color: '#374151',
                    borderColor: confirmPassword && confirmPassword !== password ? '#FCA5A5' : '#E5E7EB',
                    '--tw-ring-color': accent,
                  } as React.CSSProperties}
                />
                {confirmPassword && confirmPassword !== password && (
                  <div className="mt-1 text-[10px]" style={{ color: '#E24B4A' }}>
                    Passwords don't match
                  </div>
                )}
              </div>
            )}

            {error && (
              <div
                className="px-3 py-2 rounded-md text-[11px]"
                style={{ backgroundColor: '#FFF5F5', color: '#E24B4A', border: '1px solid #FCA5A5' }}
              >
                {error}
              </div>
            )}

            {info && (
              <div
                className="px-3 py-2 rounded-md text-[11px]"
                style={{ backgroundColor: '#EFF6FF', color: '#1A56DB', border: '1px solid #BFDBFE' }}
              >
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white text-[12px] transition-colors disabled:opacity-60"
              style={{ backgroundColor: accent, fontWeight: 500 }}
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'signup' && (
            <div className="mt-3 text-center text-[10px]" style={{ color: '#9CA3AF' }}>
              By creating an account you agree to our{' '}
              <Link to="/terms" className="underline">Terms</Link> and{' '}
              <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
