import { Shield, User, Car, FileCheck, Wrench, Heart } from 'lucide-react';
import { PROFILE } from '../config/profile';
import { documentsFor } from '../config/documents';
import { daysUntil, isExpired } from '../utils/format';
import PoliceView from '../components/PoliceView';
import OwnerView from '../components/OwnerView';
import VehicleView from '../components/VehicleView';
import InsuranceView from '../components/InsuranceView';
import ServiceView from '../components/ServiceView';
import MedicalView from '../components/MedicalView';

const TABS = [
  { id: 'police', label: 'Police Check', short: 'Police', icon: Shield, accent: '#1d4ed8' },
  { id: 'owner', label: 'Owner', short: 'Owner', icon: User, accent: '#334155' },
  { id: 'vehicle', label: 'Vehicle', short: 'Vehicle', icon: Car, accent: '#15803d' },
  { id: 'insurance', label: 'Insurance', short: 'Insurance', icon: FileCheck, accent: '#7e22ce' },
  { id: 'service', label: 'Service', short: 'Service', icon: Wrench, accent: '#ea580c' },
  { id: 'medical', label: 'Medical', short: 'Medical', icon: Heart, accent: '#b91c1c' },
];

function needsAttention(date) {
  if (!date) return false;
  const days = daysUntil(date);
  return isExpired(date) || (days !== null && days <= 30);
}

function badgeFor(id) {
  if (id === 'vehicle') return needsAttention(PROFILE.vehicle.registrationExpiry);
  if (id === 'insurance') return needsAttention(PROFILE.ctp.expiryDate);
  if (id === 'owner') return needsAttention(PROFILE.owner.licenseExpiry);
  return false;
}

export default function StaticApp({ ownerPhoto = '', documents = [], builtAt = '' }) {
  const owner = { ...PROFILE.owner, photo: ownerPhoto };
  const data = { ...PROFILE, owner };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Tab state. Must precede header/main/nav for the sibling selectors. */}
      {TABS.map(({ id }, i) => (
        <input
          key={id}
          className="tab-input"
          type="radio"
          name="tab"
          id={`t-${id}`}
          defaultChecked={i === 0}
        />
      ))}

      <header className="safe-header bg-blue-900 text-white px-4 pb-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-300" />
          <span className="font-bold text-lg tracking-tight">VehicleVault</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map(({ id, label, icon: Icon, accent }) => (
            <label
              key={id}
              htmlFor={`t-${id}`}
              style={{ '--accent': accent }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-200 cursor-pointer transition"
            >
              <Icon className="w-4 h-4" />
              {label}
              {badgeFor(id) && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </label>
          ))}
        </nav>
      </header>

      <main className="safe-main flex-1 p-4 md:pb-8 max-w-2xl mx-auto w-full">
        <section className="panel panel-police">
          <PoliceView data={data} documents={documents} builtAt={builtAt} />
        </section>
        <section className="panel panel-owner">
          <OwnerView data={owner} />
        </section>
        <section className="panel panel-vehicle">
          <VehicleView data={PROFILE.vehicle} documents={documentsFor(documents, 'vehicle')} />
        </section>
        <section className="panel panel-insurance">
          <InsuranceView ctp={PROFILE.ctp} documents={documentsFor(documents, 'insurance')} />
        </section>
        <section className="panel panel-service">
          <ServiceView records={PROFILE.service} />
        </section>
        <section className="panel panel-medical">
          <MedicalView data={PROFILE.medical} />
        </section>
      </main>

      <nav className="bottom-nav safe-nav md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-20 shadow-lg">
        {TABS.map(({ id, short, icon: Icon, accent }) => (
          <label
            key={id}
            htmlFor={`t-${id}`}
            style={{ '--accent': accent }}
            className="flex-1 min-w-0 flex flex-col items-center pt-2 pb-1.5 text-[11px] font-medium relative text-gray-400 cursor-pointer transition"
          >
            <Icon className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="leading-none truncate max-w-full px-0.5">{short}</span>
            {badgeFor(id) && (
              <span className="absolute top-1 right-1/4 w-2 h-2 bg-amber-400 rounded-full" />
            )}
          </label>
        ))}
      </nav>
    </div>
  );
}
