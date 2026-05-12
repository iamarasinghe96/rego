import { useState } from 'react';
import { FileCheck } from 'lucide-react';
import Field from './ui/Field';
import SelectField from './ui/SelectField';
import SaveButton from './ui/SaveButton';

const COVERAGE_TYPES = ['CTP (Compulsory Third Party)', 'Third Party Property', 'Third Party Fire & Theft', 'Comprehensive'];

export default function InsuranceForm({ data, onChange, onSave }) {
  const [saved, setSaved] = useState(false);

  function handle(field, value) {
    onChange('insurance', { ...data, [field]: value });
  }

  function save() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isExpired = data.expiryDate && new Date(data.expiryDate) < new Date();
  const daysUntil = data.expiryDate
    ? Math.ceil((new Date(data.expiryDate) - new Date()) / 86400000)
    : null;

  return (
    <div className="space-y-5">
      {isExpired && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-800 text-sm font-medium flex items-center gap-2">
          <FileCheck className="w-4 h-4 shrink-0" />
          Insurance policy has expired. Please renew immediately.
        </div>
      )}
      {!isExpired && daysUntil !== null && daysUntil <= 30 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-800 text-sm font-medium">
          Insurance expires in {daysUntil} day{daysUntil !== 1 ? 's' : ''}. Consider renewing soon.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-purple-100 p-2 rounded-xl"><FileCheck className="w-5 h-5 text-purple-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Insurance Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Insurance Provider" value={data.provider} onChange={(v) => handle('provider', v)} placeholder="NRMA / AAMI / etc." className="sm:col-span-2" />
          <Field label="Policy Number" value={data.policyNumber} onChange={(v) => handle('policyNumber', v)} placeholder="POL-00000000" />
          <Field label="Policy Holder Name" value={data.policyHolder} onChange={(v) => handle('policyHolder', v)} placeholder="John Smith" />
          <Field label="Start Date" type="date" value={data.startDate} onChange={(v) => handle('startDate', v)} />
          <Field label="Expiry Date" type="date" value={data.expiryDate} onChange={(v) => handle('expiryDate', v)} />
          <SelectField label="Coverage Type" value={data.coverageType} onChange={(v) => handle('coverageType', v)} options={COVERAGE_TYPES} className="sm:col-span-2" />
          <Field label="Insurer Contact Number" type="tel" value={data.contactNumber} onChange={(v) => handle('contactNumber', v)} placeholder="1300 000 000" />
          <Field label="24/7 Claims Number" type="tel" value={data.claimsNumber} onChange={(v) => handle('claimsNumber', v)} placeholder="132 132" />
        </div>
      </div>
      <SaveButton saved={saved} onClick={save} />
    </div>
  );
}
