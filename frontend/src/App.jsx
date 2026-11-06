
import React, { useState, useEffect, useRef, useCallback } from 'react';

import CandidatePortal from './components/CandidatePortal';
import AdminPortal from './components/AdminPortal';
import ConfigModal from './components/ConfigModal';
import Toast from './components/Toast';

import {
  Briefcase,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  RefreshCw,
  Settings
} from 'lucide-react';

const DEFAULT_RAILWAY_CONFIG = {
  uploadCvUrl:
    'https://n8n-production-2734a.up.railway.app/webhook/upload-cv',

  jobManagementUrl:
    'https://n8n-production-2734a.up.railway.app/webhook/manage-jobs',

  hrDecisionUrl:
    'https://n8n-production-2734a.up.railway.app/webhook/hr-decision',

  getSheetDataUrl:
    'https://n8n-production-2734a.up.railway.app/webhook/get-sheet-data'
};

// Danh sách email quản trị
const ADMIN_EMAILS = [
  'huynhhoangnhi1902@gmail.com',
  'phanthi04072006@gmail.com',
  'uyenthu160706@gmail.com'
];

// Dữ liệu công việc mặc định
const INITIAL_JOBS = [
  {
    job_id: 'JOB001',
    job_title: 'Java Backend Developer',
    job_description:
      'Xây dựng và phát triển các hệ thống microservices sử dụng Java Spring Boot và MySQL.',
    required_skills:
      'Java, Spring Boot, MySQL, RESTful API',
    preferred_skills:
      'Docker, Redis, Microservices',
    required_experience: '1 - 3 năm',
    work_type: 'Full-time',
    benefits:
      'Thưởng quý, bảo hiểm cao cấp, đào tạo chứng chỉ',
    deadline: '2026-12-31',
    status: 'Open'
  }
];

function loadJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return fallback;

    const parsed = JSON.parse(saved);

    return parsed ?? fallback;
  } catch (error) {
    console.error(`Không thể đọc ${key}:`, error);
    return fallback;
  }
}

export default function App() {
  // ==============================
  // USER SESSION
  // ==============================

  const [currentUser, setCurrentUser] = useState(() =>
    loadJson('recruit_user', null)
  );

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ==============================
  // SYSTEM STATE
  // ==============================

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Ngăn nhiều yêu cầu đồng bộ chạy đồng thời
  const syncInProgress = useRef(false);

  // ==============================
  // N8N CONFIGURATION
  // ==============================

  const [n8nConfig, setN8nConfig] = useState(() => {
    const savedConfig = loadJson('n8nConfig', null);

    if (!savedConfig || typeof savedConfig !== 'object') {
      return DEFAULT_RAILWAY_CONFIG;
    }

    // Gộp cấu hình cũ với cấu hình mặc định
    const mergedConfig = {
      ...DEFAULT_RAILWAY_CONFIG,
      ...savedConfig
    };

    // Chuyển cấu hình localhost cũ sang Railway
    if (
      Object.values(mergedConfig).some(
        url => typeof url === 'string' && url.includes('localhost')
      )
    ) {
      return DEFAULT_RAILWAY_CONFIG;
    }

    return mergedConfig;
  });

  useEffect(() => {
    localStorage.setItem(
      'n8nConfig',
      JSON.stringify(n8nConfig)
    );
  }, [n8nConfig]);

  // ==============================
  // RECRUITMENT DATA
  // ==============================

  const [jobs, setJobs] = useState(() => {
    const savedJobs = loadJson('recruit_jobs', null);

    return Array.isArray(savedJobs)
      ? savedJobs
      : INITIAL_JOBS;
  });

  const [parserCandidates, setParserCandidates] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  // Lưu danh sách công việc vào localStorage
  useEffect(() => {
    localStorage.setItem(
      'recruit_jobs',
      JSON.stringify(jobs)
    );
  }, [jobs]);

  // ==============================
  // TOAST NOTIFICATION
  // ==============================

  const showToast = useCallback((message, type = 'success') => {
    setToast({
      message,
      type
    });
  }, []);

  // ==============================
  // SYNC GOOGLE SHEETS THROUGH N8N
  // ==============================

  const fetchSheetData = useCallback(async () => {
    if (syncInProgress.current) {
      return false;
    }

    if (!n8nConfig.getSheetDataUrl) {
      showToast('Chưa cấu hình URL đồng bộ dữ liệu.', 'error');
      return false;
    }

    syncInProgress.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(
        n8nConfig.getSheetDataUrl,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `Webhook trả về lỗi HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (!data || typeof data !== 'object') {
        throw new Error('Dữ liệu trả về không hợp lệ.');
      }

      if (data.success === false) {
        throw new Error(
          data.message || 'n8n không thể đọc dữ liệu Google Sheets.'
        );
      }

      // Kiểm tra đầy đủ cấu trúc phản hồi
      const requiredArrays = [
        'jobs',
        'parserCandidates',
        'matchResults'
      ];

      const invalidFields = requiredArrays.filter(
        field => !Array.isArray(data[field])
      );

      if (invalidFields.length > 0) {
        throw new Error(
          `Thiếu dữ liệu hoặc sai định dạng: ${invalidFields.join(', ')}`
        );
      }

      // Cập nhật dữ liệu từ Google Sheets
      setJobs(data.jobs);
      setParserCandidates(data.parserCandidates);
      setMatchResults(data.matchResults);

      // Cập nhật dữ liệu công việc vào localStorage
      localStorage.setItem(
        'recruit_jobs',
        JSON.stringify(data.jobs)
      );

      showToast(
        'Đồng bộ dữ liệu Google Sheets thành công!',
        'success'
      );

      return true;

    } catch (error) {
      console.error('Lỗi đồng bộ dữ liệu:', error);

      showToast(
        error.message || 'Không thể đồng bộ dữ liệu từ n8n.',
        'error'
      );

      return false;

    } finally {
      syncInProgress.current = false;
      setIsLoading(false);
    }
  }, [n8nConfig.getSheetDataUrl, showToast]);

  // ==============================
  // AUTO SYNC AFTER LOGIN
  // ==============================

  useEffect(() => {
    if (currentUser) {
      fetchSheetData();
    }
  }, [currentUser, fetchSheetData]);

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = (e) => {
    e.preventDefault();

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!email) {
      showToast('Vui lòng nhập địa chỉ email.', 'error');
      return;
    }

    if (!password) {
      showToast('Vui lòng nhập mật khẩu.', 'error');
      return;
    }

    const isAdmin = ADMIN_EMAILS.includes(email);

    const userData = {
      email,
      role: isAdmin ? 'admin' : 'candidate'
    };

    setCurrentUser(userData);

    localStorage.setItem(
      'recruit_user',
      JSON.stringify(userData)
    );

    setLoginPassword('');

    showToast(
      isAdmin
        ? 'Đăng nhập thành công với quyền Quản trị viên!'
        : 'Đăng nhập thành công vào Cổng ứng viên!'
    );
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    setCurrentUser(null);

    localStorage.removeItem('recruit_user');

    setLoginEmail('');
    setLoginPassword('');

    showToast('Đã đăng xuất khỏi hệ thống.');
  };

  // ==============================
  // LOGIN SCREEN
  // ==============================

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#174EA6]/90 to-slate-900 flex items-center justify-center p-4">

        <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full p-8 md:p-10 shadow-2xl border border-white/20 relative overflow-hidden">

          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* LOGO */}
          <div className="text-center mb-8">

            <div className="w-14 h-14 bg-[#174EA6] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Briefcase size={28} />
            </div>

            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Cổng Tuyển Dụng
            </h1>

            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Đăng nhập để quản lý hoặc ứng tuyển vị trí việc làm.
            </p>

          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* EMAIL */}
            <div>

              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Địa chỉ Email
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-3.5 top-3 text-slate-400"
                  size={18}
                />

                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#174EA6] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-medium text-slate-800"
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mật khẩu
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-3.5 top-3 text-slate-400"
                  size={18}
                />

                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#174EA6] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-medium text-slate-800"
                />

              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 mt-2 group cursor-pointer"
            >

              <span>Truy Cập Hệ Thống</span>

              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />

            </button>

          </form>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      </div>
    );
  }

  // ==============================
  // MAIN APPLICATION
  // ==============================

  return (
    <div className="min-h-screen bg-[#F3F6FC]">

      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-sm">

        <div className="max-w-[1500px] mx-auto flex items-center justify-between">

          {/* BRAND */}
          <div className="text-xs font-bold text-[#174EA6] uppercase tracking-wider flex items-center gap-2">

            <Briefcase size={18} />

            {isLoading && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                Đang đồng bộ...
              </span>
            )}

          </div>

          {/* HEADER ACTIONS */}
          <div className="flex items-center gap-3">

            {/* MANUAL SYNC */}
            <button
              onClick={fetchSheetData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Đồng bộ lại từ Google Sheets"
            >

              <RefreshCw
                size={14}
                className={isLoading ? 'animate-spin' : ''}
              />

              Đồng bộ

            </button>

            {/* CONFIGURATION */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >

              <Settings size={14} />

              Cấu hình

            </button>

            {/* USER */}
            <span className="text-xs text-slate-600 hidden sm:inline">
              Xin chào,{' '}
              <strong className="text-slate-800">
                {currentUser.email}
              </strong>
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >

              <LogOut size={14} />

              Đăng xuất

            </button>

          </div>
        </div>
      </header>

      {/* ADMIN / CANDIDATE PORTAL */}
      {currentUser.role === 'admin' ? (

        <AdminPortal
          jobs={jobs}
          setJobs={setJobs}
          parserCandidates={parserCandidates}
          matchResults={matchResults}
          setMatchResults={setMatchResults}

          // Webhook xử lý quyết định HR
          hrWebhookUrl={n8nConfig.hrDecisionUrl}

          // Webhook thêm / sửa / xóa công việc
          jobManagementUrl={n8nConfig.jobManagementUrl}

          // Đồng bộ dữ liệu Google Sheets
          fetchSheetData={fetchSheetData}
          isLoading={isLoading}

          showToast={showToast}
          setShowConfigModal={setShowConfigModal}
        />

      ) : (

        <CandidatePortal
          jobs={jobs}
          parserCandidates={parserCandidates}
          setParserCandidates={setParserCandidates}
          matchResults={matchResults}
          setMatchResults={setMatchResults}

          // Webhook tải CV
          webhookUrl={n8nConfig.uploadCvUrl}

          // Đồng bộ dữ liệu
          fetchSheetData={fetchSheetData}
          isLoading={isLoading}

          showToast={showToast}
        />

      )}

      {/* CONFIGURATION MODAL */}
      {showConfigModal && (
        <ConfigModal
          n8nConfig={n8nConfig}
          setN8nConfig={setN8nConfig}
          onClose={() => setShowConfigModal(false)}
          showToast={showToast}
        />
      )}

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
