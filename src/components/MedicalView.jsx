import { Heart, FileText, Phone, Pill } from 'lucide-react';
import DetailCard, { Detail } from './ui/DetailCard';
import { formatDate } from '../utils/format';

export default function MedicalView({ data }) {
  const meds = data.medications || [];
  const certs = data.certificates || [];
  const hasBasics = data.bloodType || data.allergies || data.conditions || data.emergencyContact;

  return (
    <div className="space-y-5">
      <DetailCard icon={Heart} iconClass="bg-red-100 text-red-700" title="Medical Information">
        {hasBasics ? (
          <>
            <Detail label="Blood Type" value={data.bloodType} />
            <Detail label="Allergies" value={data.allergies} />
            <Detail label="Conditions" value={data.conditions} />
            <Detail label="Emergency Contact" value={data.emergencyContact} />
            <Detail label="Emergency Phone" value={data.emergencyPhone} />
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No medical details on file. Add them in{' '}
            <code className="bg-gray-100 px-1 rounded text-gray-600">src/config/profile.js</code>.
          </p>
        )}
      </DetailCard>

      <DetailCard icon={Pill} iconClass="bg-red-100 text-red-700" title="Prescribed Medications">
        {meds.length === 0 ? (
          <p className="text-sm text-gray-500">No medications on file.</p>
        ) : (
          <div className="space-y-2">
            {meds.map((med, i) => (
              <div key={med.id ?? i} className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="font-semibold text-gray-900">{med.name}</p>
                {med.dose && <p className="text-sm text-gray-600">Dose: {med.dose}</p>}
                {med.reason && <p className="text-sm text-gray-600">Reason: {med.reason}</p>}
                {med.prescribedBy && <p className="text-sm text-gray-500">Prescribed by {med.prescribedBy}</p>}
              </div>
            ))}
          </div>
        )}
      </DetailCard>

      <DetailCard icon={FileText} iconClass="bg-blue-100 text-blue-700" title="Medical Certificates">
        {certs.length === 0 ? (
          <p className="text-sm text-gray-500">No certificates on file.</p>
        ) : (
          <div className="space-y-2">
            {certs.map((cert, i) => (
              <div key={cert.id ?? i} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="font-semibold text-gray-900">{cert.title}</p>
                {cert.issuedBy && <p className="text-sm text-gray-600">Issued by {cert.issuedBy}</p>}
                {cert.issueDate && <p className="text-sm text-gray-600">{formatDate(cert.issueDate)}</p>}
                {cert.notes && <p className="text-sm text-gray-500 mt-1">{cert.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </DetailCard>

      {data.emergencyContact && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
          <Phone className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">In an emergency, contact</p>
            <p className="font-semibold text-gray-900">{data.emergencyContact}</p>
            {data.emergencyPhone && (
              <a href={`tel:${data.emergencyPhone.replace(/\s/g, '')}`} className="text-blue-700 font-medium">
                {data.emergencyPhone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
