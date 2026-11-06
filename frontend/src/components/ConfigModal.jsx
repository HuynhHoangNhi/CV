import React from 'react';
import { X, Settings } from 'lucide-react';

export default function ConfigModal({ n8nConfig, setN8nConfig, onClose, showToast }) {
  const handleSubmit = (e) => {
  e.preventDefault();

  localStorage.setItem('n8nConfig', JSON.stringify(n8nConfig));

  showToast('Cấu hình n8n API đã được cập nhật thành công!');
  onClose();
};
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 text-[#174EA6] rounded-lg flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Cấu Hình n8n API System</h3>
            <p className="text-xs text-slate-500">Nhập URL của các điểm cuối Webhook trên hệ thống n8n.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WF1: Upload & Bóc Tách CV (POST)</label>
            <input
              type="text"
              value={n8nConfig.uploadCvUrl || ''}
              onChange={e => setN8nConfig({ ...n8nConfig, uploadCvUrl: e.target.value })}
              placeholder="http://localhost:5678/webhook/upload-cv"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:border-[#174EA6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WF2: Quản lý Vị trí Tuyển dụng (POST/PUT)</label>
            <input
              type="text"
              value={n8nConfig.jobManagementUrl || ''}
              onChange={e => setN8nConfig({ ...n8nConfig, jobManagementUrl: e.target.value })}
              placeholder="http://localhost:5678/webhook/manage-jobs"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:border-[#174EA6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WF3: HR Decision, Phỏng vấn & Gửi email (POST)</label>
            <input
              type="text"
              value={n8nConfig.hrDecisionUrl || ''}
              onChange={e => setN8nConfig({ ...n8nConfig, hrDecisionUrl: e.target.value })}
              placeholder="http://localhost:5678/webhook/hr-decision"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:border-[#174EA6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Get Sheet Data (GET)</label>
            <input
              type="text"
              value={n8nConfig.getSheetDataUrl || ''}
              onChange={e => setN8nConfig({ ...n8nConfig, getSheetDataUrl: e.target.value })}
              placeholder="http://localhost:5678/webhook/get-sheet-data"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:border-[#174EA6] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
