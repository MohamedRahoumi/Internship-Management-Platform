const PageHeader = ({ title, children }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-xl font-bold text-ocp-800">{title}</h1>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);

export default PageHeader;
