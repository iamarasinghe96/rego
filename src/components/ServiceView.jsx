import { Wrench } from 'lucide-react';
import DetailCard from './ui/DetailCard';
import { formatDate } from '../utils/format';

export default function ServiceView({ records = [] }) {
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalSpent = records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);

  return (
    <div className="space-y-5">
      <DetailCard
        icon={Wrench}
        iconClass="bg-orange-100 text-orange-700"
        title="Service History"
        subtitle={
          records.length
            ? `${records.length} record${records.length !== 1 ? 's' : ''}${totalSpent ? ` · $${totalSpent.toLocaleString()} total` : ''}`
            : undefined
        }
      >
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wrench className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No service records yet.</p>
            <p className="text-xs mt-2 text-gray-400">
              Add them to <code className="bg-gray-100 px-1 rounded text-gray-500">service</code> in{' '}
              <code className="bg-gray-100 px-1 rounded text-gray-500">src/config/profile.js</code>{' '}
              and rebuild.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((r, i) => (
              <div key={r.id ?? i} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.type}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(r.date)}
                      {r.odometer ? ` · ${Number(r.odometer).toLocaleString()} km` : ''}
                    </p>
                  </div>
                  {r.cost && (
                    <span className="text-sm font-medium text-green-700 shrink-0">
                      ${Number(r.cost).toLocaleString()}
                    </span>
                  )}
                </div>
                {r.workshop && <p className="text-sm text-gray-600 mt-1">{r.workshop}</p>}
                {r.notes && <p className="text-sm text-gray-500 mt-1 italic">{r.notes}</p>}
                {(r.nextDue || r.nextOdo) && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    Next: {r.nextDue ? formatDate(r.nextDue) : ''}
                    {r.nextDue && r.nextOdo ? ' / ' : ''}
                    {r.nextOdo ? `${Number(r.nextOdo).toLocaleString()} km` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DetailCard>
    </div>
  );
}
