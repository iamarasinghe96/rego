import { useState, useEffect, useCallback } from 'react';
import { Shield, User, Car, FileCheck, Wrench, Heart, Menu, X } from 'lucide-react';
import { loadData, saveData } from './utils/storage';
import PoliceView from './components/PoliceView';
import OwnerForm from './components/OwnerForm';
import VehicleForm from './components/VehicleForm';
import InsuranceForm from './components/InsuranceForm';
import ServiceForm from './components/ServiceForm';
import MedicalForm from './components/MedicalForm';
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

function expiringSoon(dateStr, days = 30) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const diff = (d - new Date()) / 86400000;
  return diff >= 0 && diff <= days;
}

function expired(dateStr) {
  return dateStr && new Date(dateStr) < new Date();
}

const VALID_TABS = TABS.map((t) => t.id);

function tabFromHash() {
  const id = window.location.hash.replace('#', '');
  return VALID_TABS.includes(id) ? id : 'police';
}

export default function App() {
  // Siri Shortcuts open a URL like .../#police, so the hash picks the screen.
  const [tab, setTab] = useState(tabFromHash);
  const [data, setData] = useState(loadData);
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

  const handleChange = useCallback((section, value) => {
    setData((prev) => ({ ...prev, [section]: value }));
  }, []);

  const handleSave = useCallback(() => {
    setData((prev) => {
      saveData(prev);
      return prev;
    });
  }, []);

  function badgeFor(tabId) {
    if (tabId === 'vehicle' && (expired(data.vehicle.registrationExpiry) || expiringSoon(data.vehicle.registrationExpiry))) return true;
    if (tabId === 'insurance' && [data.insurance.expiryDate, data.ctp.expiryDate].some((d) => expired(d) || expiringSoon(d))) return true;
    if (tabId === 'owner' && (expired(data.owner.licenseExpiry) || expiringSoon(data.owner.licenseExpiry))) return true;
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
        {tab === 'police' && (
          <div>
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-4 text-amber-800 text-sm no-print">
              <strong>Police Check Mode</strong> — Show this screen to law enforcement. Edits you make are saved to this device; the starting details are built into the site.
            </div>
            <PoliceView data={data} />
          </div>
        )}
        {tab === 'owner' && <OwnerForm data={data.owner} onChange={handleChange} onSave={handleSave} />}
        {tab === 'vehicle' && <VehicleForm data={data.vehicle} onChange={handleChange} onSave={handleSave} />}
        {tab === 'insurance' && <InsuranceForm data={data.insurance} ctp={data.ctp} onChange={handleChange} onSave={handleSave} />}
        {tab === 'service' && <ServiceForm data={data.service} onChange={handleChange} onSave={handleSave} />}
        {tab === 'medical' && <MedicalForm data={data.medical} onChange={handleChange} onSave={handleSave} />}
      </main>
    </div>
  );
}
