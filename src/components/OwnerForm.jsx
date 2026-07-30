import { useState } from 'react';
import { User, Upload } from 'lucide-react';
import Field from './ui/Field';
import SaveButton from './ui/SaveButton';

export default function OwnerForm({ data, onChange, onSave }) {
  const [saved, setSaved] = useState(false);

  function handle(field, value) {
    onChange('owner', { ...data, [field]: value });
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handle('photo', ev.target.result);
    reader.readAsDataURL(file);
  }

  function save() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-100 p-2 rounded-xl"><User className="w-5 h-5 text-blue-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Driver / Owner Details</h2>
        </div>

        {/* Photo */}
        <div className="mb-5 flex items-center gap-4">
          {data.photo ? (
            <img src={data.photo} alt="Owner" className="w-20 h-20 rounded-xl object-cover border-2 border-blue-200" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <label className="cursor-pointer flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-100 transition">
            <Upload className="w-4 h-4" /> Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={data.fullName} onChange={(v) => handle('fullName', v)} placeholder="John Smith" className="sm:col-span-2" />
          <Field label="Date of Birth" type="date" value={data.dateOfBirth} onChange={(v) => handle('dateOfBirth', v)} />
          <Field label="Phone Number" type="tel" value={data.phone} onChange={(v) => handle('phone', v)} placeholder="+61 400 000 000" />
          <Field label="Email" type="email" value={data.email} onChange={(v) => handle('email', v)} placeholder="john@example.com" />
          <Field label="Driver Licence Number" value={data.licenseNumber} onChange={(v) => handle('licenseNumber', v)} placeholder="12345678" />
          <Field label="Licence Expiry Date" type="date" value={data.licenseExpiry} onChange={(v) => handle('licenseExpiry', v)} />
          <Field label="Licence Class" value={data.licenseClass} onChange={(v) => handle('licenseClass', v)} placeholder="C" />
          <Field label="Licence Conditions" value={data.licenseConditions} onChange={(v) => handle('licenseConditions', v)} placeholder="None" />
          <Field label="Residential Address" value={data.address} onChange={(v) => handle('address', v)} placeholder="123 Main St, City, State 0000" className="sm:col-span-2" />
        </div>
      </div>
      <SaveButton saved={saved} onClick={save} />
    </div>
  );
}
