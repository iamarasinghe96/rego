import { User } from 'lucide-react';
import DetailCard, { Detail } from './ui/DetailCard';
import LicenceButton from './LicenceButton';
import { formatDate } from '../utils/format';

export default function OwnerView({ data }) {
  return (
    <div className="space-y-5">
      <LicenceButton />

      <DetailCard icon={User} iconClass="bg-blue-100 text-blue-700" title="Driver / Owner">
        {data.photo && (
          <img
            src={data.photo}
            alt={data.fullName}
            className="w-28 h-32 rounded-xl object-cover border-2 border-gray-200 mb-4"
          />
        )}
        <Detail label="Full Name" value={data.fullName} />
        <Detail label="Date of Birth" value={formatDate(data.dateOfBirth)} />
        <Detail label="Licence No." value={data.licenseNumber} />
        <Detail label="Licence Class" value={data.licenseClass} />
        <Detail label="Conditions" value={data.licenseConditions} />
        <Detail label="Licence Expiry" value={formatDate(data.licenseExpiry)} />
        <Detail label="Address" value={data.address} />
        <Detail label="Phone" value={data.phone} />
        <Detail label="Email" value={data.email} />
      </DetailCard>
    </div>
  );
}
