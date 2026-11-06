import React, { useState, useEffect } from 'react';
import CandidatePortal from './components/CandidatePortal';
import AdminPortal from './components/AdminPortal';
import ConfigModal from './components/ConfigModal';
import Toast from './components/Toast';
import { Briefcase, LogOut, Mail, Lock, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('recruit_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // 3 Email quản trị cố định
  const ADMIN_EMAILS = [
    'huynhhoangnhi1902@gmail.com',
    'phanthi04072006@gmail.com',
    'uyenthu160706@gmail.com'
  ];

  // Lưu trữ jobs vào localStorage để đồng bộ giữa Admin và Ứng viên
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('recruit_jobs');
    if (savedJobs) {
      try { return JSON.parse(savedJobs); } catch (e) { }
    }
    return [
      {
        job_id: 'JOB001',
        job_title: 'Java Backend Developer',
        job_description: 'Xây dựng và phát triển các hệ thống microservices sử dụng Java Spring Boot và MySQL.',
        required_skills: 'Java, Spring Boot, MySQL, RESTful API',
        preferred_skills: 'Docker, Redis, Microservices',
        required_experience: '1 - 3 năm',
        work_type: 'Full-time',
        benefits: 'Thưởng quý, bảo hiểm cao cấp, đào tạo chứng chỉ',
        deadline: '2026-12-31',
        status: 'Open'
      },
      {
        job_id: 'JOB002',
        job_title: 'Frontend React Developer',
        job_description: 'Phát triển giao diện ứng dụng web SPA với React, Tailwind CSS và Redux Toolkit.',
        required_skills: 'React, JavaScript, HTML5, CSS3, Tailwind CSS',
        preferred_skills: 'TypeScript, Next.js, Vite',
        required_experience: '1 - 2 năm',
        work_type: 'Full-time',
        benefits: 'Thưởng dự án, trợ cấp thiết bị, môi trường hybrid',
        deadline: '2026-12-31',
        status: 'Open'
      }
    ];
  });

  // Tự động lưu lại mỗi khi jobs thay đổi
  useEffect(() => {
    localStorage.setItem('recruit_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const [parserCandidates, setParserCandidates] = useState([
    {
      "Họ và tên": "NGUYỄN VĂN AN",
      "Email": "nguyenvanan.dev@gmail.com",
      "Số điện thoại": "0905123456",
      "Kỹ năng": "Java, Spring Boot, MySQL, Docker, RESTful API",
      "Kinh nghiệm": "2 năm lập trình Java Web",
      "Học Vấn": "Cử nhân Công nghệ Thông tin",
      "Vị trí ứng tuyển": "Java Backend Developer",
      "Thời gian nộp": "2026-11-01 09:30:00",
      "job_id": "JOB001",
      "Trạng thái gửi email cho HR": "Đã gửi"
    }
  ]);

  const [matchResults, setMatchResults] = useState([
    {
      "Họ và tên ứng viên": "NGUYỄN VĂN AN",
      "Email ứng viên": "nguyenvanan.dev@gmail.com",
      "Vị trí ứng tuyển": "Java Backend Developer",
      "Mã tin tuyển dụng": "JOB001",
      "Tên vị trí tuyển dụng": "Java Backend Developer",
      "Điểm phù hợp": 9.0,
      "Đề xuất đánh giá": "Phù hợp cao",
      "Kỹ năng bắt buộc phù hợp": "Java, Spring Boot, MySQL, RESTful API",
      "Kỹ năng bắt buộc còn thiếu": "Không",
      "Kỹ năng ưu tiên phù hợp": "Docker",
      "Kỹ năng ưu tiên còn thiếu": "Redis, Microservices",
      "Lý do đánh giá": "Ứng viên đáp ứng 100% kỹ năng cốt lõi và có kinh nghiệm thực tế.",
      "Quyết định của HR": "Pending Review",
      "Ngày phỏng vấn": "-",
      "Giờ phỏng vấn": "-",
      "Google Meet": "",
      "Trạng thái gửi email cho ứng viên": "Chưa gửi"
    }
  ]);

  const [n8nConfig, setN8nConfig] = useState(() => {
  const savedConfig = localStorage.getItem('n8nConfig');

  return savedConfig ? JSON.parse(savedConfig) : {
    uploadCvUrl: 'https://n8n-production-2734a.up.railway.app/webhook/upload-cv',
    jobManagementUrl: 'https://n8n-production-2734a.up.railway.app/webhook/manage-jobs',
    hrDecisionUrl: 'https://n8n-production-2734a.up.railway.app/webhook/hr-decision',
    getSheetDataUrl: 'https://n8n-production-2734a.up.railway.app/webhook/get-sheet-data'
  };
});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchSheetData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(n8nConfig.getSheetDataUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
          localStorage.setItem('recruit_jobs', JSON.stringify(data.jobs));
        }
        if (data.parserCandidates && data.parserCandidates.length > 0) setParserCandidates(data.parserCandidates);
        if (data.matchResults && data.matchResults.length > 0) setMatchResults(data.matchResults);
        showToast('Đã đồng bộ dữ liệu mới nhất từ Google Sheet!');
      } else {
        showToast('Đang hiển thị dữ liệu lưu trữ.', 'info');
      }
    } catch (err) {
      console.warn('Lỗi gọi Webhook n8n:', err);
      showToast('Đang hiển thị dữ liệu lưu trữ.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast('Vui lòng nhập địa chỉ email.', 'error');
      return;
    }

    const emailLower = loginEmail.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(emailLower);

    const userData = {
      email: emailLower,
      role: isAdmin ? 'admin' : 'candidate'
    };

    setCurrentUser(userData);
    localStorage.setItem('recruit_user', JSON.stringify(userData));

    if (isAdmin) {
      showToast('Đăng nhập thành công với quyền Quản trị viên!');
    } else {
      showToast('Đăng nhập thành công vào Cổng ứng viên!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('recruit_user');
    showToast('Đã đăng xuất khỏi hệ thống.');
  };

  // MÀN HÌNH ĐĂNG NHẬP
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#174EA6]/90 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full p-8 md:p-10 shadow-2xl border border-white/20 relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#174EA6] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Briefcase size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cổng Tuyển Dụng</h1>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Đăng nhập để quản lý hoặc ứng tuyển vị trí việc làm.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#174EA6] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#174EA6] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 mt-2 group cursor-pointer"
            >
              <span>Truy Cập Hệ Thống</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    );
  }

  // SAU KHI ĐĂNG NHẬP
  return (
    <div className="min-h-screen bg-[#F3F6FC]">
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
           
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 hidden sm:inline">
              Xin chào, <strong className="text-slate-800">{currentUser.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {currentUser.role === 'admin' ? (
        <AdminPortal
          jobs={jobs}
          setJobs={setJobs}
          parserCandidates={parserCandidates}
          matchResults={matchResults}
          setMatchResults={setMatchResults}
          hrWebhookUrl={n8nConfig.hrDecisionUrl}
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
          webhookUrl={n8nConfig.uploadCvUrl}
          fetchSheetData={fetchSheetData}
          isLoading={isLoading}
          showToast={showToast}
        />
      )}

      {showConfigModal && (
        <ConfigModal
          n8nConfig={n8nConfig}
          setN8nConfig={setN8nConfig}
          onClose={() => setShowConfigModal(false)}
          showToast={showToast}
        />
      )}

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
