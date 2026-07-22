import { Toggle } from '../components/Toggle';
import { useState, useEffect } from 'react';
import { AlertTriangle, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { api, Business } from '../../lib/api';

const navItems = [
  { id: 'profile', label: 'Business Profile' },
  { id: 'alerts', label: 'Alert Thresholds' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'team', label: 'Team & Access' },
  { id: 'danger', label: 'Danger Zone', isDanger: true },
];

export function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [fiscalYearStart, setFiscalYearStart] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Alert toggle saving state (per-key, so one toggle spinning doesn't block others)
  const [savingAlert, setSavingAlert] = useState<string | null>(null);

  // Delete account flow
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    api.businesses.get()
      .then(list => {
        const b = list[0] ?? null;
        setBusiness(b);
        if (b) {
          setName(b.name);
          setIndustry(b.industry ?? '');
          setFiscalYearStart(b.fiscalYearStart ?? '');
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      const updated = await api.businesses.update({
        name: name.trim() || undefined,
        industry: industry.trim(),
        fiscalYearStart: fiscalYearStart.trim(),
      });
      setBusiness(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleToggleAlert(key: 'alertRunway' | 'alertBurn' | 'alertCash' | 'alertRevenue', value: boolean) {
    if (!business) return;
    // Optimistic update
    setBusiness({ ...business, [key]: value });
    setSavingAlert(key);
    try {
      const updated = await api.businesses.update({ [key]: value });
      setBusiness(updated);
    } catch {
      // Revert on failure
      setBusiness(business);
    } finally {
      setSavingAlert(null);
    }
  }

  const deleteConfirmMatches = business
    ? deleteConfirmText.trim().toLowerCase() === business.name.trim().toLowerCase()
    : false;

  async function handleDeleteAccount() {
    if (!business || !deleteConfirmMatches) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.businesses.delete();
      await signOut();
      navigate('/landing');
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-[1440px] mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[20px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
            Settings
          </div>
          <div className="text-[12px]" style={{ color: '#9CA3AF' }}>
            {user?.email ?? 'Manage your account and preferences'}
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-md text-[11px] hover:bg-[#F9FAFB] transition-colors"
          style={{ color: '#374151' }}
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
        {/* Left Navigation */}
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] p-2">
          <div className="flex md:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <div key={item.id} className="shrink-0 md:shrink">
                {item.isDanger && (
                  <div className="hidden md:block my-2 border-t border-[#E5E7EB]" />
                )}
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-auto md:w-full text-left px-3 py-2 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                    item.isDanger ? 'text-[#E24B4A]' : ''
                  }`}
                  style={{
                    backgroundColor: activeSection === item.id && !item.isDanger ? '#F0F4FF' : 'transparent',
                    borderLeft: activeSection === item.id && !item.isDanger ? '2px solid #1A56DB' : '2px solid transparent',
                    color: item.isDanger ? '#E24B4A' : activeSection === item.id ? '#1A56DB' : '#374151',
                    fontWeight: activeSection === item.id ? 500 : 400,
                    paddingLeft: activeSection === item.id && !item.isDanger ? '11px' : '12px'
                  }}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-4">
          {activeSection === 'profile' && (
            <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] p-[14px]">
              <div className="mb-4">
                <div className="text-[14px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
                  Business Profile
                </div>
                <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
                  Update your company information
                </div>
              </div>

              {loading ? (
                <div className="text-[11px] py-4" style={{ color: '#9CA3AF' }}>Loading…</div>
              ) : !business ? (
                <div className="text-[11px] py-4" style={{ color: '#9CA3AF' }}>
                  No business found for your account yet — upload a CSV from the Dashboard to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: '#374151', fontWeight: 500 }}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1A56DB]"
                      style={{ color: '#374151' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: '#374151', fontWeight: 500 }}>
                      Industry
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      placeholder="e.g. B2B SaaS"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1A56DB]"
                      style={{ color: '#374151' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] mb-1.5" style={{ color: '#374151', fontWeight: 500 }}>
                      Fiscal Year Start
                    </label>
                    <input
                      type="text"
                      value={fiscalYearStart}
                      onChange={e => setFiscalYearStart(e.target.value)}
                      placeholder="e.g. January"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1A56DB]"
                      style={{ color: '#374151' }}
                    />
                  </div>

                  {profileError && (
                    <div className="px-3 py-2 rounded-md text-[11px]"
                      style={{ backgroundColor: '#FFF5F5', color: '#E24B4A', border: '1px solid #FCA5A5' }}>
                      {profileError}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile || !name.trim()}
                      className="px-4 py-2 rounded-md text-white text-[11px] disabled:opacity-60 transition-opacity flex items-center gap-2"
                      style={{ backgroundColor: '#1A56DB', fontWeight: 500 }}
                    >
                      {savingProfile && <Loader2 size={12} className="animate-spin" />}
                      {savingProfile ? 'Saving…' : 'Save Changes'}
                    </button>
                    {profileSaved && (
                      <span className="text-[11px]" style={{ color: '#059669', fontWeight: 500 }}>Saved</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'alerts' && (
            <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] p-[14px]">
              <div className="mb-4">
                <div className="text-[14px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
                  Alert Thresholds
                </div>
                <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
                  Configure notifications for financial metrics
                </div>
              </div>

              {loading ? (
                <div className="text-[11px] py-4" style={{ color: '#9CA3AF' }}>Loading…</div>
              ) : !business ? (
                <div className="text-[11px] py-4" style={{ color: '#9CA3AF' }}>
                  No business found for your account yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {([
                    { key: 'alertRunway' as const, title: 'Runway Alert', desc: 'Notify when runway falls below 3 months' },
                    { key: 'alertBurn' as const, title: 'Burn Rate Spike', desc: 'Alert on burn increase > 15% month-over-month' },
                    { key: 'alertCash' as const, title: 'Cash Threshold', desc: 'Notify when cash drops below $100K' },
                    { key: 'alertRevenue' as const, title: 'Revenue Milestone', desc: 'Celebrate when MRR hits growth targets' },
                  ]).map((row, i, arr) => (
                    <div key={row.key} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}>
                      <div>
                        <div className="text-[12px] mb-0.5" style={{ color: '#374151', fontWeight: 500 }}>
                          {row.title}
                        </div>
                        <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
                          {row.desc}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {savingAlert === row.key && <Loader2 size={11} className="animate-spin" style={{ color: '#9CA3AF' }} />}
                        <Toggle checked={business[row.key]} onChange={v => handleToggleAlert(row.key, v)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] p-[14px]">
              <div className="mb-4">
                <div className="text-[14px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
                  Integrations
                </div>
                <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
                  Connect your financial tools — coming soon
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-md opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#635BFF] flex items-center justify-center text-white text-[10px]" style={{ fontWeight: 600 }}>
                      S
                    </div>
                    <div>
                      <div className="text-[11px]" style={{ color: '#374151', fontWeight: 500 }}>
                        Stripe
                      </div>
                      <div className="text-[9px]" style={{ color: '#9CA3AF' }}>
                        Not yet available
                      </div>
                    </div>
                  </div>
                  <button disabled className="text-[10px] px-3 py-1 border border-[#E5E7EB] rounded-md cursor-not-allowed" style={{ color: '#9CA3AF' }}>
                    Coming soon
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-md opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#00A4EF] flex items-center justify-center text-white text-[10px]" style={{ fontWeight: 600 }}>
                      QBO
                    </div>
                    <div>
                      <div className="text-[11px]" style={{ color: '#374151', fontWeight: 500 }}>
                        QuickBooks
                      </div>
                      <div className="text-[9px]" style={{ color: '#9CA3AF' }}>
                        Not yet available
                      </div>
                    </div>
                  </div>
                  <button disabled className="text-[10px] px-3 py-1 border border-[#E5E7EB] rounded-md cursor-not-allowed" style={{ color: '#9CA3AF' }}>
                    Coming soon
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'team' && (
            <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] p-[14px]">
              <div className="mb-4">
                <div className="text-[14px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
                  Team & Access
                </div>
                <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
                  Multi-user access is coming soon
                </div>
              </div>

              <div className="py-6 text-center">
                <div className="text-[12px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
                  Just you for now
                </div>
                <div className="text-[10px] mb-4" style={{ color: '#9CA3AF' }}>
                  {user?.email} · Owner
                </div>
              </div>

              <button
                disabled
                className="w-full py-2 border border-[#E5E7EB] rounded-md text-[11px] cursor-not-allowed"
                style={{ color: '#9CA3AF', fontWeight: 500 }}
              >
                + Invite Team Member (coming soon)
              </button>
            </div>
          )}

          {activeSection === 'danger' && (
            <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] p-[14px]">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} style={{ color: '#E24B4A' }} />
                  <div className="text-[14px]" style={{ color: '#E24B4A', fontWeight: 500 }}>
                    Danger Zone
                  </div>
                </div>
                <div className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>
                  Irreversible and destructive actions
                </div>
              </div>

              <div className="p-4 border border-[#FCA5A5] rounded-md" style={{ backgroundColor: '#FFF5F5' }}>
                <div className="mb-3">
                  <div className="text-[12px] mb-1" style={{ color: '#374151', fontWeight: 500 }}>
                    Delete Business
                  </div>
                  <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
                    Permanently deletes this business and all its transactions, reports, and chat history.
                    This does not delete your login — you can create a new business afterward. This action cannot be undone.
                  </div>
                </div>

                {business && (
                  <>
                    <div className="mb-3">
                      <label className="block text-[10px] mb-1.5" style={{ color: '#991B1B', fontWeight: 500 }}>
                        Type <b>{business.name}</b> to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={e => setDeleteConfirmText(e.target.value)}
                        className="w-full max-w-[280px] px-3 py-2 border border-[#FCA5A5] rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-[#E24B4A]"
                        style={{ color: '#374151', backgroundColor: '#fff' }}
                      />
                    </div>

                    {deleteError && (
                      <div className="mb-3 text-[11px]" style={{ color: '#E24B4A' }}>{deleteError}</div>
                    )}

                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting || !deleteConfirmMatches}
                      className="px-4 py-2 rounded-md text-[11px] disabled:opacity-50 flex items-center gap-2"
                      style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 500 }}
                    >
                      {deleting && <Loader2 size={12} className="animate-spin" />}
                      {deleting ? 'Deleting…' : 'Delete Business'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
