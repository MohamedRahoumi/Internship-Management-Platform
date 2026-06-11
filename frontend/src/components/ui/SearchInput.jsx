import { IconSearch } from './Icons';

const SearchInput = ({ value, onChange, placeholder = 'Rechercher...', className = '' }) => (
  <div className={`relative ${className}`}>
    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-field pl-9"
    />
  </div>
);

export default SearchInput;


