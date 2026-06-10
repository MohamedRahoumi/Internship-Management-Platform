const Table = ({ children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full text-sm">{children}</table>
  </div>
);

Table.Head = ({ children }) => (
  <thead>
    <tr className="border-b border-slate-200 bg-slate-50">
      {children}
    </tr>
  </thead>
);

Table.Header = ({ children, className = '', sortable, onClick }) => (
  <th
    className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${sortable ? 'cursor-pointer select-none hover:text-slate-700' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
    {sortable && <span className="ml-1 text-slate-300">&#x2195;</span>}
  </th>
);

Table.Body = ({ children }) => (
  <tbody className="divide-y divide-slate-200">{children}</tbody>
);

Table.Row = ({ children, className = '', onClick }) => (
  <tr className={`${onClick ? 'cursor-pointer' : ''} hover:bg-slate-50 ${className}`} onClick={onClick}>
    {children}
  </tr>
);

Table.Cell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-slate-700 ${className}`}>{children}</td>
);

Table.Empty = ({ colSpan, message = 'Aucune donnée trouvée' }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-12 text-center text-slate-400">{message}</td>
  </tr>
);

export default Table;




