import { BarChart3, BriefcaseBusiness, FileText, LayoutDashboard, Upload } from 'lucide-react';

const navItems = [
  { label: 'Upload Data', icon: Upload, available: false },
  { label: 'Analytics', icon: BarChart3, available: true },
  { label: 'Career Matrix', icon: BriefcaseBusiness, available: false },
  { label: 'Reports', icon: FileText, available: false },
];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true"><LayoutDashboard size={18} /></span>
        <span>Legacy<span>Analytics</span></span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ label, icon: Icon, available }) => (
          <button
            className={`nav-item${available ? ' nav-item-active' : ''}`}
            type="button"
            key={label}
            disabled={!available}
            aria-current={available ? 'page' : undefined}
            title={available ? label : `${label} — coming soon`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
            {!available && <small>Soon</small>}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="privacy-dot" aria-hidden="true" />
        <p>Calculations stay on this device.</p>
      </div>
    </aside>
  );
}
