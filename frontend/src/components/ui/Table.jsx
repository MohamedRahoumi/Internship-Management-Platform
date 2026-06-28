const Table = ({ children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full text-sm">{children}</table>
  </div>
);

Table.Head = ({ children }) => (
  <thead>
    <tr className="border-b border-ocp-100 bg-ocp-50">
      {children}
    </tr>
  </thead>
);

Table.Header = ({ children, className = '', sortable, onClick }) => (
  <th
    className={`px-4 py-3 text-left text-xs font-semibold text-ocp-500 uppercase tracking-wider ${sortable ? 'cursor-pointer select-none hover:text-ocp-700' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
    {sortable && <span className="ml-1 text-ocp-200">&#x2195;</span>}
  </th>
);

Table.Body = ({ children }) => (
  <tbody className="divide-y divide-ocp-100">{children}</tbody>
);

Table.Row = ({ children, className = '', onClick }) => (
  <tr className={`${onClick ? 'cursor-pointer' : ''} hover:bg-ocp-50 transition-colors ${className}`} onClick={onClick}>
    {children}
  </tr>
);

Table.Cell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-ocp-700 ${className}`}>{children}</td>
);

Table.Empty = ({ colSpan, message = 'Aucune donnée trouvée' }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-12 text-center text-ocp-400">{message}</td>
  </tr>
);

export default Table;
