import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs font-medium animate-bounce-in">
      {type === 'error' ? (
        <AlertCircle className="text-red-400 shrink-0" size={18} />
      ) : (
        <CheckCircle className="text-emerald-400 shrink-0" size={18} />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
        <X size={15} />
      </button>
    </div>
  );
}
