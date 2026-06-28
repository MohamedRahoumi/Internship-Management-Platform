import { IconXClose } from './Icons';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto border border-ocp-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ocp-100">
          <h2 className="text-base font-semibold text-ocp-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-ocp-600 p-1 rounded-lg hover:bg-ocp-50 transition-colors">
            <IconXClose />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
