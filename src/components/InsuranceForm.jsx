import { useState } from 'react';
import { FileCheck, FolderOpen, ShieldCheck } from 'lucide-react';
import Field from './ui/Field';
import SelectField from './ui/SelectField';
import SaveButton from './ui/SaveButton';
import DocumentSlot from './ui/DocumentSlot';
import { slotsFor } from '../config/documents';
import { daysUntil, isExpired } from '../utils/format';

const COVERAGE_TYPES = ['Comprehensive', 'Third Party Property', 'Third Party Fire & Theft', 'CTP (Compulsory Third Party)'];

function ExpiryNotice({ label, date }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (isExpired(date)) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-800 text-sm font-medium flex items-center gap-2">
        <FileCheck className="w-4 h-4 shrink-0" />
        {label} has expired. Renew immediately.
      </div>
    );
  }
  if (days !== null && days <= 30) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-800 text-sm font-medium">
        {label} expires in {days} day{days !== 1 ? 's' : ''}.
      </div>
    );
  }
  return null;
}

export default function InsuranceForm({ data, ctp, onChange, onSave }) {
  const [saved, setSaved] = useState(false);

  function handle(field, value) {
    onChange('insurance', { ...data, [field]: value });
  }

  function handleCtp(field, value) {
    onChange('ctp', { ...ctp, [field]: value });
  }

  function save() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <ExpiryNotice label="CTP green slip" date={ctp.expiryDate} />
      <ExpiryNotice label="Comprehensive policy" date={data.expiryDate} />

      {/* CTP — the legally required cover, tied to registration */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-emerald-100 p-2 rounded-xl"><ShieldCheck className="w-5 h-5 text-emerald-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">CTP Green Slip</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Compulsory Third Party — covers personal injury only, not damage to vehicles or property.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Insurer" value={ctp.provider} onChange={(v) => handleCtp('provider', v)} placeholder="Allianz / NRMA / etc." className="sm:col-span-2" />
          <Field label="Policy Number" value={ctp.policyNumber} onChange={(v) => handleCtp('policyNumber', v)} placeholder="0000000000TP" />
          <Field label="CTP Number" value={ctp.ctpNumber} onChange={(v) => handleCtp('ctpNumber', v)} placeholder="0000000000" />
          <Field label="Insured Name" value={ctp.insuredName} onChange={(v) => handleCtp('insuredName', v)} placeholder="Policy holder" />
          <Field label="Insurer Code" value={ctp.insurerCode} onChange={(v) => handleCtp('insurerCode', v)} placeholder="32" />
          <Field label="Cover Starts" type="date" value={ctp.startDate} onChange={(v) => handleCtp('startDate', v)} />
          <Field label="Cover Ends" type="date" value={ctp.expiryDate} onChange={(v) => handleCtp('expiryDate', v)} />
          <Field label="Use-by Date" type="date" value={ctp.useByDate} onChange={(v) => handleCtp('useByDate', v)} />
          <Field label="Receipt Number" value={ctp.receiptNumber} onChange={(v) => handleCtp('receiptNumber', v)} />
          <Field label="Insurer Contact" type="tel" value={ctp.contactNumber} onChange={(v) => handleCtp('contactNumber', v)} placeholder="13 1000" />
          <Field label="Injury Claims (CTP Assist)" type="tel" value={ctp.assistNumber} onChange={(v) => handleCtp('assistNumber', v)} placeholder="1300 656 919" />
        </div>
      </div>

      {/* Comprehensive / optional cover */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-100 p-2 rounded-xl"><FileCheck className="w-5 h-5 text-purple-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Vehicle Insurance</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">Comprehensive or third party property cover.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Insurance Provider" value={data.provider} onChange={(v) => handle('provider', v)} placeholder="NRMA / AAMI / etc." className="sm:col-span-2" />
          <Field label="Policy Number" value={data.policyNumber} onChange={(v) => handle('policyNumber', v)} placeholder="POL-00000000" />
          <Field label="Policy Holder Name" value={data.policyHolder} onChange={(v) => handle('policyHolder', v)} placeholder="Full name" />
          <Field label="Start Date" type="date" value={data.startDate} onChange={(v) => handle('startDate', v)} />
          <Field label="Expiry Date" type="date" value={data.expiryDate} onChange={(v) => handle('expiryDate', v)} />
          <SelectField label="Coverage Type" value={data.coverageType} onChange={(v) => handle('coverageType', v)} options={COVERAGE_TYPES} className="sm:col-span-2" />
          <Field label="Insurer Contact Number" type="tel" value={data.contactNumber} onChange={(v) => handle('contactNumber', v)} placeholder="1300 000 000" />
          <Field label="24/7 Claims Number" type="tel" value={data.claimsNumber} onChange={(v) => handle('claimsNumber', v)} placeholder="132 132" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-xl"><FolderOpen className="w-5 h-5 text-purple-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Documents</h2>
        </div>
        <div className="space-y-3">
          {slotsFor('insurance').map((slot) => <DocumentSlot key={slot.id} slot={slot} />)}
        </div>
      </div>

      <SaveButton saved={saved} onClick={save} />
    </div>
  );
}
