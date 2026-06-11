import { IconChevronLeft, IconChevronRight } from './Icons';

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm text-slate-500">
      <span>Page {meta.current_page} / {meta.last_page} ({meta.total} entrées)</span>
      <div className="flex gap-1">
        <button
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
          className="btn border border-slate-300 rounded px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50"
        >
          <IconChevronLeft /> Précédent
        </button>
        <button
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
          className="btn border border-slate-300 rounded px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50"
        >
          Suivant <IconChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;


