const colors = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
};

const Badge = ({ color = 'slate', children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${colors[color]} ${className}`}>
    {children}
  </span>
);

export default Badge;

export const statusBadge = (status) => {
  const map = {
    pending: { color: 'amber', label: 'En attente' },
    under_review: { color: 'blue', label: 'En cours' },
    approved: { color: 'green', label: 'Approuvée' },
    accepted: { color: 'green', label: 'Acceptée' },
    rejected: { color: 'red', label: 'Refusée' },
    active: { color: 'green', label: 'Actif' },
    completed: { color: 'teal', label: 'Terminé' },
    suspended: { color: 'amber', label: 'Suspendu' },
    submitted: { color: 'blue', label: 'Soumis' },
    checked_in: { color: 'green', label: 'Présent' },
    checked_out: { color: 'slate', label: 'Départ' },
    present: { color: 'green', label: 'Présent' },
    late: { color: 'amber', label: 'En retard' },
    absent: { color: 'red', label: 'Absent' },
    positive: { color: 'green', label: 'Positive' },
    neutral: { color: 'slate', label: 'Neutre' },
    negative: { color: 'red', label: 'Négative' },
  };
  const s = map[status] || { color: 'slate', label: status };
  return { badge: <Badge color={s.color}>{s.label}</Badge>, label: s.label };
};


