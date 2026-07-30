import { Car } from 'lucide-react';
import DetailCard, { Detail } from './ui/DetailCard';
import { formatDate } from '../utils/format';

export default function VehicleView({ data }) {
  return (
    <div className="space-y-5">
      <DetailCard icon={Car} iconClass="bg-green-100 text-green-700" title="Vehicle Details">
        {data.photo && (
          <img src={data.photo} alt="Vehicle" className="w-full max-w-xs rounded-xl object-cover border-2 border-gray-200 mb-4" />
        )}
        <Detail label="Registration" value={data.registrationNumber} />
        <Detail label="State" value={data.registrationState} />
        <Detail label="Rego Expiry" value={formatDate(data.registrationExpiry)} />
        <Detail label="Registered To" value={data.registeredOperator} />
        <Detail label="Customer Number" value={data.customerNumber} />
        <Detail label="Make" value={data.make} />
        <Detail label="Model" value={data.model} />
        <Detail label="Year" value={data.year} />
        <Detail label="Colour" value={data.color} />
        <Detail label="Body Type" value={data.vehicleType} />
        <Detail label="VIN / Chassis" value={data.vin} />
        <Detail label="Engine No." value={data.engineNumber} />
        <Detail label="Engine Capacity" value={data.engineCapacity} />
        <Detail label="Seating Capacity" value={data.seatingCapacity} />
        <Detail label="Garaged At" value={data.garagedAt} />
      </DetailCard>
    </div>
  );
}
