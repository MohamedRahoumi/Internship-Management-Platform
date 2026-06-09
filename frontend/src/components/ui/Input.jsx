const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="label-field">{label}</label>}
    <input className={`input-field ${error ? 'input-error' : ''}`} {...props} />
    {error && <p className="error-text">{error}</p>}
  </div>
);

export default Input;
