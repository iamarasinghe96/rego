import { FileCheck, ShieldCheck } from 'lucide-react';
import DetailCard, { Detail } from './ui/DetailCard';
import DocumentLinks from './DocumentLinks';
import { slotsFor } from '../config/documents';
import { formatDate, daysUntil, isExpired } from '../utils/format';

function ExpiryNotice({ label, date }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (isExpired(date)) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-800 text-sm font-medium">
        {label} has expired. Renew immediately.
      </div>
    );
  }
  if (days !== null && days <= 30) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-800 text-sm font-medium">
        {label} expires in {days} day{days !== 1 ? 's' : ''}.
      </div>
    );
  }
  return null;
}

export default function InsuranceView({ data, ctp }) {
  const hasComprehensive = Boolean(data.provider || data.policyNumber);

  return (
    <div className="space-y-5">
      <ExpiryNotice label="CTP green slip" date={ctp.expiryDate} />
      <ExpiryNotice label="Comprehensive policy" date={data.expiryDate} />

      <DetailCard
        icon={ShieldCheck}
        iconClass="bg-emerald-100 text-emerald-700"
        title="CTP Green Slip"
        subtitle="Compulsory Third Party — covers personal injury only, not damage to vehicles or property."
      >
        <Detail label="Insurer" value={ctp.provider} />
        <Detail label="Policy Number" value={ctp.policyNumber} />
        <Detail label="CTP Number" value={ctp.ctpNumber} />
        <Detail label="Insurer Code" value={ctp.insurerCode} />
        <Detail label="Insured" value={ctp.insuredName} />
        <Detail label="Cover Starts" value={formatDate(ctp.startDate)} />
        <Detail label="Cover Ends" value={formatDate(ctp.expiryDate)} />
        <Detail label="Use-by Date" value={formatDate(ctp.useByDate)} />
        <Detail label="Receipt Number" value={ctp.receiptNumber} />
        <Detail label="Insurer Contact" value={ctp.contactNumber} />
        <Detail label="Injury Claims" value={ctp.assistNumber} />
      </DetailCard>

      <DetailCard
        icon={FileCheck}
        iconClass="bg-purple-100 text-purple-700"
        title="Vehicle Insurance"
        subtitle="Comprehensive or third party property cover."
      >
        {hasComprehensive ? (
          <>
            <Detail label="Provider" value={data.provider} />
            <Detail label="Policy Number" value={data.policyNumber} />
            <Detail label="Policy Holder" value={data.policyHolder} />
            <Detail label="Coverage Type" value={data.coverageType} />
            <Detail label="Start Date" value={formatDate(data.startDate)} />
            <Detail label="Expiry Date" value={formatDate(data.expiryDate)} />
            <Detail label="Insurer Contact" value={data.contactNumber} />
            <Detail label="Claims Line" value={data.claimsNumber} />
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No comprehensive policy on file. The CTP certificate notes one exists on this vehicle —
            add it in <code className="bg-gray-100 px-1 rounded text-gray-600">src/config/profile.js</code>.
          </p>
        )}
      </DetailCard>

      <DocumentLinks slots={slotsFor('insurance')} iconClass="bg-purple-100 text-purple-700" />
    </div>
  );
}
