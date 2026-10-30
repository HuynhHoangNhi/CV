import React, { useState, useEffect } from 'react';
import {
  Briefcase, Search, MapPin, DollarSign, Clock, Upload, 
  FileText, CheckCircle2, AlertCircle, RefreshCw, Bot, 
  Mail, Calendar as CalendarIcon, Check, X, Building, UserCheck, 
  Inbox, Send, Video, Sparkles, Plus, Trash2, Edit3, Layers, FileSpreadsheet, Settings
} from 'lucide-react';

// --- DỮ LIỆU KHỞI TẠO DỰ PHÒNG (KHI N8N OFFLINE) ---

const initialJobs = [
  {
    job_id: 'JOB001',
    job_title: 'Backend Developer',
    job_description: 'Phát triển REST API, xây dựng chức năng backend và làm việc với cơ sở dữ liệu.',
    required_skills: 'Java, Spring Boot, PostgreSQL, RESTful API, Git',
    required_experience: 'Có kiến thức backend; ưu tiên kinh nghiệm xây dựng API và hệ thống thực tế.',
    preferred_skills: 'Docker, Redis, Microservices, CI/CD',
    work_type: 'Full-time',
    benefits: 'Được hướng dẫn chuyên môn, tham gia dự án thực tế, bảo hiểm.',
    deadline: '2026-12-31',
    status: 'Open'
  },
  {
    job_id: 'JOB002',
    job_title: 'Chuyên viên Phân tích Dữ liệu (Data Analyst)',
    job_description: 'Thu thập, xử lý và phân tích dữ liệu; xây dựng báo cáo, trực quan hóa dữ liệu và hỗ trợ các bộ phận đưa ra quyết định dựa trên dữ liệu.',
    required_skills: 'SQL, Excel, Python, Data Analysis, Data Visualization',
    required_experience: 'Có kiến thức về phân tích dữ liệu, xử lý dữ liệu và xây dựng báo cáo; ưu tiên ứng viên đã thực hiện dự án phân tích dữ liệu thực tế.',
    preferred_skills: 'Power BI, Tableau, Pandas, Statistics, Machine Learning',
    work_type: 'Full-time',
    benefits: 'Được hướng dẫn chuyên môn, tham gia dự án phân tích dữ liệu thực tế, cơ hội đào tạo và phát triển nghề nghiệp, bảo hiểm.',
    deadline: '2026-12-31',
    status: 'Open'
  },
  {
    job_id: 'JOB003',
    job_title: 'Chuyên viên Truyền thông & Marketing (Marketing Executive)',
    job_description: 'Lập kế hoạch và triển khai hoạt động truyền thông, xây dựng nội dung trên các kênh trực tuyến, hỗ trợ tổ chức sự kiện và theo dõi hiệu quả các chiến dịch marketing.',
    required_skills: 'Content Marketing, Social Media, Copywriting, Communication, Marketing Planning',
    required_experience: 'Có kiến thức về truyền thông và marketing; ưu tiên kinh nghiệm xây dựng nội dung, quản lý mạng xã hội hoặc triển khai chiến dịch truyền thông.',
    preferred_skills: 'SEO, Canva, Digital Marketing, Google Analytics, Event Planning',
    work_type: 'Full-time',
    benefits: 'Được hướng dẫn chuyên môn, tham gia các chiến dịch truyền thông thực tế, cơ hội đào tạo và phát triển nghề nghiệp, bảo hiểm.',
    deadline: '2026-12-31',
    status: 'Open'
  }
];

const initialParserCandidates = [
  {
    "Họ và tên": "NGUYỄN VĂN AN",
    "Email": "nguyenvanan.dev@gmail.com",
    "Số điện thoại": "0912345678",
    "Kỹ năng": "Java, Spring Boot, PostgreSQL, Docker, Git, RESTful API, Redis, Microservices",
    "Kinh nghiệm": "Junior Backend Developer tại Công ty TNHH Giải pháp Phần mềm ABC",
    "Học Vấn": "Đại học Bách Khoa - Đại học Đà Nẵng (GPA 3.52/4.0)",
    "Vị trí ứng tuyển": "Backend Developer",
    "Thời gian nộp": "2026-10-09 21:07:27",
    "job_id": "JOB001",
    "Trạng thái gửi email cho HR": "Đã gửi"
  },
  {
    "Họ và tên": "TRẦN MINH HOÀNG",
    "Email": "hoang.tm.data@gmail.com",
    "Số điện thoại": "0905123456",
    "Kỹ năng": "SQL (PostgreSQL, MySQL), Python (Pandas, NumPy), Power BI, Tableau, Excel (Advanced)",
    "Kinh nghiệm": "Chuyên viên Phân tích Dữ liệu tại Công ty TNHH Bán lẻ Global",
    "Học Vấn": "Đại học Kinh tế - Đại học Đà Nẵng (GPA 3.6/4.0)",
    "Vị trí ứng tuyển": "Chuyên viên Phân tích Dữ liệu (Data Analyst)",
    "Thời gian nộp": "2026-10-10 07:48:18",
    "job_id": "JOB002",
    "Trạng thái gửi email cho HR": "Đã gửi"
  },
  {
    "Họ và tên": "PHẠM THU TRANG",
    "Email": "huynhhoangnhi1902@gmail.com",
    "Số điện thoại": "0934567890",
    "Kỹ năng": "Digital Marketing, Content Marketing, Facebook Ads, SEO / SEM, Canva & CapCut",
    "Kinh nghiệm": "Chuyên viên Content & Digital Marketing tại SunMedia",
    "Học Vấn": "Đại học Quốc gia TP.HCM - Trường ĐH KHXH&NV",
    "Vị trí ứng tuyển": "Chuyên viên Truyền thông & Marketing (Marketing Executive)",
    "Thời gian nộp": "2026-10-10 07:49:27",
    "job_id": "JOB003",
    "Trạng thái gửi email cho HR": "Đã gửi"
  }
];

const initialMatchResults = [
  {
    "Họ và tên ứng viên": "NGUYỄN VĂN AN",
    "Email ứng viên": "nguyenvanan.dev@gmail.com",
    "Vị trí ứng tuyển": "Backend Developer",
    "Mã tin tuyển dụng": "JOB001",
    "Tên vị trí tuyển dụng": "Backend Developer",
    "Điểm phù hợp": 10.0,
    "Đề xuất đánh giá": "Strong Match",
    "Kỹ năng bắt buộc phù hợp": "Java, Spring Boot, PostgreSQL, RESTful API, Git",
    "Kỹ năng bắt buộc còn thiếu": "Không",
    "Kỹ năng ưu tiên phù hợp": "Docker, Redis, Microservices, CI/CD",
    "Kỹ năng ưu tiên còn thiếu": "Không",
    "Lý do đánh giá": "Đáp ứng 5/5 kỹ năng bắt buộc. Đáp ứng 4/4 kỹ năng ưu tiên. Tìm thấy từ khóa kinh nghiệm liên quan đến vị trí.",
    "Quyết định của HR": "Approve",
    "Ngày phỏng vấn": "2026-11-14",
    "Giờ phỏng vấn": "07:30",
    "Google Meet": "https://meet.google.com/abc-defg-hij",
    "Trạng thái gửi email cho ứng viên": "Đã gửi"
  },
  {
    "Họ và tên ứng viên": "TRẦN MINH HOÀNG",
    "Email ứng viên": "hoang.tm.data@gmail.com",
    "Vị trí ứng tuyển": "Chuyên viên Phân tích Dữ liệu (Data Analyst)",
    "Mã tin tuyển dụng": "JOB002",
    "Tên vị trí tuyển dụng": "Chuyên viên Phân tích Dữ liệu (Data Analyst)",
    "Điểm phù hợp": 6.4,
    "Đề xuất đánh giá": "Potential Match",
    "Kỹ năng bắt buộc phù hợp": "SQL, Excel, Python",
    "Kỹ năng bắt buộc còn thiếu": "Data Analysis, Data Visualization",
    "Kỹ năng ưu tiên phù hợp": "Power BI, Tableau, Pandas",
    "Kỹ năng ưu tiên còn thiếu": "Statistics, Machine Learning",
    "Lý do đánh giá": "Đáp ứng 3/5 kỹ năng bắt buộc. Đáp ứng 3/5 kỹ năng ưu tiên.",
    "Quyết định của HR": "Reject",
    "Ngày phỏng vấn": "-",
    "Giờ phỏng vấn": "-",
    "Google Meet": "",
    "Trạng thái gửi email cho ứng viên": "Đã gửi"
  },
  {
    "Họ và tên ứng viên": "PHẠM THU TRANG",
    "Email ứng viên": "huynhhoangnhi1902@gmail.com",
    "Vị trí ứng tuyển": "Chuyên viên Truyền thông & Marketing (Marketing Executive)",
    "Mã tin tuyển dụng": "JOB003",
    "Tên vị trí tuyển dụng": "Chuyên viên Truyền thông & Marketing (Marketing Executive)",
    "Điểm phù hợp": 5.4,
    "Đề xuất đánh giá": "Low Match",
    "Kỹ năng bắt buộc phù hợp": "Content Marketing, Copywriting",
    "Kỹ năng bắt buộc còn thiếu": "Social Media, Communication, Marketing Planning",
    "Kỹ năng ưu tiên phù hợp": "SEO, Canva, Digital Marketing, Google Analytics",
    "Kỹ năng ưu tiên còn thiếu": "Event Planning",
    "Lý do đánh giá": "Đáp ứng 2/5 kỹ năng bắt buộc. Đáp ứng 4/5 kỹ năng ưu tiên.",
    "Quyết định của HR": "Pending Review",
    "Ngày phỏng vấn": "-",
    "Giờ phỏng vấn": "-",
    "Google Meet": "",
    "Trạng thái gửi email cho ứng viên": "Chưa gửi"
  }
];

// --- CHUẨN HÓA DỮ LIỆU ĐỌC TỪ 3 SHEET GOOGLE SHEETS ---
const toSheetDate = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }
  const raw = String(value).trim();
  if (!raw) return '';
  const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const vn = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (vn) return `${vn[3]}-${vn[2].padStart(2, '0')}-${vn[1].padStart(2, '0')}`;
  return raw;
};

const normalizePhone = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const digits = String(value).replace(/\D/g, '');
  return digits.length === 9 ? `0${digits}` : digits;
};

const normalizeJobRow = (row) => ({
  ...row,
  job_id: String(row.job_id || ''),
  job_title: row.job_title || '',
  job_description: row.job_description || '',
  required_skills: row.required_skills || '',
  required_experience: row.required_experience || '',
  preferred_skills: row.preferred_skills || '',
  work_type: row.work_type || '',
  benefits: row.benefits || '',
  deadline: toSheetDate(row.deadline),
  status: row.status || 'Open'
});

const normalizeCandidateRow = (row) => ({
  ...row,
  'Họ và tên': row['Họ và tên'] || '',
  'Email': row['Email'] || '',
  'Số điện thoại': normalizePhone(row['Số điện thoại']),
  'Kỹ năng': row['Kỹ năng'] || '',
  'Kinh nghiệm': row['Kinh nghiệm'] || '',
  'Học Vấn': row['Học Vấn'] || '',
  'Vị trí ứng tuyển': row['Vị trí ứng tuyển'] || '',
  'Thời gian nộp': row['Thời gian nộp'] || '',
  'job_id': row.job_id || '',
  'Trạng thái gửi email cho HR': row['Trạng thái gửi email cho HR'] || 'Chưa gửi'
});

const normalizeMatchRow = (row) => ({
  ...row,
  'Họ và tên ứng viên': row['Họ và tên ứng viên'] || '',
  'Email ứng viên': row['Email ứng viên'] || '',
  'Vị trí ứng tuyển': row['Vị trí ứng tuyển'] || '',
  'Mã tin tuyển dụng': row['Mã tin tuyển dụng'] || '',
  'Tên vị trí tuyển dụng': row['Tên vị trí tuyển dụng'] || '',
  'Điểm phù hợp': Number(row['Điểm phù hợp'] ?? 0),
  'Đề xuất đánh giá': row['Đề xuất đánh giá'] || '',
  'Kỹ năng bắt buộc phù hợp': row['Kỹ năng bắt buộc phù hợp'] || 'Không có dữ liệu',
  'Kỹ năng bắt buộc còn thiếu': row['Kỹ năng bắt buộc còn thiếu'] || 'Không',
  'Kỹ năng ưu tiên phù hợp': row['Kỹ năng ưu tiên phù hợp'] || 'Không có dữ liệu',
  'Kỹ năng ưu tiên còn thiếu': row['Kỹ năng ưu tiên còn thiếu'] || 'Không',
  'Kinh nghiệm liên quan': row['Kinh nghiệm liên quan'] ?? false,
  'Lý do đánh giá': row['Lý do đánh giá'] || '',
  'Phương pháp đánh giá': row['Phương pháp đánh giá'] || '',
  'Thời gian đánh giá': row['Thời gian đánh giá'] || '',
  'Quyết định của HR': row['Quyết định của HR'] || 'Pending Review',
  'Ngày phỏng vấn': toSheetDate(row['Ngày phỏng vấn']) || '-',
  'Giờ phỏng vấn': row['Giờ phỏng vấn'] || '-',
  'Google Meet': row['Google Meet'] || row['meet_link'] || '',
  'Trạng thái gửi email cho ứng viên': row['Trạng thái gửi email cho ứng viên'] || 'Chưa gửi'
});

const getMatchRowKey = (row, index) =>
  `${row['Email ứng viên'] || row['Họ và tên ứng viên']}|${row['Mã tin tuyển dụng']}|${row['Thời gian đánh giá'] || 'no-time'}|${index}`;

export default function App() {
  const [appMode, setAppMode] = useState('ADMIN'); 
  const [adminTab, setAdminTab] = useState(3);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Webhook Endpoints
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:5678/webhook/upload-cv');
  const [hrWebhookUrl, setHrWebhookUrl] = useState('http://localhost:5678/webhook/hr-decision');
  const [getDataUrl, setGetDataUrl] = useState('http://localhost:5678/webhook/sync-sheets');
  const [jobWebhookUrl, setJobWebhookUrl] = useState('http://localhost:5678/webhook/job-management');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Core App States
  const [jobs, setJobs] = useState(initialJobs);
  const [parserCandidates, setParserCandidates] = useState(initialParserCandidates);
  const [matchResults, setMatchResults] = useState(initialMatchResults);
  const [interviewSchedules, setInterviewSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Job Modal State (Admin CRUD)
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    job_id: '',
    job_title: '',
    job_description: '',
    required_skills: '',
    required_experience: '',
    preferred_skills: '',
    work_type: 'Full-time',
    benefits: 'Được hướng dẫn chuyên môn, tham gia dự án thực tế, bảo hiểm.',
    deadline: '2026-12-31',
    status: 'Open'
  });

  // Candidate Modal State
  const [searchJob, setSearchJob] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFile, setApplyFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- FETCH LIVE DATA FROM N8N / GOOGLE SHEETS ---
  const fetchSheetData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getDataUrl, { method: 'GET', headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Server response status: ${res.status}`);
      const payload = await res.json();
      
      let data = payload;
      if (Array.isArray(payload) && payload.length > 0 && typeof payload[0] === 'object') {
        data = payload[0];
      } else if (payload?.data && !Array.isArray(payload.data)) {
        data = payload.data;
      }

      const jobsRows = data.jobs ?? data.Job_Postings ?? data['Job_Postings'] ?? data.job_postings ?? [];
      const candidateRows =
        data['Danh sách ứng viên'] ??
        data['Danh sách ứng viên - CV Parser'] ??
        data.parserCandidates ??
        data.candidates ?? [];
      const matchRows = data.matchResults ?? data.CV_Match_Results ?? data['CV_Match_Results'] ?? data.cv_match_results ?? [];

      const normalizedJobs = Array.isArray(jobsRows) ? jobsRows.map(normalizeJobRow) : [];
      const normalizedCandidates = Array.isArray(candidateRows) ? candidateRows.map(normalizeCandidateRow) : [];
      const normalizedMatches = Array.isArray(matchRows) ? matchRows.map(normalizeMatchRow) : [];

      setJobs(normalizedJobs.length > 0 ? normalizedJobs : initialJobs);
      setParserCandidates(normalizedCandidates.length > 0 ? normalizedCandidates : initialParserCandidates);
      setMatchResults(normalizedMatches.length > 0 ? normalizedMatches : initialMatchResults);
      
      showToast(
        `Đồng bộ thành công: ${normalizedJobs.length} tin tuyển dụng, ${normalizedCandidates.length} hồ sơ CV, ${normalizedMatches.length} kết quả AI.`
      );
    } catch (err) {
      console.error('Không thể đồng bộ Google Sheets qua n8n:', err);
      showToast('Đồng bộ Google Sheets thất bại. Kiểm tra URL và dữ liệu trả về của webhook GET.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  // --- JOB CRUD HANDLERS ---
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobForm({
      job_id: `JOB00${jobs.length + 1}`,
      job_title: '',
      job_description: '',
      required_skills: '',
      required_experience: '',
      preferred_skills: '',
      work_type: 'Full-time',
      benefits: 'Được hướng dẫn chuyên môn, tham gia dự án thực tế, bảo hiểm.',
      deadline: '2026-12-31',
      status: 'Open'
    });
    setShowJobModal(true);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setJobForm({ ...job });
    setShowJobModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vị trí mã ${jobId}?`)) return;
    try {
      const res = await fetch(jobWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', sheet: 'Job_Postings', job_id: jobId })
      });
      if (!res.ok) throw new Error(`Server response status: ${res.status}`);
      await fetchSheetData();
      showToast(`Đã gửi yêu cầu xóa ${jobId} và đồng bộ lại Google Sheets.`, 'warning');
    } catch (err) {
      console.error('Không thể xóa tin tuyển dụng trên Google Sheets:', err);
      showToast('Xóa thất bại. Kiểm tra webhook Job Management trong n8n.', 'error');
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobForm.job_id || !jobForm.job_title || !jobForm.required_skills) {
      showToast('Vui lòng điền mã tin, tiêu đề và kỹ năng bắt buộc!', 'error');
      return;
    }

    const duplicateId = jobs.some(j =>
      j.job_id === jobForm.job_id && (!editingJob || j.job_id !== editingJob.job_id)
    );
    if (duplicateId) {
      showToast('Mã tin tuyển dụng đã tồn tại. Vui lòng chọn mã khác.', 'error');
      return;
    }

    try {
      const res = await fetch(jobWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingJob ? 'update' : 'create',
          sheet: 'Job_Postings',
          old_job_id: editingJob?.job_id || '',
          job: { ...jobForm, deadline: toSheetDate(jobForm.deadline) }
        })
      });
      if (!res.ok) throw new Error(`Server response status: ${res.status}`);
      setShowJobModal(false);
      await fetchSheetData();
      showToast(editingJob ? 'Đã cập nhật tin tuyển dụng trên Google Sheets.' : 'Đã thêm tin tuyển dụng vào Google Sheets.');
    } catch (err) {
      console.error('Không thể lưu tin tuyển dụng lên Google Sheets:', err);
      showToast('Lưu tin thất bại. Kiểm tra webhook Job Management trong n8n.', 'error');
    }
  };

  // --- SUBMIT CV TO N8N WF1 WEBHOOK ---
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyFile) {
      showToast('Vui lòng chọn file CV định dạng PDF!', 'error');
      return;
    }
    const isPdf = applyFile.type === 'application/pdf' || applyFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showToast('File tải lên phải có định dạng PDF.', 'error');
      return;
    }
    if (applyFile.size > 10 * 1024 * 1024) {
      showToast('Dung lượng CV không được vượt quá 10MB.', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast('Đang gửi CV tới n8n Webhook & ghi dữ liệu Google Sheets...', 'info');

    try {
      const formData = new FormData();
      formData.append('data', applyFile);
      formData.append('job_id', selectedJob.job_id);
      formData.append('job_title', selectedJob.job_title);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`Server response status: ${response.status}`);

      showToast('Nộp CV thành công! Hệ thống đang phân tích hồ sơ.');
      setShowApplyModal(false);
      setApplyFile(null);
      setSelectedJob(null);
      fetchSheetData();

    } catch (err) {
      console.warn('Kết nối n8n Webhook thất bại:', err);
      showToast('Không thể gửi CV. Vui lòng kiểm tra kết nối n8n và thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HR DECISION TO N8N WF3 WEBHOOK (TẠO LỊCH & GOOGLE MEET) ---
  const handleHRDecision = async (candidate, rowKey, status) => {
    const email = candidate['Email ứng viên'];
    const candidateName = candidate['Họ và tên ứng viên'];
    if (!email) {
      showToast('Hồ sơ này chưa có Email ứng viên trong Sheet nên không thể gửi quyết định.', 'error');
      return;
    }

    const schedule = interviewSchedules[rowKey] || {};
    if (status === 'Approve' && (!schedule.date || !schedule.time)) {
      showToast('Vui lòng chọn ngày và giờ phỏng vấn trước khi duyệt.', 'error');
      return;
    }

    const generatedMeetLink = status === 'Approve' ? `https://meet.google.com/abc-xyz-${Math.floor(100 + Math.random() * 900)}` : '';

    try {
      const res = await fetch(hrWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: candidateName,
          email,
          job_id: candidate['Mã tin tuyển dụng'],
          job_title: candidate['Tên vị trí tuyển dụng'],
          evaluation_time: candidate['Thời gian đánh giá'],
          decision: status,
          interview_date: status === 'Approve' ? schedule.date : '',
          interview_time: status === 'Approve' ? schedule.time : '',
          meet_link: generatedMeetLink
        })
      });

      if (!res.ok) throw new Error(`Server response status: ${res.status}`);

      setMatchResults(prev => prev.map((row, index) => {
        if (getMatchRowKey(row, index) !== rowKey) return row;
        return {
          ...row,
          'Quyết định của HR': status,
          'Ngày phỏng vấn': status === 'Approve' ? schedule.date : '-',
          'Giờ phỏng vấn': status === 'Approve' ? schedule.time : '-',
          'Google Meet': generatedMeetLink,
          'Trạng thái gửi email cho ứng viên': 'Đã gửi'
        };
      }));
      showToast(`Đã duyệt hồ sơ và tạo Google Meet thành công!`);
      await fetchSheetData();
    } catch (err) {
      console.warn('Lỗi gọi n8n HR Decision Webhook:', err);
      showToast('Không thể gửi quyết định. Dữ liệu chưa được cập nhật.', 'error');
    }
  };

  // ============================================================================
  // RENDER: CANDIDATE PORTAL
  // ============================================================================
  const renderCandidatePortal = () => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const filteredJobs = jobs.filter(j =>
      j.status === 'Open' &&
      (!j.deadline || j.deadline >= today) &&
      (
        j.job_title.toLowerCase().includes(searchJob.toLowerCase()) ||
        (j.job_description || '').toLowerCase().includes(searchJob.toLowerCase())
      )
    );

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
        <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 text-white pt-14 pb-24 px-4 relative shadow-sm">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-flex items-center gap-1.5 border border-white/30 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-sky-100" /> Hệ thống Tuyển dụng AI & n8n Automation
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight tracking-tight">
              Cơ Hội Nghề Nghiệp Dành Cho Bạn 
            </h1>
            <p className="text-sky-100 text-base md:text-lg mb-8 max-w-2xl mx-auto font-medium">
              Tải CV PDF của bạn lên để n8n & Groq AI phân tích kỹ năng và kết nối trực tiếp đến nhà tuyển dụng.
            </p>
            
            <div className="bg-white rounded-2xl p-2 flex items-center shadow-lg max-w-2xl mx-auto border border-sky-100">
              <Search className="w-6 h-6 text-sky-500 ml-3" />
              <input 
                type="text" 
                placeholder="Tìm vị trí tuyển dụng..." 
                value={searchJob}
                onChange={(e) => setSearchJob(e.target.value)}
                className="w-full bg-transparent border-none text-slate-800 px-4 py-2.5 focus:outline-none text-sm md:text-base font-medium placeholder:text-slate-400"
              />
              <button className="bg-sky-500 hover:bg-sky-600 text-white px-7 py-3 rounded-xl font-bold transition shrink-0 shadow-sm">
                Tìm Kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">Vị trí đang tuyển dụng ({filteredJobs.length})</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchSheetData}
                className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-3 py-1.5 rounded-lg border border-sky-200 transition flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Đồng bộ dữ liệu
              </button>
            </div>
          </div>

          <div className="grid gap-5">
            {filteredJobs.map(job => (
              <div 
                key={job.job_id} 
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-200 hover:border-sky-300 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-600 text-white px-2.5 py-0.5 rounded-md text-xs font-mono font-bold">{job.job_id}</span>
                      <span className="bg-sky-50 text-sky-800 px-3 py-0.5 rounded-md text-xs font-bold border border-sky-200">{job.work_type}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-0.5 rounded-md text-xs font-bold border border-emerald-200">{job.status === 'Open' ? 'Đang tuyển' : 'Đã đóng'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition">{job.job_title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-600 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400" /> Hạn nộp: {job.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-bold border border-slate-200 transition"
                    >
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => { setSelectedJob(job); setShowApplyModal(true); }}
                      className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" /> Ứng Tuyển
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedJob && !showApplyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl relative border border-sky-100">
              <button onClick={() => setSelectedJob(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-6 h-6" />
              </button>
              
              <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-md text-xs font-bold mb-3 inline-block">{selectedJob.job_id}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">{selectedJob.job_title}</h2>
              
              <div className="space-y-5 text-sm text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Mô tả công việc</h3>
                  <p className="leading-relaxed text-slate-600">{selectedJob.job_description}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Yêu cầu kỹ năng bắt buộc</h3>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sky-900 font-semibold">{selectedJob.required_skills}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Kỹ năng ưu tiên</h3>
                  <p className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-sky-800 font-medium">{selectedJob.preferred_skills}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Kinh nghiệm & Quyền lợi</h3>
                  <p className="text-slate-600">{selectedJob.required_experience}</p>
                  <p className="text-slate-600 mt-1">{selectedJob.benefits}</p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowApplyModal(true)}
                  className="w-full md:w-auto px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold shadow-md transition"
                >
                  Nộp Hồ Sơ Vị Trí Này
                </button>
              </div>
            </div>
          </div>
        )}

        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-xl relative border border-sky-100">
              <button onClick={() => setShowApplyModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nộp Hồ Sơ Ứng Tuyển</h3>
                <p className="text-xs text-sky-700 font-bold mt-1 bg-sky-50 px-3 py-1 rounded-full inline-block border border-sky-200">{selectedJob.job_title}</p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Tải lên file CV (Định dạng PDF) *</label>
                  <div className="border-2 border-dashed border-sky-200 hover:border-sky-400 rounded-2xl p-6 text-center bg-sky-50/30 hover:bg-sky-50/60 transition cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf"
                      required
                      onChange={(e) => setApplyFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FileText className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                    {applyFile ? (
                      <p className="text-sm font-bold text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 inline-block">{applyFile.name}</p>
                    ) : (
                      <>
                        <p className="text-xs text-slate-800 font-bold">Bấm chọn file PDF hoặc kéo thả vào đây</p>
                        <p className="text-[11px] text-slate-400 mt-1">Dung lượng tối đa 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-slate-700 flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                  <span>File CV sẽ được gửi trực tiếp qua <b>n8n Webhook</b> để bóc tách bằng AI và ghi vào Google Sheet.</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3.5 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" /> Đang gửi qua n8n...
                    </>
                  ) : (
                    'Xác Nhận Nộp Hồ Sơ'
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
  // RENDER: ADMIN PORTAL
  // ============================================================================
  const renderAdminPortal = () => {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
        <div className="bg-white border-b border-sky-200/80 px-4 md:px-8 pt-4 sticky top-16 z-30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500 p-2 rounded-xl text-white shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">Quản lý tuyển dụng</h2>
                <p className="text-[11px] text-slate-500">Theo dõi tin tuyển dụng, hồ sơ và kết quả đánh giá ứng viên</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-xs bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
              >
                <Settings className="w-3.5 h-3.5" /> Cấu hình kết nối
              </button>
              <button
                onClick={fetchSheetData}
                className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Làm mới
              </button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto border-t border-slate-100 pt-2">
            <button 
              onClick={() => setAdminTab(1)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition whitespace-nowrap ${adminTab === 1 ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-sky-50'}`}
            >
              <Briefcase className="w-4 h-4" /> Tin tuyển dụng & Hồ sơ
            </button>
            <button 
              onClick={() => setAdminTab(2)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition whitespace-nowrap ${adminTab === 2 ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-sky-50'}`}
            >
              <Bot className="w-4 h-4" /> Đánh giá hồ sơ bằng AI
            </button>
            <button 
              onClick={() => setAdminTab(3)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition whitespace-nowrap ${adminTab === 3 ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-sky-50'}`}
            >
              <UserCheck className="w-4 h-4" /> Duyệt hồ sơ & Google Meet
              {matchResults.filter(c => c["Quyết định của HR"] === 'Pending Review').length > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                  {matchResults.filter(c => c["Quyết định của HR"] === 'Pending Review').length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {adminTab === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-sky-600" /> Quản lý tin tuyển dụng
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Thêm, chỉnh sửa và quản lý trạng thái các vị trí tuyển dụng</p>
                </div>
                <button 
                  onClick={handleOpenAddJob}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Thêm Bài Đăng Mới
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sky-50/50 text-sky-900 uppercase font-mono border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">job_id</th>
                        <th className="px-4 py-3">job_title</th>
                        <th className="px-4 py-3">required_skills</th>
                        <th className="px-4 py-3">work_type</th>
                        <th className="px-4 py-3">deadline</th>
                        <th className="px-4 py-3">status</th>
                        <th className="px-4 py-3 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {jobs.map(j => (
                        <tr key={j.job_id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 font-mono font-bold text-sky-600">{j.job_id}</td>
                          <td className="px-4 py-3 font-bold text-slate-900 text-sm">{j.job_title}</td>
                          <td className="px-4 py-3 max-w-xs truncate text-slate-600">{j.required_skills}</td>
                          <td className="px-4 py-3 text-slate-600">{j.work_type}</td>
                          <td className="px-4 py-3 text-slate-600">{j.deadline}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">{j.status === 'Open' ? 'Đang tuyển' : 'Đã đóng'}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleOpenEditJob(j)}
                                className="bg-sky-50 hover:bg-sky-100 text-sky-700 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-sky-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Sửa
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(j.job_id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-sky-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-sky-800 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-sky-600" /> Hồ sơ ứng viên đã tiếp nhận
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Họ và tên</th>
                        <th className="px-4 py-3">Email & Số điện thoại</th>
                        <th className="px-4 py-3">Kỹ năng</th>
                        <th className="px-4 py-3">Học Vấn</th>
                        <th className="px-4 py-3">Vị trí ứng tuyển</th>
                        <th className="px-4 py-3">Thời gian nộp</th>
                        <th className="px-4 py-3">Trạng thái gửi email cho HR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {parserCandidates.map((c, idx) => {
                        const emailKey = c["Email"] || 'no-email';
                        const jobIdKey = c.job_id || '';
                        const timeKey = c["Thời gian nộp"] || idx;
                        const rowKey = `${emailKey}-${jobIdKey}-${timeKey}-${idx}`;
                        return (
                          <tr key={rowKey} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-bold text-slate-900 text-sm">{c["Họ và tên"]}</td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-800">{c["Email"]}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{c["Số điện thoại"]}</div>
                            </td>
                            <td className="px-4 py-3 max-w-xs truncate text-slate-600">{c["Kỹ năng"]}</td>
                            <td className="px-4 py-3 max-w-xs truncate text-slate-600">{c["Học Vấn"]}</td>
                            <td className="px-4 py-3 text-sky-700 font-bold">{c["Vị trí ứng tuyển"]} ({c["job_id"]})</td>
                            <td className="px-4 py-3 text-slate-400 font-mono">{c["Thời gian nộp"]}</td>
                            <td className="px-4 py-3 font-bold text-emerald-600">{c["Trạng thái gửi email cho HR"]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminTab === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-sky-600" /> Kết quả đánh giá mức độ phù hợp
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Phân tích kỹ năng trong CV và đối chiếu với yêu cầu của từng vị trí tuyển dụng</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sky-50/50 text-sky-900 uppercase font-mono border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Họ và tên ứng viên</th>
                        <th className="px-4 py-3 text-center">Điểm phù hợp</th>
                        <th className="px-4 py-3">Đề xuất đánh giá</th>
                        <th className="px-4 py-3">Kỹ năng bắt buộc (Khớp / Thiếu)</th>
                        <th className="px-4 py-3">Lý do đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {matchResults.map((c, idx) => (
                        <tr key={getMatchRowKey(c, idx)} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-4">
                            <div className="font-bold text-slate-900 text-sm">{c["Họ và tên ứng viên"]}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{c["Email ứng viên"]}</div>
                            <div className="text-[11px] text-sky-600 font-bold mt-0.5">{c["Tên vị trí tuyển dụng"]}</div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border font-bold text-sm ${
                              c["Điểm phù hợp"] >= 8 ? 'border-emerald-300 text-emerald-700 bg-emerald-50' :
                              c["Điểm phù hợp"] >= 6 ? 'border-amber-300 text-amber-700 bg-amber-50' :
                              'border-rose-300 text-rose-700 bg-rose-50'
                            }`}>
                              {Number(c["Điểm phù hợp"] || 0).toFixed(1)}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-bold text-slate-800">{c["Đề xuất đánh giá"]}</td>
                          <td className="px-4 py-4 max-w-xs">
                            <div className="text-emerald-700 font-semibold mb-0.5"> Khớp: {c["Kỹ năng bắt buộc phù hợp"]}</div>
                            <div className="text-rose-600 font-semibold"> Thiếu: {c["Kỹ năng bắt buộc còn thiếu"]}</div>
                          </td>
                          <td className="px-4 py-4 max-w-xs">
                            <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                              {c["Lý do đánh giá"]}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminTab === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-sky-600" /> Duyệt hồ sơ, xếp lịch & Google Meet
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Chọn quyết định tuyển dụng. Khi duyệt, hãy chọn ngày và giờ phỏng vấn để hệ thống tạo lịch và link Google Meet tự động.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-sky-50/50 text-sky-900 uppercase font-mono border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">Ứng viên</th>
                            <th className="px-4 py-3 text-center">Quyết định của HR</th>
                            <th className="px-4 py-3">Lịch & Google Meet</th>
                            <th className="px-4 py-3">Trạng thái Mail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {matchResults.map((c, idx) => {
                            const rowKey = getMatchRowKey(c, idx);
                            return (
                            <tr key={rowKey} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-4">
                                <div className="font-bold text-slate-900 text-sm">{c["Họ và tên ứng viên"]}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{c["Email ứng viên"]}</div>
                                <div className="text-[11px] text-sky-600 font-bold mt-0.5">Điểm AI: {Number(c["Điểm phù hợp"] || 0).toFixed(1)}/10</div>
                              </td>

                              <td className="px-4 py-4 text-center">
                                {c["Quyết định của HR"] === 'Pending Review' ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <button 
                                      onClick={() => handleHRDecision(c, rowKey, 'Approve')}
                                      disabled={!c["Email ứng viên"] || !(interviewSchedules[rowKey] || {}).date || !(interviewSchedules[rowKey] || {}).time}
                                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" /> Duyệt & Tạo Meet
                                    </button>
                                    <button 
                                      onClick={() => handleHRDecision(c, rowKey, 'Reject')}
                                      disabled={!c["Email ứng viên"]}
                                      className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" /> Từ chối
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`inline-flex items-center gap-1 font-bold text-xs px-3 py-1 rounded-full border ${
                                    c["Quyết định của HR"] === 'Approve' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                  }`}>
                                    {c["Quyết định của HR"] === 'Approve' ? <Check className="w-3 h-3"/> : <X className="w-3 h-3"/>}
                                    {c["Quyết định của HR"] === 'Approve' ? 'Approve' : 'Reject'}
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-4 font-mono font-semibold text-slate-700">
                                {c["Quyết định của HR"] === 'Pending Review' ? (
                                  <div className="flex flex-col gap-2 min-w-[145px]">
                                    <input
                                      type="date"
                                      min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                                      value={(interviewSchedules[rowKey] || {}).date || ''}
                                      onChange={(e) => setInterviewSchedules(prev => ({
                                        ...prev,
                                        [rowKey]: {
                                          ...(prev[rowKey] || {}),
                                          date: e.target.value
                                        }
                                      }))}
                                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                                      aria-label="Ngày phỏng vấn"
                                    />
                                    <input
                                      type="time"
                                      value={(interviewSchedules[rowKey] || {}).time || ''}
                                      onChange={(e) => setInterviewSchedules(prev => ({
                                        ...prev,
                                        [rowKey]: {
                                          ...(prev[rowKey] || {}),
                                          time: e.target.value
                                        }
                                      }))}
                                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                                      aria-label="Giờ phỏng vấn"
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <span>{c["Ngày phỏng vấn"] || '-'} lúc {c["Giờ phỏng vấn"] || '-'}</span>
                                    {c["Google Meet"] ? (
                                      <div>
                                        <a 
                                          href={c["Google Meet"]} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="inline-flex items-center gap-1 text-[11px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200 hover:bg-sky-100 transition"
                                        >
                                          <Video className="w-3 h-3 text-sky-500" /> Vào phòng Google Meet
                                        </a>
                                      </div>
                                    ) : (
                                      <div className="text-slate-400 italic text-[10px]">Chưa có link Meet</div>
                                    )}
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-4 text-xs font-bold">
                                {c["Trạng thái gửi email cho ứng viên"] === 'Đã gửi' ? (
                                  <span className="text-emerald-700 flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5 text-emerald-600" /> Đã gửi email
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">Chưa gửi</span>
                                )}
                              </td>
                            </tr>
                          );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2 mb-3">
                      <Inbox className="w-4 h-4 text-rose-500" /> Trạng thái email ứng viên
                    </h3>
                    <div className="space-y-2 text-xs">
                      {matchResults.filter(c => c["Trạng thái gửi email cho ứng viên"] === 'Đã gửi').map((c, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="font-bold text-slate-900 truncate">{c["Họ và tên ứng viên"]}</p>
                          <p className="text-[11px] text-slate-500">{c["Email ứng viên"]}</p>
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">Trạng thái: Đã gửi</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2 mb-3">
                      <CalendarIcon className="w-4 h-4 text-sky-600" /> Lịch phỏng vấn đã duyệt
                    </h3>
                    <div className="space-y-2 text-xs">
                      {matchResults.filter(c => c["Quyết định của HR"] === 'Approve').map((c, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 border-l-4 border-l-sky-500 space-y-1">
                          <p className="font-bold text-slate-900">{c["Họ và tên ứng viên"]} - {c["Tên vị trí tuyển dụng"]}</p>
                          <p className="text-slate-600">{c["Ngày phỏng vấn"]} lúc {c["Giờ phỏng vấn"]}</p>
                          {c["Google Meet"] && (
                            <a href={c["Google Meet"]} target="_blank" rel="noopener noreferrer" className="text-[11px] text-sky-600 font-bold underline block">
                              Link Google Meet
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative border border-sky-100">
              <button onClick={() => setShowConfigModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cấu Hình URL n8n Webhook</h3>
              <p className="text-xs text-slate-600 mb-4">Nhập URL nút Webhook trên n8n của bạn để nhận file CV và gửi duyệt HR.</p>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Webhook WF1 Upload CV (POST):</label>
                  <input 
                    type="text" 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Webhook WF3 HR Decision (POST):</label>
                  <input 
                    type="text" 
                    value={hrWebhookUrl} 
                    onChange={(e) => setHrWebhookUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Webhook Job Management (POST - thêm/sửa/xóa tin):</label>
                  <input
                    type="text"
                    value={jobWebhookUrl}
                    onChange={(e) => setJobWebhookUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Webhook Read Sheet Data (GET):</label>
                  <input 
                    type="text" 
                    value={getDataUrl} 
                    onChange={(e) => setGetDataUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button 
                onClick={() => { setShowConfigModal(false); showToast('Đã lưu cấu hình URL Webhook!'); }}
                className="w-full bg-sky-500 text-white py-3 rounded-xl text-xs font-bold hover:bg-sky-600 transition mt-5"
              >
                Lưu Cấu Hình
              </button>
            </div>
          </div>
        )}

        {showJobModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl relative border border-sky-100">
              <button onClick={() => setShowJobModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {editingJob ? `Chỉnh Sửa Vị Trí: ${editingJob.job_id}` : 'Thêm Bài Đăng Tuyển Dụng Mới'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Thông tin vị trí tuyển dụng</p>

              <form onSubmit={handleSaveJob} className="space-y-4 text-xs font-bold text-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">job_id *</label>
                    <input 
                      type="text" 
                      required
                      value={jobForm.job_id}
                      onChange={(e) => setJobForm({ ...jobForm, job_id: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">work_type *</label>
                    <input 
                      type="text" 
                      value={jobForm.work_type}
                      onChange={(e) => setJobForm({ ...jobForm, work_type: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">job_title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ví dụ: Backend Developer..."
                    value={jobForm.job_title}
                    onChange={(e) => setJobForm({ ...jobForm, job_title: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1">job_description</label>
                  <textarea 
                    rows={2}
                    value={jobForm.job_description}
                    onChange={(e) => setJobForm({ ...jobForm, job_description: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-500 font-normal"
                  />
                </div>

                <div>
                  <label className="block mb-1">required_skills *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Java, Spring Boot, PostgreSQL..."
                    value={jobForm.required_skills}
                    onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">preferred_skills</label>
                  <input 
                    type="text" 
                    placeholder="Docker, Redis..."
                    value={jobForm.preferred_skills}
                    onChange={(e) => setJobForm({ ...jobForm, preferred_skills: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold shadow-sm transition"
                  >
                    {editingJob ? 'Lưu Cập Nhật' : 'Tạo Vị Trí Mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100">
      <header className="bg-white border-b border-sky-200/80 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 p-2 rounded-xl text-white shadow-sm">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                RecruitAI <span className="text-sky-600">n8n</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-semibold">Hệ thống tuyển dụng và phân tích CV</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setAppMode('CANDIDATE')}
              aria-pressed={appMode === 'CANDIDATE'}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                appMode === 'CANDIDATE' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Ứng viên
            </button>
            <button
              onClick={() => setAppMode('ADMIN')}
              aria-pressed={appMode === 'ADMIN'}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                appMode === 'ADMIN' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Quản trị
            </button>
          </div>
        </div>
      </header>

      {notification.show && (
        <div className={`fixed top-20 right-5 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold text-white transition animate-bounce ${
          notification.type === 'error' ? 'bg-rose-600' :
          notification.type === 'warning' ? 'bg-amber-600' : 'bg-emerald-600'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {appMode === 'CANDIDATE' ? renderCandidatePortal() : renderAdminPortal()}
    </div>
  );
}
