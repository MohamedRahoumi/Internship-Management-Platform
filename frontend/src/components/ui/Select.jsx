const Select = ({ label, error, children, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="label-field">{label}</label>}
    <select className={`select-field ${error ? 'input-error' : ''}`} {...props}>
      {children}
    </select>
    {error && <p className="error-text">{error}</p>}
  </div>
);

export default Select;


