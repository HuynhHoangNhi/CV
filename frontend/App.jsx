
import React, { useEffect, useMemo, useState } from "react";
import {
  Search, BriefcaseBusiness, Users, FileText, CalendarDays,
  LayoutDashboard, Settings, Bell, LogOut, ChevronRight,
  MapPin, Clock, Wallet, UploadCloud, X, Plus, Pencil,
  Trash2, Eye, CheckCircle2, XCircle, RefreshCw, Send,
  Menu, ArrowLeft, Building2, Mail, Phone, Sparkles,
  ChartNoAxesCombined, CircleUserRound, Filter, ExternalLink,
  CalendarCheck, ShieldCheck, FileSearch, ClipboardList
} from "lucide-react";

const DEFAULT_WEBHOOKS = {
  upload: "http://localhost:5678/webhook/upload-cv",
  decision: "http://localhost:5678/webhook/hr-decision",
  data: "http://localhost:5678/webhook/get-sheet-data",
  jobs: ""
};

const sampleJobs = [
  {
    job_id: "JOB001",
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Đà Nẵng",
    salary: "10 - 15 triệu",
    type: "Full-time",
    description: "Phát triển giao diện website bằng ReactJS, phối hợp với Backend và UI/UX Designer.",
    requirements: "Có kiến thức HTML, CSS, JavaScript, ReactJS. Có tư duy logic và khả năng làm việc nhóm.",
    skills: ["ReactJS", "JavaScript", "HTML/CSS", "Git"],
    status: "Đang tuyển"
  },
  {
    job_id: "JOB002",
    title: "Backend Developer",
    company: "Digital Innovation",
    location: "Đà Nẵng",
    salary: "12 - 18 triệu",
    type: "Full-time",
    description: "Xây dựng và phát triển hệ thống API, xử lý dữ liệu và tối ưu hiệu năng ứng dụng.",
    requirements: "Có kiến thức Java, Spring Boot, REST API và cơ sở dữ liệu.",
    skills: ["Java", "Spring Boot", "MySQL", "REST API"],
    status: "Đang tuyển"
  },
  {
    job_id: "JOB003",
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Remote",
    salary: "8 - 12 triệu",
    type: "Part-time",
    description: "Thiết kế giao diện và trải nghiệm người dùng cho website, ứng dụng di động.",
    requirements: "Biết sử dụng Figma, có tư duy thẩm mỹ và hiểu nguyên tắc UI/UX.",
    skills: ["Figma", "UI Design", "UX Research"],
    status: "Đang tuyển"
  }
];

const sampleCandidates = [
  {
    id: "CV001",
    candidate_name: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0905123456",
    job_title: "Frontend Developer",
    skills: ["ReactJS", "JavaScript", "HTML/CSS"],
    experience: "2 năm",
    education: "Đại học",
    status: "Đang chờ duyệt",
    decision: "",
    interview_date: "",
    interview_time: "",
    meet_link: ""
  },
  {
    id: "CV002",
    candidate_name: "Trần Minh Hoàng",
    email: "hoang.tran@gmail.com",
    phone: "0905987654",
    job_title: "Backend Developer",
    skills: ["Java", "Spring Boot", "MySQL"],
    experience: "1 năm",
    education: "Đại học",
    status: "Đang chờ duyệt",
    decision: "",
    interview_date: "",
    interview_time: "",
    meet_link: ""
  },
  {
    id: "CV003",
    candidate_name: "Lê Thị Trang",
    email: "trang.le@gmail.com",
    phone: "0905111222",
    job_title: "UI/UX Designer",
    skills: ["Figma", "UI Design", "Photoshop"],
    experience: "Fresher",
    education: "Đại học",
    status: "Đang chờ duyệt",
    decision: "",
    interview_date: "",
    interview_time: "",
    meet_link: ""
  }
];

const sampleMatches = [
  {
    id: "MATCH001",
    candidate_name: "Nguyễn Văn An",
    job_title: "Frontend Developer",
    score: 92,
    matched_skills: "ReactJS, JavaScript, HTML/CSS",
    missing_skills: "TypeScript",
    recommendation: "Phù hợp"
  },
  {
    id: "MATCH002",
    candidate_name: "Trần Minh Hoàng",
    job_title: "Backend Developer",
    score: 85,
    matched_skills: "Java, Spring Boot, MySQL",
    missing_skills: "Docker",
    recommendation: "Phù hợp"
  },
  {
    id: "MATCH003",
    candidate_name: "Lê Thị Trang",
    job_title: "UI/UX Designer",
    score: 68,
    matched_skills: "Figma, UI Design",
    missing_skills: "UX Research",
    recommendation: "Cần xem xét"
  }
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

function normalizeCandidate(item, index) {
  return {
    ...item,
    id: item.id || item.firebaseId || item.email || `CV${index + 1}`,
    candidate_name: item.candidate_name || item.name || item["Họ và tên"] || "Chưa có tên",
    email: item.email || item["Email"] || "",
    phone: item.phone || item["Số điện thoại"] || "",
    job_title: item.job_title || item.jobTitle || item["Vị trí ứng tuyển"] || "",
    skills: Array.isArray(item.skills)
      ? item.skills
      : String(item.skills || item["Kỹ năng"] || "").split(",").map(s => s.trim()).filter(Boolean),
    experience: item.experience || item["Kinh nghiệm"] || "",
    education: item.education || item["Học vấn"] || "",
    status: item.status || item["Trạng thái"] || "Đang chờ duyệt",
    decision: item.decision || item["Quyết định của HR"] || "",
    interview_date: item.interview_date || item["Ngày phỏng vấn"] || "",
    interview_time: item.interview_time || item["Giờ phỏng vấn"] || "",
    meet_link: item.meet_link || item["Link Google Meet"] || ""
  };
}

function normalizeJob(item, index) {
  return {
    ...item,
    job_id: item.job_id || item.id || `JOB${index + 1}`,
    title: item.title || item.job_title || item["Tên công việc"] || "Chưa có tiêu đề",
    company: item.company || item["Công ty"] || "Công ty",
    location: item.location || item["Địa điểm"] || "Đà Nẵng",
    salary: item.salary || item["Mức lương"] || "Thỏa thuận",
    type: item.type || item["Hình thức"] || "Full-time",
    description: item.description || item["Mô tả"] || "",
    requirements: item.requirements || item["Yêu cầu"] || "",
    skills: Array.isArray(item.skills)
      ? item.skills
      : String(item.skills || "").split(",").map(s => s.trim()).filter(Boolean),
    status: item.status || item["Trạng thái"] || "Đang tuyển"
  };
}

function StatusBadge({ status }) {
  const styles = {
    "Đang tuyển": "bg-emerald-50 text-emerald-700",
    "Đang chờ duyệt": "bg-amber-50 text-amber-700",
    "Đã duyệt": "bg-blue-50 text-blue-700",
    "Đã từ chối": "bg-rose-50 text-rose-700",
    "Phù hợp": "bg-emerald-50 text-emerald-700",
    "Cần xem xét": "bg-amber-50 text-amber-700"
  };

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles[status] || "bg-slate-100 text-slate-600")}>
      {status || "Chưa cập nhật"}
    </span>
  );
}

function Modal({ title, children, onClose, width = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className={cn("max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl", width)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

function App() {
  const [appMode, setAppMode] = useState("CANDIDATE");
  const [adminTab, setAdminTab] = useState("candidates");
  const [jobs, setJobs] = useState(sampleJobs);
  const [candidates, setCandidates] = useState(sampleCandidates);
  const [matches, setMatches] = useState(sampleMatches);

  const [webhooks, setWebhooks] = useState(() => {
    try {
      return { ...DEFAULT_WEBHOOKS, ...JSON.parse(localStorage.getItem("cv-agent-webhooks") || "{}") };
    } catch {
      return DEFAULT_WEBHOOKS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [lastSync, setLastSync] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidate, setShowCandidate] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [application, setApplication] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "Đà Nẵng",
    salary: "",
    type: "Full-time",
    description: "",
    requirements: "",
    skills: ""
  });

  const [decisionForm, setDecisionForm] = useState({});
  const [decisionLoading, setDecisionLoading] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const saveWebhooks = (value) => {
    setWebhooks(value);
    localStorage.setItem("cv-agent-webhooks", JSON.stringify(value));
  };

  const fetchSheetData = async () => {
    if (!webhooks.data) {
      setSyncError("Chưa cấu hình webhook lấy dữ liệu.");
      return;
    }

    setLoading(true);
    setSyncError("");

    try {
      const response = await fetch(webhooks.data);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      if (Array.isArray(result.jobs)) setJobs(result.jobs.map(normalizeJob));
      if (Array.isArray(result.parserCandidates)) setCandidates(result.parserCandidates.map(normalizeCandidate));
      if (Array.isArray(result.matchResults)) setMatches(result.matchResults);

      setLastSync(new Date().toLocaleString("vi-VN"));
      notify("Đã đồng bộ dữ liệu thành công.");
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError("Không thể kết nối webhook. Hãy kiểm tra n8n và URL webhook.");
      notify("Đồng bộ thất bại. Đang giữ dữ liệu hiện có.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
    // Chỉ đồng bộ khi mở ứng dụng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredJobs = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    return jobs.filter(job => {
      const content = `${job.title} ${job.company} ${job.location} ${(job.skills || []).join(" ")}`.toLowerCase();
      return content.includes(keyword) && job.status !== "Đã đóng";
    });
  }, [jobs, search]);

  const pendingCandidates = candidates.filter(c => c.status === "Đang chờ duyệt" || !c.decision);
  const approvedCandidates = candidates.filter(c => c.decision === "Approve" || c.status === "Đã duyệt");
  const rejectedCandidates = candidates.filter(c => c.decision === "Reject" || c.status === "Đã từ chối");

  const handleApply = async (event) => {
    event.preventDefault();

    if (!application.name || !application.email || !application.cv) {
      notify("Vui lòng nhập họ tên, email và chọn CV.");
      return;
    }

    if (!webhooks.upload) {
      notify("Chưa cấu hình webhook nộp CV.");
      return;
    }

    const formData = new FormData();
    formData.append("data", application.cv);
    formData.append("candidate_name", application.name);
    formData.append("email", application.email);
    formData.append("phone", application.phone);
    formData.append("job_id", selectedJob?.job_id || "");
    formData.append("job_title", selectedJob?.title || "");

    try {
      const response = await fetch(webhooks.upload, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      notify("Đã gửi CV đến hệ thống. Vui lòng chờ xử lý.");
      setShowApply(false);
      setApplication({ name: "", email: "", phone: "", cv: null });
      setSelectedJob(null);
      fetchSheetData();
    } catch (error) {
      console.error("Upload error:", error);
      notify("Không gửi được CV. Vui lòng kiểm tra webhook n8n.");
    }
  };

  const openAddJob = () => {
    setEditingJob(null);
    setJobForm({
      title: "",
      company: "",
      location: "Đà Nẵng",
      salary: "",
      type: "Full-time",
      description: "",
      requirements: "",
      skills: ""
    });
    setShowJobModal(true);
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || "Full-time",
      description: job.description || "",
      requirements: job.requirements || "",
      skills: (job.skills || []).join(", ")
    });
    setShowJobModal(true);
  };

  const saveJob = async (event) => {
    event.preventDefault();

    const newJob = {
      ...jobForm,
      job_id: editingJob?.job_id || `JOB${Date.now()}`,
      skills: jobForm.skills.split(",").map(s => s.trim()).filter(Boolean),
      status: editingJob?.status || "Đang tuyển"
    };

    if (editingJob) {
      setJobs(prev => prev.map(job => job.job_id === editingJob.job_id ? newJob : job));
      notify("Đã cập nhật tin tuyển dụng trên giao diện.");
    } else {
      setJobs(prev => [newJob, ...prev]);
      notify("Đã thêm tin tuyển dụng trên giao diện.");
    }

    setShowJobModal(false);

    if (webhooks.jobs) {
      try {
        const response = await fetch(webhooks.jobs, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: editingJob ? "update" : "create", job: newJob })
        });
        if (!response.ok) throw new Error("Không lưu được lên Google Sheets.");
        notify("Đã lưu tin tuyển dụng và gửi dữ liệu đến n8n.");
      } catch (error) {
        console.error(error);
        notify("Đã cập nhật giao diện nhưng chưa lưu được lên Google Sheets.");
      }
    }
  };

  const deleteJob = (jobId) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin tuyển dụng này?")) return;
    setJobs(prev => prev.filter(job => job.job_id !== jobId));
    notify("Đã xóa tin trên giao diện.");
  };

  const updateDecisionField = (candidateId, field, value) => {
    setDecisionForm(prev => ({
      ...prev,
      [candidateId]: {
        ...(prev[candidateId] || {}),
        [field]: value
      }
    }));
  };

  const submitDecision = async (candidate, decision) => {
    const form = decisionForm[candidate.id] || {};

    if (decision === "Approve" && (!form.interview_date || !form.interview_time)) {
      notify("Vui lòng chọn ngày và giờ phỏng vấn.");
      return;
    }

    if (!webhooks.decision) {
      notify("Chưa cấu hình webhook xử lý quyết định HR.");
      return;
    }

    setDecisionLoading(candidate.id);

    const payload = {
      candidate_name: candidate.candidate_name,
      email: candidate.email,
      phone: candidate.phone,
      decision,
      job_title: candidate.job_title,
      interview_date: decision === "Approve" ? form.interview_date : "",
      interview_time: decision === "Approve" ? form.interview_time : "",
      meet_link: form.meet_link || ""
    };

    try {
      const response = await fetch(webhooks.decision, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      let result = {};
      try {
        result = await response.json();
      } catch {
        // Webhook có thể trả về response rỗng.
      }

      setCandidates(prev => prev.map(item => {
        if (item.id !== candidate.id) return item;
        return {
          ...item,
          decision,
          status: decision === "Approve" ? "Đã duyệt" : "Đã từ chối",
          interview_date: payload.interview_date,
          interview_time: payload.interview_time,
          meet_link: result.meet_link || payload.meet_link || item.meet_link
        };
      }));

      notify(decision === "Approve"
        ? "Đã gửi yêu cầu duyệt và lên lịch phỏng vấn đến n8n."
        : "Đã gửi yêu cầu từ chối đến n8n.");

      fetchSheetData();
    } catch (error) {
      console.error("HR decision error:", error);
      notify("Không gửi được quyết định. Vui lòng kiểm tra webhook.");
    } finally {
      setDecisionLoading("");
    }
  };

  const stats = [
    { label: "Tin tuyển dụng", value: jobs.length, icon: BriefcaseBusiness, color: "bg-blue-50 text-blue-600" },
    { label: "Tổng ứng viên", value: candidates.length, icon: Users, color: "bg-violet-50 text-violet-600" },
    { label: "Chờ xét duyệt", value: pendingCandidates.length, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Đã duyệt", value: approvedCandidates.length, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-sans text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Sparkles size={21} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Talent<span className="text-blue-600">AI</span></h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">CV Intelligence System</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-xl bg-slate-100 p-1 sm:flex">
            <button
              onClick={() => setAppMode("CANDIDATE")}
              className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition", appMode === "CANDIDATE" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800")}
            >
              Dành cho ứng viên
            </button>
            <button
              onClick={() => setAppMode("ADMIN")}
              className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition", appMode === "ADMIN" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800")}
            >
              Quản trị viên
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchSheetData} disabled={loading} title="Đồng bộ dữ liệu" className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => setShowSettings(true)} title="Cấu hình webhook" className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600">
              <Settings size={18} />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 sm:hidden">
              <Menu size={18} />
            </button>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 sm:flex">
              <CircleUserRound size={21} />
            </div>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white p-3 sm:hidden">
            <button onClick={() => { setAppMode("CANDIDATE"); setMobileMenu(false); }} className="w-full rounded-lg p-3 text-left text-sm font-semibold hover:bg-slate-50">Dành cho ứng viên</button>
            <button onClick={() => { setAppMode("ADMIN"); setMobileMenu(false); }} className="w-full rounded-lg p-3 text-left text-sm font-semibold hover:bg-slate-50">Quản trị viên</button>
          </div>
        )}
      </header>

      {/* CANDIDATE PORTAL */}
      {appMode === "CANDIDATE" && (
        <main>
          <section className="relative overflow-hidden bg-[#10264a]">
            <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-24">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-200">
                  <Sparkles size={14} /> Nền tảng tuyển dụng thông minh với AI
                </span>
                <h2 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                  Tìm công việc phù hợp với <span className="text-cyan-300">năng lực</span> của bạn.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-blue-100/75">
                  Khám phá cơ hội nghề nghiệp, gửi CV trực tuyến và để hệ thống AI hỗ trợ phân tích mức độ phù hợp với vị trí ứng tuyển.
                </p>
                <div className="mt-9 flex flex-wrap gap-3 text-sm text-blue-100/80">
                  <span className="flex items-center gap-2"><CheckCircle2 size={17} /> Nộp CV trực tuyến</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={17} /> Phân tích hồ sơ bằng AI</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={17} /> Theo dõi tuyển dụng</span>
                </div>
              </div>

              <div className="hidden justify-center md:flex">
                <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-white/15 p-3 text-cyan-200"><ChartNoAxesCombined size={28} /></div>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">AI Powered</span>
                  </div>
                  <p className="mt-8 text-sm text-blue-100/70">Cơ hội nghề nghiệp đang mở</p>
                  <p className="mt-1 text-5xl font-black text-white">{jobs.length.toString().padStart(2, "0")}<span className="ml-2 text-lg font-medium text-blue-200">vị trí</span></p>
                  <div className="mt-7 space-y-3">
                    {["Phân tích CV tự động", "Đánh giá kỹ năng", "Kết nối nhà tuyển dụng"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 text-sm text-white">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200">{index + 1}</span>
                        {item}
                        <CheckCircle2 className="ml-auto text-emerald-300" size={17} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1440px] px-5 py-12 md:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Career opportunities</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Khám phá việc làm</h2>
                <p className="mt-2 text-sm text-slate-500">Tìm kiếm vị trí phù hợp với kỹ năng và định hướng của bạn.</p>
              </div>
              <div className="text-sm text-slate-500">Hiện có <strong className="text-blue-600">{filteredJobs.length}</strong> vị trí tuyển dụng</div>
            </div>

            <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="text-slate-400" size={20} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm theo tên công việc, kỹ năng hoặc công ty..."
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <button onClick={() => setSearch("")} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                Xóa bộ lọc
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map(job => (
                <article key={job.job_id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Building2 size={23} />
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-blue-700">{job.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">{job.company}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-2"><MapPin size={15} />{job.location}</span>
                    <span className="flex items-center gap-2"><Clock size={15} />{job.type}</span>
                    <span className="col-span-2 flex items-center gap-2 font-semibold text-emerald-700"><Wallet size={15} />{job.salary}</span>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">{job.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(job.skills || []).slice(0, 4).map(skill => (
                      <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">{skill}</span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-3 border-t border-slate-100 pt-5">
                    <button onClick={() => setSelectedJob(job)} className="flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                      Chi tiết
                    </button>
                    <button onClick={() => { setSelectedJob(job); setShowApply(true); }} className="flex-1 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white hover:bg-blue-700">
                      Ứng tuyển <ChevronRight className="ml-1 inline" size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <Search className="mx-auto text-slate-300" size={38} />
                <p className="mt-4 font-bold text-slate-700">Không tìm thấy công việc phù hợp</p>
                <p className="mt-1 text-sm text-slate-400">Thử tìm kiếm với từ khóa khác nhé.</p>
              </div>
            )}
          </section>

          <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-400">
            © 2026 TalentAI — AI CV Parsing & Recruitment Management System
          </footer>
        </main>
      )}

      {/* ADMIN PORTAL */}
      {appMode === "ADMIN" && (
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px]">
          <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:block">
            <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
            <div className="space-y-1">
              {[
                { id: "candidates", label: "Quản lý ứng viên", icon: Users },
                { id: "jobs", label: "Tin tuyển dụng", icon: BriefcaseBusiness },
                { id: "matches", label: "Kết quả AI Matching", icon: Sparkles },
                { id: "hr", label: "Xét duyệt & Lịch hẹn", icon: CalendarCheck }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setAdminTab(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition", adminTab === item.id ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")}>
                    <Icon size={18} /> {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl bg-[#10264a] p-5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><ShieldCheck size={20} /></div>
              <p className="mt-4 font-bold">Hệ thống quản trị</p>
              <p className="mt-2 text-xs leading-5 text-blue-100/70">Theo dõi hồ sơ, kết quả phân tích và quy trình tuyển dụng tập trung.</p>
              <button onClick={() => setShowSettings(true)} className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-200 hover:text-white">Cấu hình hệ thống <ChevronRight size={14} /></button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <button onClick={() => setAppMode("CANDIDATE")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-blue-600">
                <LogOut size={18} /> Về giao diện ứng viên
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1 p-5 md:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-blue-600">ADMINISTRATION</p>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Tổng quan hệ thống</h2>
                <p className="mt-2 text-sm text-slate-500">Quản lý dữ liệu tuyển dụng và quy trình xử lý hồ sơ ứng viên.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={fetchSheetData} disabled={loading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm hover:border-blue-200 hover:text-blue-600 disabled:opacity-50">
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Đồng bộ dữ liệu
                </button>
                <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
                  <Settings size={16} /> Cấu hình
                </button>
              </div>
            </div>

            {syncError && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {syncError}
              </div>
            )}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                      <span className={cn("rounded-xl p-3", stat.color)}><Icon size={20} /></span>
                    </div>
                    <p className="mt-4 text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 lg:hidden">
              {[
                ["candidates", "Ứng viên"],
                ["jobs", "Việc làm"],
                ["matches", "AI Matching"],
                ["hr", "HR"]
              ].map(([id, label]) => (
                <button key={id} onClick={() => setAdminTab(id)} className={cn("whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold", adminTab === id ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50")}>{label}</button>
              ))}
            </div>

            {/* CANDIDATE MANAGEMENT */}
            {adminTab === "candidates" && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Danh sách hồ sơ ứng viên</h3>
                    <p className="mt-1 text-sm text-slate-500">Thông tin được tiếp nhận từ quy trình CV Parser.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    <Users size={17} /> {candidates.length} hồ sơ
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Ứng viên</th>
                        <th className="px-6 py-4">Vị trí</th>
                        <th className="px-6 py-4">Kinh nghiệm</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidates.map(candidate => (
                        <tr key={candidate.id} className="hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">{candidate.candidate_name?.charAt(0)}</div>
                              <div>
                                <p className="font-bold text-slate-800">{candidate.candidate_name}</p>
                                <p className="mt-1 text-xs text-slate-400">{candidate.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-600">{candidate.job_title || "Chưa xác định"}</td>
                          <td className="px-6 py-4 text-slate-500">{candidate.experience || "—"}</td>
                          <td className="px-6 py-4"><StatusBadge status={candidate.status} /></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setShowCandidate(candidate)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600" title="Xem hồ sơ"><Eye size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {candidates.length === 0 && <p className="p-10 text-center text-sm text-slate-400">Chưa có hồ sơ ứng viên.</p>}
                </div>
              </section>
            )}

            {/* JOB MANAGEMENT */}
            {adminTab === "jobs" && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Quản lý tin tuyển dụng</h3>
                    <p className="mt-1 text-sm text-slate-500">Tạo mới và cập nhật các vị trí đang tuyển.</p>
                  </div>
                  <button onClick={openAddJob} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                    <Plus size={17} /> Thêm vị trí
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Vị trí tuyển dụng</th>
                        <th className="px-6 py-4">Địa điểm</th>
                        <th className="px-6 py-4">Mức lương</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobs.map(job => (
                        <tr key={job.job_id} className="hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{job.title}</p>
                            <p className="mt-1 text-xs text-slate-400">{job.company}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{job.location}</td>
                          <td className="px-6 py-4 font-semibold text-slate-600">{job.salary}</td>
                          <td className="px-6 py-4"><StatusBadge status={job.status} /></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => openEditJob(job)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Pencil size={17} /></button>
                            <button onClick={() => deleteJob(job.job_id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* AI MATCHING */}
            {adminTab === "matches" && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600"><Sparkles size={22} /></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Kết quả phân tích AI Matching</h3>
                      <p className="mt-1 text-sm text-slate-500">Đánh giá mức độ phù hợp giữa hồ sơ và vị trí tuyển dụng.</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Ứng viên</th>
                        <th className="px-6 py-4">Vị trí</th>
                        <th className="px-6 py-4">Điểm phù hợp</th>
                        <th className="px-6 py-4">Kỹ năng phù hợp</th>
                        <th className="px-6 py-4">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matches.map((match, index) => {
                        const score = Number(match.score || match.match_score || 0);
                        return (
                          <tr key={match.id || index} className="hover:bg-slate-50/70">
                            <td className="px-6 py-4 font-bold text-slate-800">{match.candidate_name || match.name || "—"}</td>
                            <td className="px-6 py-4 text-slate-500">{match.job_title || "—"}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
                                </div>
                                <span className="font-bold text-slate-700">{score}%</span>
                              </div>
                            </td>
                            <td className="max-w-xs px-6 py-4 text-xs leading-5 text-slate-500">{match.matched_skills || match.skills || "—"}</td>
                            <td className="px-6 py-4"><StatusBadge status={match.recommendation || (score >= 80 ? "Phù hợp" : "Cần xem xét")} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {matches.length === 0 && <p className="p-10 text-center text-sm text-slate-400">Chưa có kết quả AI Matching.</p>}
                </div>
              </section>
            )}

            {/* HR APPROVAL */}
            {adminTab === "hr" && (
              <section>
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Xét duyệt ứng viên & lịch phỏng vấn</h3>
                    <p className="mt-1 text-sm text-slate-500">Gửi quyết định đến ứng viên thông qua quy trình tự động.</p>
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">{pendingCandidates.length} chờ duyệt</span>
                    <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">{approvedCandidates.length} đã duyệt</span>
                    <span className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{rejectedCandidates.length} từ chối</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingCandidates.map(candidate => {
                    const form = decisionForm[candidate.id] || {};
                    return (
                      <article key={candidate.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700">{candidate.candidate_name?.charAt(0)}</div>
                            <div>
                              <h4 className="font-bold text-slate-900">{candidate.candidate_name}</h4>
                              <p className="mt-1 text-sm text-slate-500">{candidate.job_title || "Chưa xác định vị trí"}</p>
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Mail size={13} />{candidate.email}</span>
                                {candidate.phone && <span className="flex items-center gap-1"><Phone size={13} />{candidate.phone}</span>}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={candidate.status} />
                        </div>

                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Kỹ năng ứng viên</p>
                          <div className="flex flex-wrap gap-2">
                            {(candidate.skills || []).length > 0
                              ? candidate.skills.map(skill => <span key={skill} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">{skill}</span>)
                              : <span className="text-xs text-slate-400">Chưa có dữ liệu kỹ năng</span>}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                          <Field label="Ngày phỏng vấn">
                            <input type="date" min={new Date().toISOString().slice(0, 10)} value={form.interview_date || ""} onChange={e => updateDecisionField(candidate.id, "interview_date", e.target.value)} className={inputClass} />
                          </Field>
                          <Field label="Giờ phỏng vấn">
                            <input type="time" value={form.interview_time || ""} onChange={e => updateDecisionField(candidate.id, "interview_time", e.target.value)} className={inputClass} />
                          </Field>
                          <Field label="Link Google Meet (nếu có)">
                            <input type="url" placeholder="https://meet.google.com/..." value={form.meet_link || ""} onChange={e => updateDecisionField(candidate.id, "meet_link", e.target.value)} className={inputClass} />
                          </Field>
                        </div>

                        <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                          <button onClick={() => setShowCandidate(candidate)} className="mr-auto flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                            <Eye size={16} /> Xem hồ sơ
                          </button>
                          <button disabled={decisionLoading === candidate.id} onClick={() => submitDecision(candidate, "Reject")} className="flex items-center gap-2 rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                            <XCircle size={17} /> Từ chối
                          </button>
                          <button disabled={decisionLoading === candidate.id} onClick={() => submitDecision(candidate, "Approve")} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                            <CheckCircle2 size={17} /> {decisionLoading === candidate.id ? "Đang gửi..." : "Duyệt & gửi lịch"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {pendingCandidates.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                      <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
                      <p className="mt-3 font-bold text-slate-700">Không còn hồ sơ chờ xét duyệt</p>
                      <p className="mt-1 text-sm text-slate-400">Các hồ sơ đã được xử lý sẽ hiển thị tại danh sách trạng thái.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                    <div className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 size={19} /> Ứng viên đã duyệt</div>
                    <p className="mt-2 text-3xl font-black text-emerald-700">{approvedCandidates.length}</p>
                    <div className="mt-3 space-y-2">
                      {approvedCandidates.map(c => (
                        <div key={c.id} className="rounded-xl bg-white/80 p-3 text-sm">
                          <p className="font-bold text-slate-700">{c.candidate_name}</p>
                          <p className="mt-1 text-xs text-slate-500">{c.interview_date || "Chưa có ngày"} {c.interview_time || ""}</p>
                          {c.meet_link && <a href={c.meet_link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">Mở Google Meet <ExternalLink size={12} /></a>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
                    <div className="flex items-center gap-2 font-bold text-rose-800"><XCircle size={19} /> Ứng viên đã từ chối</div>
                    <p className="mt-2 text-3xl font-black text-rose-700">{rejectedCandidates.length}</p>
                    <div className="mt-3 space-y-2">
                      {rejectedCandidates.map(c => (
                        <div key={c.id} className="rounded-xl bg-white/80 p-3 text-sm">
                          <p className="font-bold text-slate-700">{c.candidate_name}</p>
                          <p className="mt-1 text-xs text-slate-500">{c.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-2"><RefreshCw size={13} /> Lần đồng bộ gần nhất: {lastSync || "Chưa đồng bộ"}</span>
              <span>TalentAI Administration</span>
            </div>
          </main>
        </div>
      )}

      {/* JOB DETAIL MODAL */}
      {selectedJob && !showApply && (
        <Modal title="Thông tin công việc" onClose={() => setSelectedJob(null)}>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600"><BriefcaseBusiness size={27} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">{selectedJob.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selectedJob.company}</p>
              <div className="mt-3 flex flex-wrap gap-2"><StatusBadge status={selectedJob.status} /></div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Địa điểm</p><p className="mt-1 font-bold">{selectedJob.location}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Mức lương</p><p className="mt-1 font-bold text-emerald-700">{selectedJob.salary}</p></div>
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-slate-900">Mô tả công việc</h4>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-500">{selectedJob.description || "Chưa có mô tả."}</p>
          </div>
          <div className="mt-5">
            <h4 className="font-bold text-slate-900">Yêu cầu ứng viên</h4>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-500">{selectedJob.requirements || "Chưa có yêu cầu."}</p>
          </div>
          <div className="mt-5">
            <h4 className="font-bold text-slate-900">Kỹ năng</h4>
            <div className="mt-3 flex flex-wrap gap-2">{(selectedJob.skills || []).map(s => <span key={s} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{s}</span>)}</div>
          </div>
          <button onClick={() => setShowApply(true)} className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700">Ứng tuyển ngay <ChevronRight className="ml-1 inline" size={17} /></button>
        </Modal>
      )}

      {/* APPLY MODAL */}
      {showApply && (
        <Modal title="Nộp hồ sơ ứng tuyển" onClose={() => { setShowApply(false); setSelectedJob(null); }}>
          <div className="mb-5 rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-500">VỊ TRÍ ỨNG TUYỂN</p>
            <p className="mt-1 font-bold text-blue-900">{selectedJob?.title || "Ứng tuyển"}</p>
            <p className="mt-1 text-xs text-blue-700">{selectedJob?.company || ""}</p>
          </div>
          <form onSubmit={handleApply} className="space-y-4">
            <Field label="Họ và tên *"><input required value={application.name} onChange={e => setApplication({ ...application, name: e.target.value })} placeholder="Nhập họ và tên" className={inputClass} /></Field>
            <Field label="Email *"><input required type="email" value={application.email} onChange={e => setApplication({ ...application, email: e.target.value })} placeholder="example@gmail.com" className={inputClass} /></Field>
            <Field label="Số điện thoại"><input value={application.phone} onChange={e => setApplication({ ...application, phone: e.target.value })} placeholder="Nhập số điện thoại" className={inputClass} /></Field>
            <Field label="CV của bạn (PDF/DOC/DOCX) *">
              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-7 text-center transition hover:border-blue-400">
                <UploadCloud className="text-blue-600" size={30} />
                <span className="mt-3 text-sm font-bold text-slate-700">{application.cv ? application.cv.name : "Chọn tệp CV để tải lên"}</span>
                <span className="mt-1 text-xs text-slate-400">Nhấn để chọn tệp từ máy tính</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setApplication({ ...application, cv: e.target.files?.[0] || null })} />
              </label>
            </Field>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700"><Send className="mr-2 inline" size={17} /> Gửi hồ sơ ứng tuyển</button>
          </form>
        </Modal>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {showCandidate && (
        <Modal title="Chi tiết hồ sơ ứng viên" onClose={() => setShowCandidate(null)}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-black text-blue-700">{showCandidate.candidate_name?.charAt(0)}</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{showCandidate.candidate_name}</h3>
              <p className="mt-1 text-sm text-slate-500">{showCandidate.job_title}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Email</p><p className="mt-1 break-all text-sm font-semibold">{showCandidate.email || "—"}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Số điện thoại</p><p className="mt-1 text-sm font-semibold">{showCandidate.phone || "—"}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Kinh nghiệm</p><p className="mt-1 text-sm font-semibold">{showCandidate.experience || "—"}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Học vấn</p><p className="mt-1 text-sm font-semibold">{showCandidate.education || "—"}</p></div>
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm font-bold text-slate-700">Kỹ năng</p>
            <div className="flex flex-wrap gap-2">{(showCandidate.skills || []).map(s => <span key={s} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{s}</span>)}</div>
          </div>
          <div className="mt-5"><p className="mb-2 text-sm font-bold text-slate-700">Trạng thái hồ sơ</p><StatusBadge status={showCandidate.status} /></div>
        </Modal>
      )}

      {/* JOB FORM MODAL */}
      {showJobModal && (
        <Modal title={editingJob ? "Chỉnh sửa tin tuyển dụng" : "Thêm tin tuyển dụng"} onClose={() => setShowJobModal(false)}>
          <form onSubmit={saveJob} className="space-y-4">
            <Field label="Tên vị trí *"><input required value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} className={inputClass} placeholder="Ví dụ: Frontend Developer" /></Field>
            <Field label="Tên công ty"><input value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} className={inputClass} placeholder="Tên công ty" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Địa điểm"><input value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} className={inputClass} /></Field>
              <Field label="Mức lương"><input value={jobForm.salary} onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} className={inputClass} placeholder="10 - 15 triệu" /></Field>
            </div>
            <Field label="Hình thức làm việc">
              <select value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })} className={inputClass}>
                <option>Full-time</option><option>Part-time</option><option>Remote</option><option>Internship</option>
              </select>
            </Field>
            <Field label="Mô tả công việc"><textarea rows={3} value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} className={inputClass} /></Field>
            <Field label="Yêu cầu ứng viên"><textarea rows={3} value={jobForm.requirements} onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })} className={inputClass} /></Field>
            <Field label="Kỹ năng (phân cách bằng dấu phẩy)"><input value={jobForm.skills} onChange={e => setJobForm({ ...jobForm, skills: e.target.value })} className={inputClass} placeholder="ReactJS, JavaScript, HTML/CSS" /></Field>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700">{editingJob ? "Lưu thay đổi" : "Thêm tin tuyển dụng"}</button>
          </form>
        </Modal>
      )}

      {/* WEBHOOK SETTINGS */}
      {showSettings && (
        <Modal title="Cấu hình kết nối n8n" onClose={() => setShowSettings(false)}>
          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="flex items-center gap-2 font-bold text-blue-800"><Settings size={17} /> Kết nối hệ thống</p>
            <p className="mt-1 text-xs leading-5 text-blue-700">Nhập URL webhook đang hoạt động trong n8n. Nếu chạy trên máy khác, không sử dụng localhost của máy người dùng.</p>
          </div>
          <div className="space-y-4">
            <Field label="Webhook nhận CV"><input value={webhooks.upload} onChange={e => setWebhooks({ ...webhooks, upload: e.target.value })} className={inputClass} /></Field>
            <Field label="Webhook xử lý quyết định HR"><input value={webhooks.decision} onChange={e => setWebhooks({ ...webhooks, decision: e.target.value })} className={inputClass} /></Field>
            <Field label="Webhook lấy dữ liệu Google Sheets"><input value={webhooks.data} onChange={e => setWebhooks({ ...webhooks, data: e.target.value })} className={inputClass} /></Field>
            <Field label="Webhook quản lý tin tuyển dụng (không bắt buộc)"><input value={webhooks.jobs} onChange={e => setWebhooks({ ...webhooks, jobs: e.target.value })} className={inputClass} placeholder="URL webhook tạo/cập nhật/xóa tin tuyển dụng" /></Field>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setShowSettings(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
            <button onClick={() => { saveWebhooks(webhooks); setShowSettings(false); notify("Đã lưu cấu hình webhook."); }} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Lưu cấu hình</button>
          </div>
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 size={19} className="shrink-0 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
