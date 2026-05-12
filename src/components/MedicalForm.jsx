import { useState } from 'react';
import { Heart, Plus, Trash2, FileText } from 'lucide-react';
import Field from './ui/Field';
import SelectField from './ui/SelectField';
import SaveButton from './ui/SaveButton';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

function emptyMed() {
  return { id: Date.now(), name: '', dose: '', reason: '', prescribedBy: '' };
}
function emptyCert() {
  return { id: Date.now(), title: '', issuedBy: '', issueDate: '', notes: '' };
}

export default function MedicalForm({ data, onChange, onSave }) {
  const [saved, setSaved] = useState(false);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [med, setMed] = useState(emptyMed());
  const [cert, setCert] = useState(emptyCert());

  function handleField(field, value) {
    onChange('medical', { ...data, [field]: value });
  }

  function addMed() {
    if (!med.name) return;
    const meds = [...(data.medications || []), { ...med, id: Date.now() }];
    onChange('medical', { ...data, medications: meds });
    setMed(emptyMed());
    setShowMedForm(false);
    onSave();
  }

  function removeMed(id) {
    onChange('medical', { ...data, medications: data.medications.filter((m) => m.id !== id) });
    onSave();
  }

  function addCert() {
    if (!cert.title) return;
    const certs = [...(data.certificates || []), { ...cert, id: Date.now() }];
    onChange('medical', { ...data, certificates: certs });
    setCert(emptyCert());
    setShowCertForm(false);
    onSave();
  }

  function removeCert(id) {
    onChange('medical', { ...data, certificates: data.certificates.filter((c) => c.id !== id) });
    onSave();
  }

  function save() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Basic medical info */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-red-100 p-2 rounded-xl"><Heart className="w-5 h-5 text-red-700" /></div>
          <h2 className="text-lg font-bold text-gray-800">Medical Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Blood Type" value={data.bloodType} onChange={(v) => handleField('bloodType', v)} options={BLOOD_TYPES} />
          <div />
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">Allergies</label>
            <textarea
              value={data.allergies}
              onChange={(e) => handleField('allergies', e.target.value)}
              rows={2}
              placeholder="e.g. Penicillin, Latex, Peanuts..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">Medical Conditions</label>
            <textarea
              value={data.conditions}
              onChange={(e) => handleField('conditions', e.target.value)}
              rows={2}
              placeholder="e.g. Type 1 Diabetes, Epilepsy..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>
          <Field label="Emergency Contact Name" value={data.emergencyContact} onChange={(v) => handleField('emergencyContact', v)} placeholder="Jane Smith (Wife)" />
          <Field label="Emergency Contact Phone" type="tel" value={data.emergencyPhone} onChange={(v) => handleField('emergencyPhone', v)} placeholder="+61 400 000 000" />
        </div>
      </div>

      {/* Medications */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Prescribed Medications</h2>
          <button
            onClick={() => setShowMedForm((v) => !v)}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {showMedForm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">New Medication</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Medication Name" value={med.name} onChange={(v) => setMed((m) => ({ ...m, name: v }))} placeholder="Metformin" className="sm:col-span-2" />
              <Field label="Dose / Frequency" value={med.dose} onChange={(v) => setMed((m) => ({ ...m, dose: v }))} placeholder="500mg twice daily" />
              <Field label="Reason / Condition" value={med.reason} onChange={(v) => setMed((m) => ({ ...m, reason: v }))} placeholder="Type 2 Diabetes" />
              <Field label="Prescribed By (Doctor)" value={med.prescribedBy} onChange={(v) => setMed((m) => ({ ...m, prescribedBy: v }))} placeholder="Dr. Jane Wilson" className="sm:col-span-2" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addMed} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">Save</button>
              <button onClick={() => setShowMedForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition">Cancel</button>
            </div>
          </div>
        )}

        {(!data.medications || data.medications.length === 0) ? (
          <p className="text-gray-400 text-sm text-center py-4">No medications added yet.</p>
        ) : (
          <div className="space-y-2">
            {data.medications.map((m) => (
              <div key={m.id} className="border border-gray-100 rounded-xl p-3 flex justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  {m.dose && <p className="text-sm text-gray-600">{m.dose}</p>}
                  {m.reason && <p className="text-sm text-gray-500">{m.reason}</p>}
                  {m.prescribedBy && <p className="text-xs text-gray-400">Dr. {m.prescribedBy}</p>}
                </div>
                <button onClick={() => removeMed(m.id)} className="text-gray-400 hover:text-red-500 transition shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medical Certificates */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl"><FileText className="w-5 h-5 text-blue-700" /></div>
            <h2 className="text-lg font-bold text-gray-800">Medical Certificates</h2>
          </div>
          <button
            onClick={() => setShowCertForm((v) => !v)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {showCertForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">New Certificate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Certificate Title" value={cert.title} onChange={(v) => setCert((c) => ({ ...c, title: v }))} placeholder="Cannabis Medicinal Use Certificate" className="sm:col-span-2" />
              <Field label="Issued By" value={cert.issuedBy} onChange={(v) => setCert((c) => ({ ...c, issuedBy: v }))} placeholder="Dr. John Smith / TGA" />
              <Field label="Issue Date" type="date" value={cert.issueDate} onChange={(v) => setCert((c) => ({ ...c, issueDate: v }))} />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">Notes / Details</label>
                <textarea
                  value={cert.notes}
                  onChange={(e) => setCert((c) => ({ ...c, notes: e.target.value }))}
                  rows={2}
                  placeholder="e.g. TGA approved for chronic pain management. Do not confiscate medication."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addCert} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Save</button>
              <button onClick={() => setShowCertForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition">Cancel</button>
            </div>
          </div>
        )}

        {(!data.certificates || data.certificates.length === 0) ? (
          <p className="text-gray-400 text-sm text-center py-4">No certificates added yet.</p>
        ) : (
          <div className="space-y-2">
            {data.certificates.map((c) => (
              <div key={c.id} className="border border-blue-100 rounded-xl p-3 flex justify-between gap-2 bg-blue-50">
                <div>
                  <p className="font-semibold text-gray-900">{c.title}</p>
                  {c.issuedBy && <p className="text-sm text-gray-600">Issued by: {c.issuedBy}</p>}
                  {c.issueDate && <p className="text-sm text-gray-500">{c.issueDate}</p>}
                  {c.notes && <p className="text-sm text-gray-500 mt-1 italic">{c.notes}</p>}
                </div>
                <button onClick={() => removeCert(c.id)} className="text-gray-400 hover:text-red-500 transition shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SaveButton saved={saved} onClick={save} />
    </div>
  );
}
