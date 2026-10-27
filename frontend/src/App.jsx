import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Bot,
  Mail,
  Calendar as CalendarIcon,
  Check,
  X,
  Building,
  UserCheck,
  Inbox,
  Send,
  Video,
  Sparkles,
  Plus,
  Settings,
  Link as LinkIcon,
} from "lucide-react";

// --- DEFAULT MOCK DATA FOR UI DEMO ---

const initialJobs = [
  {
    id: "JOB001",
    title: "Backend Spring Boot Developer",
    department: "Backend Engineering",
    location: "Đà Nẵng / Hybrid",
    salary: "15M - 25M VNĐ",
    type: "Toàn thời gian",
    description:
      "Tham gia phát triển hệ thống Microservices backend sử dụng Java Spring Boot. Thiết kế RESTful APIs và tối ưu hóa truy vấn SQL.",
    requirements: [
      "Nắm vững Java Core, Spring Boot, JPA",
      "Thành thạo SQL (PostgreSQL / MySQL)",
      "Có hiểu biết về Docker, Git flow",
    ],
  },
  {
    id: "JOB002",
    title: "n8n Automation & Integration Specialist",
    department: "Data & Automation",
    location: "Remote",
    salary: "18M - 30M VNĐ",
    type: "Toàn thời gian",
    description:
      "Xây dựng các luồng tự động hóa bằng n8n kết hợp OpenAI/Groq API, Google Workspace (Sheets, Gmail, Calendar) phục vụ tuyển dụng tự động.",
    requirements: [
      "Thành thạo n8n Workflow Automation",
      "Có kinh nghiệm về REST APIs, Webhooks, JavaScript",
      "Hiểu biết về Prompt Engineering & LLM",
    ],
  },
  {
    id: "JOB003",
    title: "Frontend ReactJS Engineer",
    department: "Frontend Engineering",
    location: "Hà Nội",
    salary: "20M - 35M VNĐ",
    type: "Toàn thời gian",
    description:
      "Phát triển giao diện Web Application tương tác với n8n Webhook. Phối hợp thiết kế UI/UX hiện đại sử dụng Tailwind CSS.",
    requirements: [
      "2+ năm kinh nghiệm ReactJS, ES6+, Hooks",
      "Thành thạo Tailwind CSS, Responsive Design",
      "Kinh nghiệm tích hợp REST APIs",
    ],
  },
];

const initialCandidates = [
  {
    id: "CAND-001",
    jobId: "JOB001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    uploadTime: "2026-10-27 08:30",
    ocrStatus: "Thành công",
    aiScore: 8.5,
    pros: "Nắm vững Java Core, Spring Boot, có dự án thực tế.",
    cons: "Chưa có nhiều kinh nghiệm làm việc với Docker.",
    skillGap: "Đáp ứng 90% kỹ năng bắt buộc.",
    hrStatus: "Pending Review",
    mailStatus: "Chưa gửi",
    interviewDate: "2026-11-02",
    interviewTime: "09:00",
    meetLink: "https://meet.google.com/abc-xyz",
  },
  {
    id: "CAND-002",
    jobId: "JOB002",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    uploadTime: "2026-10-27 09:15",
    ocrStatus: "Thành công",
    aiScore: 9.2,
    pros: "Thành thạo n8n, Groq API, kết nối Google APIs tốt.",
    cons: "Cần nâng cao tiếng Anh giao tiếp.",
    skillGap: "Hoàn toàn đáp ứng yêu cầu công việc.",
    hrStatus: "Approve",
    mailStatus: "Đã gửi",
    interviewDate: "2026-11-03",
    interviewTime: "14:00",
    meetLink: "https://meet.google.com/n8n-interview",
  },
  {
    id: "CAND-003",
    jobId: "JOB001",
    name: "Phạm Minh D",
    email: "phamminhd@gmail.com",
    uploadTime: "2026-10-27 11:20",
    ocrStatus: "Thành công",
    aiScore: 4.5,
    pros: "Thái độ cầu tiến, hình thức CV chỉn chu.",
    cons: "Thiếu kiến thức nền tảng về Java backend.",
    skillGap: "Thiếu các kỹ năng bắt buộc: Spring Boot, SQL.",
    hrStatus: "Reject",
    mailStatus: "Đã gửi",
    interviewDate: "-",
    interviewTime: "-",
    meetLink: "-",
  },
];

export default function App() {
  const [appMode, setAppMode] = useState("CANDIDATE"); // 'CANDIDATE' | 'ADMIN'
  const [adminTab, setAdminTab] = useState(1); // 1, 2, 3
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Webhook URL configuration for n8n
  const [webhookUrl, setWebhookUrl] = useState(
    "http://localhost:5678/webhook/upload-cv",
  );
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [jobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(initialCandidates);

  // Candidate Apply Modal State
  const [searchJob, setSearchJob] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFile, setApplyFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      4500,
    );
  };

  // --- SUBMIT CV TO N8N WEBHOOK ---
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyFile) {
      showToast("Vui lòng chọn file CV định dạng PDF!", "error");
      return;
    }

    setIsSubmitting(true);
    showToast("Đang tải CV lên và nộp qua n8n Webhook...", "info");

    try {
      // Build FormData payload matching n8n Webhook structure
      const formData = new FormData();
      formData.append("data", applyFile); // binary field expected by n8n
      formData.append("job_id", selectedJob.id);
      formData.append("job_title", selectedJob.title);

      // Call n8n Webhook (WF1 Intake)
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      showToast(
        "Nộp CV thành công! n8n đang bóc tách AI và cập nhật Google Sheet.",
        "success",
      );

      // Simulate optimistic update in local state for UI demonstration
      const newCandidate = {
        id: `CAND-${Math.floor(100 + Math.random() * 900)}`,
        jobId: selectedJob.id,
        name: applyFile.name.replace(".pdf", ""),
        email: "ungvien.moi@gmail.com",
        uploadTime: new Date().toISOString().slice(0, 16).replace("T", " "),
        ocrStatus: "Đang bóc tách",
        aiScore: null,
        pros: "Đang chờ n8n Groq AI phân tích...",
        cons: "-",
        skillGap: "Đang đối chiếu với JD...",
        hrStatus: "Pending Review",
        mailStatus: "Chưa gửi",
        interviewDate: "",
        interviewTime: "",
        meetLink: "",
      };

      setCandidates([newCandidate, ...candidates]);
      setShowApplyModal(false);
      setApplyFile(null);
      setSelectedJob(null);
    } catch (err) {
      console.warn("Webhook Error, fallback to simulation mode:", err);
      showToast(
        "Kết nối n8n Webhook thất bại (Đã bật chế độ mô phỏng UI).",
        "warning",
      );

      // Fallback optimistic display if n8n local instance is offline
      const mockCandidate = {
        id: `CAND-${Math.floor(100 + Math.random() * 900)}`,
        jobId: selectedJob.id,
        name: applyFile
          ? applyFile.name.replace(/\.[^/.]+$/, "")
          : "Ứng viên thử nghiệm",
        email: "demo.candidate@gmail.com",
        uploadTime: new Date().toISOString().slice(0, 16).replace("T", " "),
        ocrStatus: "Thành công",
        aiScore: 8.0,
        pros: "Phù hợp với vị trí, có kỹ năng chuyên môn đáp ứng yêu cầu.",
        cons: "Cần kiểm tra lại bằng cấp thực tế.",
        skillGap: "Đạt 85% yêu cầu kỹ năng.",
        hrStatus: "Pending Review",
        mailStatus: "Chưa gửi",
        interviewDate: "",
        interviewTime: "",
        meetLink: "",
      };
      setCandidates([mockCandidate, ...candidates]);
      setShowApplyModal(false);
      setApplyFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle HR Decision (Approve/Reject) in Admin UI
  const handleHRDecision = (id, status) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            hrStatus: status,
            mailStatus: "Chưa gửi (n8n WF3 sẽ tự động gửi)",
            interviewDate: status === "Approve" ? "2026-11-05" : "-",
            interviewTime: status === "Approve" ? "10:00" : "-",
            meetLink:
              status === "Approve"
                ? "https://meet.google.com/auto-generated"
                : "-",
          };
        }
        return c;
      }),
    );
    showToast(
      `Đã cập nhật trạng thái: ${status === "Approve" ? "Duyệt phỏng vấn" : "Từ chối CV"}.`,
    );
  };

  const getJobTitle = (jobId) =>
    jobs.find((j) => j.id === jobId)?.title || jobId;

  // ============================================================================
  // RENDER: CANDIDATE PORTAL
  // ============================================================================
  const renderCandidatePortal = () => {
    const filteredJobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(searchJob.toLowerCase()) ||
        j.department.toLowerCase().includes(searchJob.toLowerCase()),
    );

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white pt-16 pb-24 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block border border-indigo-400/30">
              Hệ thống Tuyển dụng AI & n8n Automation
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Ứng Tuyển Nhanh - Đánh Giá Công Bằng
            </h1>
            <p className="text-indigo-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Tải CV của bạn lên để n8n & AI tự động phân tích kỹ năng, chấm
              điểm và nhận phản hồi trực tiếp qua Gmail.
            </p>

            <div className="bg-white rounded-2xl p-2 flex items-center shadow-2xl max-w-2xl mx-auto border border-slate-200">
              <Search className="w-6 h-6 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí tuyển dụng, phòng ban..."
                value={searchJob}
                onChange={(e) => setSearchJob(e.target.value)}
                className="w-full bg-transparent border-none text-slate-800 px-4 py-3 focus:outline-none text-sm md:text-base"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shrink-0">
                Tìm Kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-700">
              Vị trí đang tuyển dụng ({filteredJobs.length})
            </h2>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" /> Cấu hình Webhook n8n
            </button>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                      {job.id}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {job.department}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />{" "}
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-600" />{" "}
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" /> Đang nhận CV
                    </span>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowApplyModal(true);
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition"
                  >
                    Ứng Tuyển Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Job Details */}
        {selectedJob && !showApplyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>

              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                {selectedJob.id} - {selectedJob.department}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                {selectedJob.title}
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs md:text-sm">
                <div>
                  <span className="text-slate-400 block mb-1">Mức lương</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> {selectedJob.salary}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Địa điểm</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-indigo-500" />{" "}
                    {selectedJob.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Hình thức</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-amber-500" />{" "}
                    {selectedJob.type}
                  </span>
                </div>
              </div>

              <div className="space-y-6 text-sm text-slate-600">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Mô tả công việc
                  </h3>
                  <p className="leading-relaxed">{selectedJob.description}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Yêu cầu kỹ năng (n8n & AI sẽ đối chiếu)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition"
                >
                  Nộp CV Cho Vị Trí Này
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Apply Form */}
        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Nộp Hồ Sơ Ứng Tuyển
                </h3>
                <p className="text-xs text-indigo-600 font-medium mt-1">
                  {selectedJob.title} ({selectedJob.id})
                </p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tải lên file CV (Định dạng PDF) *
                  </label>
                  <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-6 text-center bg-indigo-50/40 hover:bg-indigo-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => setApplyFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FileText className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                    {applyFile ? (
                      <p className="text-sm font-bold text-emerald-600">
                        {applyFile.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-slate-700 font-semibold">
                          Bấm để chọn file hoặc kéo thả file vào đây
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Chấp nhận file PDF tối đa 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    CV của bạn sẽ được gửi tới <b>n8n Webhook</b> để tự động bóc
                    tách kỹ năng, học vấn và đối chiếu với JD qua Groq LLM.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Đang xử lý
                      qua n8n...
                    </>
                  ) : (
                    "Xác Nhận Nộp CV"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // RENDER: ADMIN PORTAL (PERSON 1, PERSON 2, PERSON 3)
  // ============================================================================
  const renderAdminPortal = () => {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
        {/* Admin Tabs Bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 md:px-8 pt-3">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setAdminTab(1)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition whitespace-nowrap ${adminTab === 1 ? "bg-slate-900 text-indigo-400 border-t-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"}`}
            >
              <Briefcase className="w-4 h-4" /> Người 1: Quản lý CV & Jobs (WF1,
              WF2, WF3)
            </button>
            <button
              onClick={() => setAdminTab(2)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition whitespace-nowrap ${adminTab === 2 ? "bg-slate-900 text-amber-400 border-t-2 border-amber-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"}`}
            >
              <Bot className="w-4 h-4" /> Người 2: AI Chấm Điểm & Matching (WF4,
              WF5)
            </button>
            <button
              onClick={() => setAdminTab(3)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition whitespace-nowrap ${adminTab === 3 ? "bg-slate-900 text-emerald-400 border-t-2 border-emerald-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"}`}
            >
              <UserCheck className="w-4 h-4" /> Người 3: HR Duyệt, Mail & Lịch
              PV (WF6, WF7, WF8, WF9)
              {candidates.filter((c) => c.hrStatus === "Pending Review")
                .length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                  {
                    candidates.filter((c) => c.hrStatus === "Pending Review")
                      .length
                  }
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Admin Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* TAB 1: NGƯỜI 1 - QUẢN LÝ CV VÀ JOB */}
          {adminTab === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-400" /> Quản Lý
                    Danh Sách Công Việc & Tiếp Nhận CV
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Nguồn dữ liệu được đồng bộ trực tiếp với Google Sheets:{" "}
                    <code>Danh sách ứng viên - CV Parser</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono">
                    <LinkIcon className="w-3.5 h-3.5" /> n8n Node: Webhook +
                    Extract File
                  </span>
                </div>
              </div>

              {/* Table 1: Jobs Active */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-200">
                    Bảng Tin Tuyển Dụng (Sheet: <code>Job_Postings</code>)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase">
                      <tr>
                        <th className="px-5 py-3">Mã Job</th>
                        <th className="px-5 py-3">Tiêu đề vị trí</th>
                        <th className="px-5 py-3">Phòng ban</th>
                        <th className="px-5 py-3">Mức lương</th>
                        <th className="px-5 py-3">Số CV đã nộp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-slate-300">
                      {jobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-700/30">
                          <td className="px-5 py-3 font-mono font-bold text-indigo-400">
                            {j.id}
                          </td>
                          <td className="px-5 py-3 font-semibold text-slate-100">
                            {j.title}
                          </td>
                          <td className="px-5 py-3 text-slate-400">
                            {j.department}
                          </td>
                          <td className="px-5 py-3 text-emerald-400 font-medium">
                            {j.salary}
                          </td>
                          <td className="px-5 py-3 font-bold text-slate-200">
                            {candidates.filter((c) => c.jobId === j.id).length}{" "}
                            CV
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: CV Intake OCR Log */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-200">
                    Nhật Ký Tiếp Nhận CV & Trích Xuất (Sheet:{" "}
                    <code>Danh sách ứng viên - CV Parser</code>)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase">
                      <tr>
                        <th className="px-4 py-3">Mã UV</th>
                        <th className="px-4 py-3">Họ và Tên</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Vị trí ứng tuyển</th>
                        <th className="px-4 py-3">Thời gian nộp</th>
                        <th className="px-4 py-3">Trạng thái OCR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-slate-300">
                      {candidates.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-700/30">
                          <td className="px-4 py-3 font-mono text-slate-400">
                            {c.id}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-100">
                            {c.name}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {c.email}
                          </td>
                          <td className="px-4 py-3 text-indigo-300 font-medium">
                            {getJobTitle(c.jobId)}
                          </td>
                          <td className="px-4 py-3 text-slate-400 font-mono">
                            {c.uploadTime}
                          </td>
                          <td className="px-4 py-3">
                            {c.ocrStatus === "Thành công" && (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-medium">
                                <CheckCircle className="w-3 h-3" /> Thành công
                              </span>
                            )}
                            {c.ocrStatus === "Đang bóc tách" && (
                              <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-medium animate-pulse">
                                <RefreshCw className="w-3 h-3 animate-spin" />{" "}
                                n8n Processing...
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NGƯỜI 2 - CHẤM ĐIỂM VÀ MATCHING */}
          {adminTab === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-400" /> Kết Quả Đánh Giá
                    CV Match & Điểm AI (n8n Workflow 2)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Đối chiếu từ khóa kỹ năng giữa CV và JD bằng n8n Code Node &
                    Groq LLM
                  </p>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" /> n8n Node: Code
                  (Score_CV_Match)
                </span>
              </div>

              {/* Matching Table */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80">
                  <h3 className="font-bold text-sm text-slate-200">
                    Bảng Điểm Phù Hợp (Sheet: <code>CV_Match_Results</code>)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase">
                      <tr>
                        <th className="px-4 py-3">Ứng viên / Mã</th>
                        <th className="px-4 py-3 text-center">Điểm AI (10)</th>
                        <th className="px-4 py-3">
                          Phân tích Kỹ năng (Match / Missing)
                        </th>
                        <th className="px-4 py-3">Lý do đánh giá tự động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-slate-300">
                      {candidates.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-700/30">
                          <td className="px-4 py-4">
                            <div className="font-bold text-slate-100 text-sm">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {c.email}
                            </div>
                            <div className="text-[11px] text-indigo-300 font-semibold mt-1">
                              {getJobTitle(c.jobId)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {c.aiScore !== null ? (
                              <div
                                className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 font-bold text-base ${
                                  c.aiScore >= 8
                                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                                    : c.aiScore >= 6
                                      ? "border-amber-500 text-amber-400 bg-amber-500/10"
                                      : "border-rose-500 text-rose-400 bg-rose-500/10"
                                }`}
                              >
                                {c.aiScore}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">
                                Đang chấm...
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-slate-200 font-medium mb-1">
                              {c.skillGap}
                            </p>
                          </td>
                          <td className="px-4 py-4 max-w-xs">
                            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1">
                              <div>
                                <span className="font-bold text-emerald-400">
                                  Ưu điểm:
                                </span>{" "}
                                {c.pros}
                              </div>
                              <div>
                                <span className="font-bold text-rose-400">
                                  Cần xem xét:
                                </span>{" "}
                                {c.cons}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NGƯỜI 3 - HR DUYỆT, GỬI MAIL VÀ LỊCH PHỎNG VẤN */}
          {adminTab === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" /> Bảng Xét
                    Duyệt HR & Tự Động Hóa Gmail/Google Calendar
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    HR chọn Chấp thuận / Từ chối $\rightarrow$ n8n Workflow 3 tự
                    động quét và gửi Gmail + tạo Google Calendar Event
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Interactive HR Evaluation Table */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">
                        Duyệt Quyết Định HR (Thay đổi trực tiếp cột{" "}
                        <code>Quyết định của HR</code>)
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/60 text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Ứng viên</th>
                            <th className="px-4 py-3 text-center">
                              Nút Duyệt HR
                            </th>
                            <th className="px-4 py-3">
                              Trạng thái Gmail (n8n)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60 text-slate-300">
                          {candidates.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-700/30">
                              <td className="px-4 py-4">
                                <div className="font-bold text-slate-100">
                                  {c.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {c.email}
                                </div>
                                <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                                  AI Score: {c.aiScore}/10
                                </div>
                              </td>

                              <td className="px-4 py-4 text-center">
                                {c.hrStatus === "Pending Review" ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleHRDecision(c.id, "Approve")
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                                    >
                                      <Check className="w-3.5 h-3.5" /> Chấp
                                      thuận
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleHRDecision(c.id, "Reject")
                                      }
                                      className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                                    >
                                      <X className="w-3.5 h-3.5" /> Từ chối
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 font-bold text-xs px-3 py-1 rounded-full ${
                                      c.hrStatus === "Approve"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    }`}
                                  >
                                    {c.hrStatus === "Approve" ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <X className="w-3 h-3" />
                                    )}
                                    {c.hrStatus === "Approve"
                                      ? "Đã Chấp Thuận"
                                      : "Đã Từ Chối"}
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-4 text-xs">
                                {c.hrStatus === "Approve" && (
                                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5" /> Thư mời PV
                                    & Lịch Cal
                                  </span>
                                )}
                                {c.hrStatus === "Reject" && (
                                  <span className="text-slate-400 font-medium flex items-center gap-1">
                                    <Send className="w-3.5 h-3.5" /> Thư cảm ơn
                                  </span>
                                )}
                                {c.hrStatus === "Pending Review" && (
                                  <span className="text-slate-500 italic">
                                    Chờ HR chọn...
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right: Simulated Gmail & Calendar Monitor */}
                <div className="space-y-4">
                  {/* Gmail Monitor Widget */}
                  <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
                    <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-700">
                        <Inbox className="w-4 h-4 text-red-500" /> Thông Báo
                        Gmail Tự Động (n8n Node)
                      </div>
                      <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                        Live
                      </span>
                    </div>
                    <div className="p-3 space-y-2 text-xs">
                      {candidates
                        .filter((c) => c.hrStatus !== "Pending Review")
                        .map((c, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80"
                          >
                            <p className="font-bold text-slate-900 truncate">
                              {c.hrStatus === "Approve"
                                ? `[Thư mời PV] ${c.name}`
                                : `[Thư cảm ơn] ${c.name}`}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Tới: {c.email}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                              Status: Sent via Gmail API Node
                            </p>
                          </div>
                        ))}
                      {candidates.filter((c) => c.hrStatus !== "Pending Review")
                        .length === 0 && (
                        <p className="text-center text-slate-400 py-4 italic">
                          Chưa có email nào được gửi. Vui lòng bấm duyệt ứng
                          viên ở bảng bên trái.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Google Calendar Widget */}
                  <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
                    <h3 className="font-bold text-xs text-white flex items-center gap-2 mb-3">
                      <CalendarIcon className="w-4 h-4 text-blue-400" /> Sự Kiện
                      Phỏng Vấn (Google Calendar Node)
                    </h3>
                    <div className="space-y-2.5 text-xs">
                      {candidates
                        .filter((c) => c.hrStatus === "Approve")
                        .map((c, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/80 p-3 rounded-xl border-l-4 border-blue-500"
                          >
                            <p className="font-bold text-slate-200">
                              {c.name} - {getJobTitle(c.jobId)}
                            </p>
                            <p className="text-slate-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />{" "}
                              {c.interviewDate} lúc {c.interviewTime}
                            </p>
                            <a
                              href={c.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline mt-1.5 flex items-center gap-1 font-semibold text-[11px]"
                            >
                              <Video className="w-3 h-3" /> Mở Google Meet
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-40 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none">
                RecruitAI <span className="text-indigo-600">n8n</span>
              </h1>
              <span className="text-[10px] text-slate-400">
                Automatic CV Matching System
              </span>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setAppMode("CANDIDATE")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${appMode === "CANDIDATE" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Giao diện Ứng Viên
            </button>
            <button
              onClick={() => setAppMode("ADMIN")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${appMode === "ADMIN" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Giao diện Quản Trị Viên (3 Người)
            </button>
          </div>
        </div>
      </header>

      {/* Global Toast Notification */}
      {notification.show && (
        <div
          className={`fixed top-20 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold text-white transition animate-bounce ${
            notification.type === "error"
              ? "bg-rose-600"
              : notification.type === "warning"
                ? "bg-amber-600"
                : "bg-emerald-600"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Modal Webhook Config */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Cấu Hình n8n Webhook URL
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập URL nút Webhook (WF1 Intake) từ n8n của bạn để gửi file CV
              thực tế.
            </p>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-mono mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="http://localhost:5678/webhook/upload-cv"
            />
            <button
              onClick={() => {
                setShowConfigModal(false);
                showToast("Đã lưu cấu hình n8n Webhook URL!");
              }}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}

      {/* Active Mode Render */}
      {appMode === "CANDIDATE" ? renderCandidatePortal() : renderAdminPortal()}
    </div>
  );
}
