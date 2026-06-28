const types = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-ocp-50 text-ocp-800 border-ocp-200',
};

const Alert = ({ type = 'info', children, className = '' }) => {
  if (!children) return null;
  return (
    <div className={`px-4 py-3 rounded-xl border text-sm ${types[type]} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;


