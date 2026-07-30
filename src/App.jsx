import { useState, useEffect, useCallback } from 'react';
import { Shield, User, Car, FileCheck, Wrench, Heart, Menu, X } from 'lucide-react';
import { PROFILE } from './config/profile';
import { loadService, saveService } from './utils/storage';
import { daysUntil, isExpired } from './utils/format';
import PoliceView from './components/PoliceView';
import OwnerView from './components/OwnerView';
import VehicleView from './components/VehicleView';
import InsuranceView from './components/InsuranceView';
import ServiceForm from './components/ServiceForm';
import MedicalView from './components/MedicalView';
import './index.css';

const TABS = [
  { id: 'police', label: 'Police Check', icon: Shield, color: 'blue' },
  { id: 'owner', label: 'Owner', icon: User, color: 'slate' },
  { id: 'vehicle', label: 'Vehicle', icon: Car, color: 'green' },
  { id: 'insurance', label: 'Insurance', icon: FileCheck, color: 'purple' },
  { id: 'service', label: 'Service', icon: Wrench, color: 'orange' },
  { id: 'medical', label: 'Medical', icon: Heart, color: 'red' },
];

const COLOR_MAP = {
  blue: { active: 'bg-blue-700 text-white', icon: 'text-blue-700' },
  slate: { active: 'bg-slate-700 text-white', icon: 'text-slate-700' },
  green: { active: 'bg-green-700 text-white', icon: 'text-green-700' },
  purple: { active: 'bg-purple-700 text-white', icon: 'text-purple-700' },
  orange: { active: 'bg-orange-600 text-white', icon: 'text-orange-600' },
  red: { active: 'bg-red-700 text-white', icon: 'text-red-700' },
};

const VALID_TABS = TABS.map((t) => t.id);

function tabFromHash() {
  const id = window.location.hash.replace('#', '');
  return VALID_TABS.includes(id) ? id : 'police';
}

function needsAttention(date) {
  if (!date) return false;
  const days = daysUntil(date);
  return isExpired(date) || (days !== null && days <= 30);
}

export default function App() {
  // Siri Shortcuts open a URL like .../#police, so the hash picks the screen.
  const [tab, setTab] = useState(tabFromHash);
  const [service, setService] = useState(loadService);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'VehicleVault';
  }, []);

  // Respond to the hash changing while the app is already open — iOS reuses
  // an existing tab when a Shortcut fires a second time.
  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (window.location.hash.replace('#', '') !== tab) {
      window.history.replaceState(null, '', `#${tab}`);
    }
  }, [tab]);

  const handleServiceChange = useCallback((records) => {
    setService(records);
    saveService(records);
  }, []);

  function badgeFor(tabId) {
    if (tabId === 'vehicle') return needsAttention(PROFILE.vehicle.registrationExpiry);
    if (tabId === 'insurance') return needsAttention(PROFILE.ctp.expiryDate);
    if (tabId === 'owner') return needsAttention(PROFILE.owner.licenseExpiry);
    return false;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-300" />
          <span className="font-bold text-lg tracking-tight">VehicleVault</span>
        </div>
        {/* Desktop tab bar */}
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                tab === id ? COLOR_MAP[color].active : 'text-blue-200 hover:text-white hover:bg-blue-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {badgeFor(id) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full" />}
            </button>
          ))}
        </nav>
        {/* Mobile menu button */}
        <button className="md:hidden text-white p-1" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-950 text-white z-20 shadow-xl">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium border-b border-blue-900 relative ${
                tab === id ? 'bg-blue-800' : 'hover:bg-blue-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${tab === id ? 'text-white' : COLOR_MAP[color].icon}`} />
              {label}
              {badgeFor(id) && <span className="ml-auto w-2 h-2 bg-amber-400 rounded-full" />}
            </button>
          ))}
        </div>
      )}

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-20 shadow-lg">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium relative transition ${
              tab === id ? COLOR_MAP[color].icon : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className={tab === id ? 'font-bold' : ''}>{label}</span>
            {badgeFor(id) && <span className="absolute top-1 right-1/4 w-2 h-2 bg-amber-400 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 pb-24 md:pb-8 max-w-2xl mx-auto w-full">
        {tab === 'police' && <PoliceView data={{ ...PROFILE, service }} />}
        {tab === 'owner' && <OwnerView data={PROFILE.owner} />}
        {tab === 'vehicle' && <VehicleView data={PROFILE.vehicle} />}
        {tab === 'insurance' && <InsuranceView ctp={PROFILE.ctp} />}
        {tab === 'service' && <ServiceForm data={service} onChange={handleServiceChange} />}
        {tab === 'medical' && <MedicalView data={PROFILE.medical} />}
      </main>
    </div>
  );
}
