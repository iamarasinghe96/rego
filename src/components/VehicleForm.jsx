import { useState } from 'react';
import { Car, Upload, FolderOpen } from 'lucide-react';
import Field from './ui/Field';
import SelectField from './ui/SelectField';
import SaveButton from './ui/SaveButton';
import DocumentSlot from './ui/DocumentSlot';
import { slotsFor } from '../config/documents';

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Wagon', 'Ute', 'Van', 'Motorcycle', 'Truck', 'Bus', 'Other'];
const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

export default function VehicleForm({ data, onChange, onSave }) {
  const [saved, setSaved] = useState(false);

  function handle(field, value) {
    onChange('vehicle', { ...data, [field]: value });
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
          <div className="bg-green-100 p-2 rounded-xl"><Car className="w-5 h-5 text-green-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Vehicle Details</h2>
        </div>

        {/* Photo */}
        <div className="mb-5 flex items-center gap-4">
          {data.photo ? (
            <img src={data.photo} alt="Vehicle" className="w-28 h-20 rounded-xl object-cover border-2 border-green-200" />
          ) : (
            <div className="w-28 h-20 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <label className="cursor-pointer flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-green-100 transition">
            <Upload className="w-4 h-4" /> Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Registration Number" value={data.registrationNumber} onChange={(v) => handle('registrationNumber', v)} placeholder="ABC123" />
          <SelectField label="Registration State" value={data.registrationState} onChange={(v) => handle('registrationState', v)} options={STATES} />
          <Field label="Registration Expiry" type="date" value={data.registrationExpiry} onChange={(v) => handle('registrationExpiry', v)} />
          <SelectField label="Vehicle Type" value={data.vehicleType} onChange={(v) => handle('vehicleType', v)} options={VEHICLE_TYPES} />
          <Field label="Make (Brand)" value={data.make} onChange={(v) => handle('make', v)} placeholder="Toyota" />
          <Field label="Model" value={data.model} onChange={(v) => handle('model', v)} placeholder="Camry" />
          <Field label="Year" type="number" value={data.year} onChange={(v) => handle('year', v)} placeholder="2020" />
          <Field label="Colour" value={data.color} onChange={(v) => handle('color', v)} placeholder="Silver" />
          <Field label="VIN (Chassis Number)" value={data.vin} onChange={(v) => handle('vin', v)} placeholder="1HGBH41JXMN109186" className="sm:col-span-2" />
          <Field label="Engine Number" value={data.engineNumber} onChange={(v) => handle('engineNumber', v)} placeholder="ENG-00000" />
          <Field label="Engine Capacity" value={data.engineCapacity} onChange={(v) => handle('engineCapacity', v)} placeholder="1498 cc (1.5L)" />
          <Field label="Seating Capacity" value={data.seatingCapacity} onChange={(v) => handle('seatingCapacity', v)} placeholder="5" />
          <Field label="Registered Operator" value={data.registeredOperator} onChange={(v) => handle('registeredOperator', v)} placeholder="If not you" />
          <Field label="Customer Number" value={data.customerNumber} onChange={(v) => handle('customerNumber', v)} placeholder="00000000" />
          <Field label="Garaged Address" value={data.garagedAt} onChange={(v) => handle('garagedAt', v)} placeholder="Suburb, State, Postcode" className="sm:col-span-2" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-xl"><FolderOpen className="w-5 h-5 text-green-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Documents</h2>
        </div>
        <div className="space-y-3">
          {slotsFor('vehicle').map((slot) => <DocumentSlot key={slot.id} slot={slot} />)}
        </div>
      </div>

      <SaveButton saved={saved} onClick={save} />
    </div>
  );
}
