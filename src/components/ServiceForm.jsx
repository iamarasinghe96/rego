import { useState } from 'react';
import { Wrench, Plus, Trash2 } from 'lucide-react';
import Field from './ui/Field';
import SaveButton from './ui/SaveButton';

const SERVICE_TYPES = [
  'Oil & Filter Change', 'Tyre Rotation', 'Brake Service', 'Transmission Service',
  'Coolant Flush', 'Air Filter', 'Spark Plugs', 'Battery Replacement',
  'Wheel Alignment', 'Full Service', 'Roadworthy Check', 'Other',
];

function empty() {
  return { id: Date.now(), date: '', odometer: '', type: 'Oil & Filter Change', workshop: '', cost: '', notes: '', nextDue: '', nextOdo: '' };
}

export default function ServiceForm({ data, onChange, onSave }) {
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [record, setRecord] = useState(empty());

  function handle(field, value) {
    setRecord((r) => ({ ...r, [field]: value }));
  }

  function addRecord() {
    if (!record.date || !record.type) return;
    onChange('service', [...data, { ...record, id: Date.now() }]);
    setRecord(empty());
    setShowForm(false);
    onSave();
  }

  function remove(id) {
    onChange('service', data.filter((r) => r.id !== id));
    onSave();
  }

  function save() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl"><Wrench className="w-5 h-5 text-orange-700" /></div>
            <h2 className="text-lg font-bold text-gray-800">Service History</h2>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        {showForm && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">New Service Record</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Service Date" type="date" value={record.date} onChange={(v) => handle('date', v)} />
              <Field label="Odometer (km)" type="number" value={record.odometer} onChange={(v) => handle('odometer', v)} placeholder="85000" />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Type</label>
                <select
                  value={record.type}
                  onChange={(e) => handle('type', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Workshop / Mechanic" value={record.workshop} onChange={(v) => handle('workshop', v)} placeholder="Bob's Auto Centre" />
              <Field label="Cost ($)" type="number" value={record.cost} onChange={(v) => handle('cost', v)} placeholder="180" />
              <Field label="Next Service Date" type="date" value={record.nextDue} onChange={(v) => handle('nextDue', v)} />
              <Field label="Next Service Odometer" type="number" value={record.nextOdo} onChange={(v) => handle('nextOdo', v)} placeholder="90000" />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">Notes</label>
                <textarea
                  value={record.notes}
                  onChange={(e) => handle('notes', e.target.value)}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addRecord} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition">Save Record</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition">Cancel</button>
            </div>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Wrench className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No service records yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((r) => (
              <div key={r.id} className="border border-gray-100 rounded-xl p-3 flex gap-3">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{r.type}</p>
                      <p className="text-sm text-gray-500">{r.date}{r.odometer ? ` · ${Number(r.odometer).toLocaleString()} km` : ''}</p>
                    </div>
                    {r.cost && <span className="text-sm font-medium text-green-700">${Number(r.cost).toLocaleString()}</span>}
                  </div>
                  {r.workshop && <p className="text-sm text-gray-600 mt-1">{r.workshop}</p>}
                  {r.notes && <p className="text-sm text-gray-500 mt-1 italic">{r.notes}</p>}
                  {(r.nextDue || r.nextOdo) && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">
                      Next: {r.nextDue || ''}{r.nextDue && r.nextOdo ? ' / ' : ''}{r.nextOdo ? `${Number(r.nextOdo).toLocaleString()} km` : ''}
                    </p>
                  )}
                </div>
                <button onClick={() => remove(r.id)} className="text-gray-400 hover:text-red-500 transition shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {sorted.length > 0 && <SaveButton saved={saved} onClick={save} />}
    </div>
  );
}
