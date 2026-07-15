import { Settings } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface TopNavProps {
  breadcrumb?: string;
}

export function TopNav({ breadcrumb }: TopNavProps) {
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    api.businesses.get()
      .then(list => setBusinessName(list[0]?.name ?? null))
      .catch(() => null);
  }, []);

  return (
    <div className="h-[44px] bg-white border-b-[0.5px] border-[#E5E7EB] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="text-[10px] text-[#1A56DB]" style={{ fontWeight: 600 }}>
          RUNWAYIQ
        </div>
        {breadcrumb && (
          <>
            <span className="text-[#9CA3AF]">/</span>
            <span className="text-[12px]" style={{ color: '#374151' }}>
              {breadcrumb}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {businessName && (
          <div
            className="hidden sm:block px-3 py-1 rounded-full text-[10px]"
            style={{ backgroundColor: '#F3F4F6', color: '#374151', fontWeight: 500 }}
          >
            {businessName}
          </div>
        )}

        <Link
          to="/settings"
          className="px-2.5 sm:px-3 py-1.5 rounded-md text-white text-[11px] flex items-center gap-1.5"
          style={{ backgroundColor: '#1A56DB', fontWeight: 500 }}
        >
          <Settings size={12} />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </div>
    </div>
  );
}
