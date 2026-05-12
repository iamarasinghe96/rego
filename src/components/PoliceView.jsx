import { Shield, Car, FileCheck, AlertCircle, Phone, User, Calendar, Hash } from 'lucide-react';

function StatusBadge({ valid, label }) {
  const ok = valid && new Date(valid) >= new Date();
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}: {ok ? 'VALID' : 'EXPIRED / MISSING'}
    </span>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider sm:w-40 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

export default function PoliceView({ data }) {
  const { owner, vehicle, insurance, medical } = data;
  const now = new Date().toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10">
      {/* Header */}
      <div className="bg-blue-900 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
        <Shield className="w-10 h-10 text-blue-300 shrink-0" />
        <div>
          <h1 className="text-xl font-bold tracking-wide">VEHICLE IDENTIFICATION</h1>
          <p className="text-blue-300 text-sm">For law enforcement & official use</p>
          <p className="text-blue-400 text-xs mt-1">{now}</p>
        </div>
      </div>

      {/* Status banners */}
      <div className="bg-white rounded-2xl p-4 shadow flex flex-wrap gap-2">
        <StatusBadge valid={vehicle.registrationExpiry} label="Registration" />
        <StatusBadge valid={insurance.expiryDate} label="Insurance" />
        <StatusBadge valid={owner.licenseExpiry} label="Licence" />
      </div>

      {/* Owner */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">Driver / Owner</span>
        </div>
        <div className="p-4 flex gap-4">
          {owner.photo && (
            <img src={owner.photo} alt="Owner" className="w-20 h-20 rounded-xl object-cover shrink-0 border-2 border-gray-200" />
          )}
          <div className="flex-1 space-y-0">
            <Row label="Full Name" value={owner.fullName} />
            <Row label="Date of Birth" value={owner.dateOfBirth} />
            <Row label="Licence No." value={owner.licenseNumber} />
            <Row label="Licence Expiry" value={owner.licenseExpiry} />
            <Row label="Address" value={owner.address} />
            <Row label="Phone" value={owner.phone} />
          </div>
        </div>
      </section>

      {/* Vehicle */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <Car className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">Vehicle Details</span>
        </div>
        <div className="p-4 flex gap-4">
          {vehicle.photo && (
            <img src={vehicle.photo} alt="Vehicle" className="w-20 h-20 rounded-xl object-cover shrink-0 border-2 border-gray-200" />
          )}
          <div className="flex-1 space-y-0">
            <Row label="Registration" value={vehicle.registrationNumber} />
            <Row label="State" value={vehicle.registrationState} />
            <Row label="Expiry" value={vehicle.registrationExpiry} />
            <Row label="Make / Model" value={`${vehicle.make} ${vehicle.model}`} />
            <Row label="Year" value={vehicle.year} />
            <Row label="Colour" value={vehicle.color} />
            <Row label="VIN" value={vehicle.vin} />
            <Row label="Engine No." value={vehicle.engineNumber} />
            <Row label="Type" value={vehicle.vehicleType} />
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <FileCheck className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">Insurance</span>
        </div>
        <div className="p-4">
          <Row label="Provider" value={insurance.provider} />
          <Row label="Policy No." value={insurance.policyNumber} />
          <Row label="Coverage" value={insurance.coverageType} />
          <Row label="Valid Until" value={insurance.expiryDate} />
          <Row label="Claims Line" value={insurance.claimsNumber} />
          <Row label="Contact" value={insurance.contactNumber} />
        </div>
      </section>

      {/* Medical */}
      {(medical.bloodType || medical.allergies || medical.conditions || medical.emergencyContact || (medical.medications && medical.medications.length > 0)) && (
        <section className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="bg-red-700 text-white px-4 py-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold text-sm tracking-wide uppercase">Medical Information</span>
          </div>
          <div className="p-4">
            <Row label="Blood Type" value={medical.bloodType} />
            {medical.allergies && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Allergies</span>
                <p className="text-gray-900 font-medium mt-1">{medical.allergies}</p>
              </div>
            )}
            {medical.conditions && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical Conditions</span>
                <p className="text-gray-900 font-medium mt-1">{medical.conditions}</p>
              </div>
            )}
            {medical.medications && medical.medications.length > 0 && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Prescribed Medications</span>
                <div className="space-y-2">
                  {medical.medications.map((med, i) => (
                    <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{med.name}</p>
                      {med.dose && <p className="text-sm text-gray-600">Dose: {med.dose}</p>}
                      {med.reason && <p className="text-sm text-gray-600">Reason: {med.reason}</p>}
                      {med.prescribedBy && <p className="text-sm text-gray-500">Dr. {med.prescribedBy}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {medical.certificates && medical.certificates.length > 0 && (
              <div className="py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Medical Certificates</span>
                <div className="space-y-2">
                  {medical.certificates.map((cert, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{cert.title}</p>
                      {cert.issuedBy && <p className="text-sm text-gray-600">Issued by: {cert.issuedBy}</p>}
                      {cert.issueDate && <p className="text-sm text-gray-600">Date: {cert.issueDate}</p>}
                      {cert.notes && <p className="text-sm text-gray-500 mt-1">{cert.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {medical.emergencyContact && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                <Phone className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Emergency Contact</p>
                  <p className="font-semibold text-gray-900">{medical.emergencyContact}</p>
                  {medical.emergencyPhone && <p className="text-gray-700">{medical.emergencyPhone}</p>}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-gray-400 pb-4">This document is digitally stored and may be verified by law enforcement.</p>
    </div>
  );
}
