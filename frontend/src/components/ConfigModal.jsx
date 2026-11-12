import React from 'react';
import { X, Settings } from 'lucide-react';

const VPS_URL = 'https://cv-n8n.duckdns.org';

export default function ConfigModal({
  n8nConfig,
  setN8nConfig,
  onClose,
  showToast
}) {
  const fields = [
    {
      key: 'uploadCvUrl',
      label: 'WF1: Upload & Bóc tách CV (POST)',
      endpoint: '/webhook/upload-cv'
    },
    {
      key: 'jobManagementUrl',
      label: 'WF2: Quản lý vị trí tuyển dụng (POST)',
      endpoint: '/webhook/manage-jobs'
    },
    {
      key: 'hrDecisionUrl',
      label: 'WF3: HR Decision & Phỏng vấn (POST)',
      endpoint: '/webhook/hr-decision'
    },
    {
      key: 'getSheetDataUrl',
      label: 'Đồng bộ dữ liệu PostgreSQL (GET)',
      endpoint: '/webhook/get-sheet-data'
    }
  ];

  const handleChange = (key, value) => {
    setN8nConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urls = fields.map(field => ({
      key: field.key,
      value: n8nConfig?.[field.key]?.trim()
    }));

    for (const item of urls) {
      if (!item.value) {
        showToast?.('Vui lòng nhập đầy đủ URL webhook.', 'error');
        return;
      }

      try {
        const parsedUrl = new URL(item.value);

        if (parsedUrl.protocol !== 'https:') {
          showToast?.('Webhook phải sử dụng HTTPS.', 'error');
          return;
        }
      } catch {
        showToast?.('URL webhook không hợp lệ.', 'error');
        return;
      }
    }

    const updatedConfig = Object.fromEntries(
      urls.map(item => [item.key, item.value])
    );

    setN8nConfig(updatedConfig);

    localStorage.setItem(
      'n8nConfig',
      JSON.stringify(updatedConfig)
    );

    showToast?.('Đã lưu cấu hình n8n VPS thành công!');

    onClose();
  };

  const handleReset = () => {
    const defaultConfig = Object.fromEntries(
      fields.map(field => [
        field.key,
        `${VPS_URL}${field.endpoint}`
      ])
    );

    setN8nConfig(defaultConfig);

    showToast?.('Đã khôi phục URL VPS mặc định.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 text-[#174EA6] rounded-lg flex items-center justify-center">
            <Settings size={20} />
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              Cấu hình n8n API System
            </h3>

            <p className="text-xs text-slate-500">
              Kết nối hệ thống tuyển dụng với n8n VPS và PostgreSQL.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {field.label}
              </label>

              <input
                type="url"
                required
                value={n8nConfig?.[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={`${VPS_URL}${field.endpoint}`}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:border-[#174EA6] focus:outline-none text-slate-800"
              />
            </div>
          ))}

          <div className="flex justify-between gap-2 pt-3 border-t border-slate-200">

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-50"
            >
              Khôi phục URL VPS
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Lưu cấu hình
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
