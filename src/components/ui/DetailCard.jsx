export function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider sm:w-44 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium break-words">{value}</span>
    </div>
  );
}

export default function DetailCard({ icon: Icon, iconClass, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className={`p-2 rounded-xl ${iconClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-gray-500 mb-3 sm:ml-14">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-3'}>{children}</div>
    </div>
  );
}
