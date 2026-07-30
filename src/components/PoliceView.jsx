import { Shield, Car, FileCheck, AlertCircle, Phone, User, ShieldCheck } from 'lucide-react';
import DocumentLinks from './DocumentLinks';
import LicenceButton from './LicenceButton';
import { DOC_SLOTS } from '../config/documents';
import { formatDate } from '../utils/format';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider sm:w-44 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium break-words">{value}</span>
    </div>
  );
}

export default function PoliceView({ data }) {
  const { owner, vehicle, insurance, ctp, medical } = data;
  const now = new Date().toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });

  const hasMedical =
    medical.bloodType ||
    medical.allergies ||
    medical.conditions ||
    medical.emergencyContact ||
    medical.medications?.length > 0 ||
    medical.certificates?.length > 0;

  const operatorDiffers =
    Boolean(vehicle.registeredOperator) &&
    Boolean(owner.fullName) &&
    vehicle.registeredOperator.trim().toLowerCase() !== owner.fullName.trim().toLowerCase();

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10">
      {/* Header */}
      <div className="bg-blue-900 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
        <Shield className="w-10 h-10 text-blue-300 shrink-0" />
        <div>
          <h1 className="text-xl font-bold tracking-wide">VEHICLE IDENTIFICATION</h1>
          <p className="text-blue-300 text-sm">For law enforcement &amp; official use</p>
          <p className="text-blue-400 text-xs mt-1">{now}</p>
        </div>
      </div>

      {/* Opens the official NSW licence in the Service NSW app */}
      <LicenceButton />

      {/* Owner */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">Driver</span>
        </div>
        <div className="p-4 flex gap-4">
          {owner.photo && (
            <img src={owner.photo} alt="Driver" className="w-20 h-20 rounded-xl object-cover shrink-0 border-2 border-gray-200" />
          )}
          <div className="flex-1">
            <Row label="Full Name" value={owner.fullName} />
            <Row label="Date of Birth" value={formatDate(owner.dateOfBirth)} />
            <Row label="Licence No." value={owner.licenseNumber} />
            <Row label="Licence Class" value={owner.licenseClass} />
            <Row label="Conditions" value={owner.licenseConditions} />
            <Row label="Licence Expiry" value={formatDate(owner.licenseExpiry)} />
            <Row label="Address" value={owner.address} />
            <Row label="Phone" value={owner.phone} />
          </div>
        </div>
      </section>

      {/* Vehicle */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <Car className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">Vehicle</span>
        </div>
        <div className="p-4 flex gap-4">
          {vehicle.photo && (
            <img src={vehicle.photo} alt="Vehicle" className="w-20 h-20 rounded-xl object-cover shrink-0 border-2 border-gray-200" />
          )}
          <div className="flex-1">
            <Row label="Registration" value={vehicle.registrationNumber} />
            <Row label="State" value={vehicle.registrationState} />
            <Row label="Rego Expiry" value={formatDate(vehicle.registrationExpiry)} />
            <Row label="Registered To" value={vehicle.registeredOperator} />
            <Row label="Make / Model" value={[vehicle.make, vehicle.model].filter(Boolean).join(' ')} />
            <Row label="Year" value={vehicle.year} />
            <Row label="Colour" value={vehicle.color} />
            <Row label="Body Type" value={vehicle.vehicleType} />
            <Row label="VIN" value={vehicle.vin} />
            <Row label="Engine No." value={vehicle.engineNumber} />
            <Row label="Engine Capacity" value={vehicle.engineCapacity} />
            <Row label="Seating" value={vehicle.seatingCapacity} />
            <Row label="Garaged At" value={vehicle.garagedAt} />
          </div>
        </div>
        {operatorDiffers && (
          <p className="px-4 pb-4 -mt-1 text-xs text-gray-500">
            The driver is not the registered operator of this vehicle.
          </p>
        )}
      </section>

      {/* CTP */}
      {ctp.provider && (
        <section className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold text-sm tracking-wide uppercase">CTP Green Slip</span>
          </div>
          <div className="p-4">
            <Row label="Insurer" value={ctp.provider} />
            <Row label="Policy No." value={ctp.policyNumber} />
            <Row label="Insurer Code" value={ctp.insurerCode} />
            <Row label="Insured" value={ctp.insuredName} />
            <Row label="Cover Period" value={ctp.startDate && `${formatDate(ctp.startDate)} – ${formatDate(ctp.expiryDate)}`} />
            <Row label="Injury Claims" value={ctp.assistNumber} />
          </div>
        </section>
      )}

      {/* Comprehensive insurance */}
      {insurance.provider && (
        <section className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            <span className="font-semibold text-sm tracking-wide uppercase">Vehicle Insurance</span>
          </div>
          <div className="p-4">
            <Row label="Provider" value={insurance.provider} />
            <Row label="Policy No." value={insurance.policyNumber} />
            <Row label="Coverage" value={insurance.coverageType} />
            <Row label="Valid Until" value={formatDate(insurance.expiryDate)} />
            <Row label="Claims Line" value={insurance.claimsNumber} />
          </div>
        </section>
      )}

      {/* Documents */}
      <DocumentLinks slots={DOC_SLOTS} variant="police" />

      {/* Medical */}
      {hasMedical && (
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
            {medical.medications?.length > 0 && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Prescribed Medications</span>
                <div className="space-y-2">
                  {medical.medications.map((med, i) => (
                    <div key={med.id ?? i} className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{med.name}</p>
                      {med.dose && <p className="text-sm text-gray-600">Dose: {med.dose}</p>}
                      {med.reason && <p className="text-sm text-gray-600">Reason: {med.reason}</p>}
                      {med.prescribedBy && <p className="text-sm text-gray-500">Dr. {med.prescribedBy}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {medical.certificates?.length > 0 && (
              <div className="py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Medical Certificates</span>
                <div className="space-y-2">
                  {medical.certificates.map((cert, i) => (
                    <div key={cert.id ?? i} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{cert.title}</p>
                      {cert.issuedBy && <p className="text-sm text-gray-600">Issued by: {cert.issuedBy}</p>}
                      {cert.issueDate && <p className="text-sm text-gray-600">{formatDate(cert.issueDate)}</p>}
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

      <p className="text-center text-xs text-gray-400 pb-4">
        Digitally stored record. Original documents are available on request.
      </p>
    </div>
  );
}
