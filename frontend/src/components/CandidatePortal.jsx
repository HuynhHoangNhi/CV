
import React, { useMemo, useState } from 'react';

import {
  Search,
  Briefcase,
  Clock,
  Upload,
  FileText,
  CheckCircle2,
  MapPin,
  X,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function CandidatePortal({
  jobs = [],
  parserCandidates = [],
  setParserCandidates,
  matchResults = [],
  setMatchResults,
  webhookUrl,
  fetchSheetData,
  isLoading = false,
  showToast
}) {
  const [searchJob, setSearchJob] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFile, setApplyFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==============================
  // NOTIFICATION
  // ==============================

  const notify = (message, type = 'success') => {
    if (typeof showToast === 'function') {
      showToast(message, type);
    }
  };

  // ==============================
  // JOB STATUS
  // ==============================

  const isJobOpen = (job) => {
    if (!job) return false;

    const status = String(job.status || 'Open')
      .trim()
      .toLowerCase();

    const closedStatuses = [
      'closed',
      'inactive',
      'paused',
      'filled',
      'đã đóng',
      'ngừng tuyển',
      'đã tuyển đủ'
    ];

    if (closedStatuses.includes(status)) {
      return false;
    }

    // Kiểm tra hạn nộp nếu có
    if (job.deadline) {
      const deadline = new Date(
        `${String(job.deadline).slice(0, 10)}T23:59:59`
      );

      if (!Number.isNaN(deadline.getTime()) && deadline < new Date()) {
        return false;
      }
    }

    return true;
  };

  // ==============================
  // FILTER JOBS
  // ==============================

  const filteredJobs = useMemo(() => {
    const safeJobs = Array.isArray(jobs) ? jobs : [];

    const search = searchJob.trim().toLowerCase();

    return safeJobs.filter(job => {
      if (!job || !isJobOpen(job)) {
        return false;
      }

      const title = String(job.job_title || '').toLowerCase();
      const description = String(
        job.job_description || ''
      ).toLowerCase();

      const skills = String(
        job.required_skills || ''
      ).toLowerCase();

      return (
        title.includes(search) ||
        description.includes(search) ||
        skills.includes(search)
      );
    });
  }, [jobs, searchJob]);

  // ==============================
  // OPEN APPLY MODAL
  // ==============================

  const openApplyModal = (job) => {
    if (!isJobOpen(job)) {
      notify('Vị trí tuyển dụng này đã đóng.', 'error');
      return;
    }

    setSelectedJob(job);
    setApplyFile(null);
    setShowApplyModal(true);
  };

  // ==============================
  // CLOSE APPLY MODAL
  // ==============================

  const closeApplyModal = () => {
    if (isSubmitting) return;

    setShowApplyModal(false);
    setApplyFile(null);
    setSelectedJob(null);
  };

  // ==============================
  // SELECT CV FILE
  // ==============================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setApplyFile(null);
      return;
    }

    const isPdfExtension = file.name
      .toLowerCase()
      .endsWith('.pdf');

    const isPdfMime =
      !file.type || file.type === 'application/pdf';

    if (!isPdfExtension || !isPdfMime) {
      notify('Vui lòng chọn tệp có định dạng PDF.', 'error');
      e.target.value = '';
      setApplyFile(null);
      return;
    }

    if (file.size === 0) {
      notify('Tệp CV đang trống. Vui lòng chọn tệp khác.', 'error');
      e.target.value = '';
      setApplyFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      notify('Dung lượng CV không được vượt quá 10MB.', 'error');
      e.target.value = '';
      setApplyFile(null);
      return;
    }

    setApplyFile(file);
  };

  // ==============================
  // SUBMIT APPLICATION
  // ==============================

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!selectedJob) {
      notify('Vui lòng chọn vị trí ứng tuyển.', 'error');
      return;
    }

    if (!isJobOpen(selectedJob)) {
      notify('Vị trí tuyển dụng này đã đóng.', 'error');
      return;
    }

    if (!applyFile) {
      notify('Vui lòng chọn tệp CV PDF.', 'error');
      return;
    }

    if (!webhookUrl) {
      notify('Chưa cấu hình URL nhận hồ sơ.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo multipart/form-data gửi tới n8n
      const formData = new FormData();

      // Phải trùng tên binary property của Webhook WF1
      formData.append('data', applyFile);

      formData.append(
        'job_id',
        String(selectedJob.job_id || '')
      );

      formData.append(
        'job_title',
        String(selectedJob.job_title || '')
      );

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(
          `Webhook trả về lỗi HTTP ${response.status}`
        );
      }

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(
          'n8n không trả về kết quả xác nhận tiếp nhận hồ sơ.'
        );
      }

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          'Phản hồi từ n8n không phải JSON hợp lệ.'
        );
      }

      // Chỉ chấp nhận phản hồi thành công rõ ràng
      if (result.success !== true) {
        throw new Error(
          result.message ||
          'Hệ thống chưa xác nhận tiếp nhận hồ sơ.'
        );
      }

      notify(
        result.message ||
        'Hồ sơ ứng tuyển đã được tiếp nhận thành công!',
        'success'
      );

      // Đóng form sau khi webhook xác nhận thành công
      setShowApplyModal(false);
      setApplyFile(null);
      setSelectedJob(null);

      // Đồng bộ lại dữ liệu từ Google Sheets
      if (typeof fetchSheetData === 'function') {
        await fetchSheetData();
      }

    } catch (error) {
      console.error('Lỗi gửi hồ sơ ứng tuyển:', error);

      notify(
        error.message ||
        'Không thể gửi hồ sơ. Vui lòng thử lại.',
        'error'
      );

      // Không tạo dữ liệu ứng viên giả.
      // Giữ nguyên form và tệp CV để người dùng thử lại.

    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================
  // FORMAT FILE SIZE
  // ==============================

  const formatFileSize = (size) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="min-h-screen bg-[#F3F6FC] text-slate-800 font-sans pb-24">

      {/* ================= HERO BANNER ================= */}

      <section className="bg-[#174EA6] text-white pt-12 pb-14 px-6 shadow-md">

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-blue-100 text-xs font-semibold uppercase mb-4 border border-white/20">

            <ShieldCheck className="w-4 h-4 text-blue-200" />

            Cổng Tuyển Dụng Doanh Nghiệp

          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            Khám Phá Cơ Hội Nghề Nghiệp
          </h1>

          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Tìm kiếm các vị trí công việc phù hợp với kỹ năng và định hướng phát triển chuyên môn của bạn.
          </p>

          {/* SEARCH */}
          <div className="bg-white rounded-xl p-2 flex items-center shadow-lg border border-slate-200 max-w-2xl mx-auto focus-within:ring-2 focus-within:ring-blue-300 transition-all">

            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />

            <input
              type="text"
              placeholder="Nhập tên vị trí hoặc kỹ năng (Java, SQL, Python)..."
              value={searchJob}
              onChange={e => setSearchJob(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 px-3 py-2 focus:outline-none text-sm placeholder:text-slate-400"
            />

            {searchJob && (
              <button
                type="button"
                onClick={() => setSearchJob('')}
                className="p-2 text-slate-400 hover:text-slate-700"
                title="Xóa từ khóa"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                document.getElementById('job-listings')?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
              className="bg-[#174EA6] hover:bg-[#0d3c85] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shrink-0 shadow-sm"
            >
              Tìm kiếm
            </button>

          </div>
        </div>
      </section>

      {/* ================= JOB LISTINGS ================= */}

      <section
        id="job-listings"
        className="max-w-5xl mx-auto px-4 sm:px-6 mt-8"
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-2">

            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Vị Trí Đang Tuyển Dụng
            </h2>

            <span className="bg-[#174EA6]/10 text-[#174EA6] text-xs font-bold px-2.5 py-1 rounded-md border border-[#174EA6]/20">
              {filteredJobs.length} vị trí
            </span>

          </div>

          <button
            type="button"
            onClick={() => fetchSheetData?.()}
            disabled={isLoading}
            className="text-xs bg-white hover:bg-slate-50 text-[#174EA6] font-semibold px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors flex items-center gap-2 w-fit disabled:opacity-50"
          >

            <RefreshCw
              className={`w-3.5 h-3.5 text-[#174EA6] ${
                isLoading ? 'animate-spin' : ''
              }`}
            />

            Làm mới danh sách

          </button>

        </div>

        {/* JOB LIST */}
        <div className="grid gap-4">

          {filteredJobs.length === 0 ? (

            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">

              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-slate-600 font-semibold text-sm">
                Không tìm thấy vị trí tuyển dụng
              </p>

              <p className="text-slate-400 text-xs mt-1">
                Thử thay đổi từ khóa tìm kiếm hoặc quay lại sau.
              </p>

            </div>

          ) : (

            filteredJobs.map((job, index) => (

              <article
                key={job.job_id || index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-200 hover:border-[#174EA6]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >

                {/* JOB INFORMATION */}
                <div className="space-y-3 flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs font-mono font-bold border border-slate-200">
                      {job.job_id || 'N/A'}
                    </span>

                    <span className="bg-[#174EA6]/10 text-[#174EA6] px-2.5 py-0.5 rounded text-xs font-semibold border border-[#174EA6]/20 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.work_type || 'Chưa cập nhật'}
                    </span>

                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-200">
                      Đang nhận hồ sơ
                    </span>

                  </div>

                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {job.job_title || 'Chưa có tên vị trí'}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed font-normal">
                    {job.job_description || 'Chưa có mô tả công việc.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-1 font-medium">

                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />

                      Hạn nộp:

                      <strong className="text-slate-700">
                        {job.deadline || 'Chưa cập nhật'}
                      </strong>
                    </span>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(job);
                      setShowApplyModal(false);
                    }}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
                  >
                    Xem chi tiết
                  </button>

                  <button
                    type="button"
                    onClick={() => openApplyModal(job)}
                    className="px-4 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    Ứng tuyển

                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </article>

            ))

          )}

        </div>
      </section>

      {/* ================= DETAIL MODAL ================= */}

      {selectedJob && !showApplyModal && (

        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">

            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">

              <div className="flex items-center gap-2.5">

                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-mono font-bold">
                  {selectedJob.job_id}
                </span>

                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Đang mở tuyển
                </span>

              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* DETAIL CONTENT */}
            <div className="px-6 py-6 overflow-y-auto space-y-6">

              <div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {selectedJob.job_title}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">

                  <span>
                    Hình thức:

                    <strong className="text-slate-700 ml-1">
                      {selectedJob.work_type || 'Chưa cập nhật'}
                    </strong>
                  </span>

                  <span>
                    Hạn nộp:

                    <strong className="text-rose-600 ml-1">
                      {selectedJob.deadline || 'Chưa cập nhật'}
                    </strong>
                  </span>

                </div>

              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">

                <h4 className="font-bold text-slate-800 text-sm">
                  Mô tả công việc
                </h4>

                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedJob.job_description || 'Chưa có mô tả.'}
                </p>

              </div>

              {/* REQUIRED SKILLS */}
              <div>

                <h4 className="font-bold text-slate-800 mb-1.5 text-sm">
                  Kỹ năng bắt buộc
                </h4>

                <div className="flex flex-wrap gap-1.5">

                  {(selectedJob.required_skills || '')
                    .split(',')
                    .filter(skill => skill.trim())
                    .map((skill, i) => (

                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#174EA6]/10 text-[#174EA6] rounded text-xs font-semibold border border-[#174EA6]/20"
                      >
                        {skill.trim()}
                      </span>

                    ))}

                  {!selectedJob.required_skills && (
                    <span className="text-slate-400 text-xs">
                      Chưa cập nhật
                    </span>
                  )}

                </div>

              </div>

              {/* PREFERRED SKILLS */}
              <div>

                <h4 className="font-bold text-slate-800 mb-1.5 text-sm">
                  Kỹ năng ưu tiên
                </h4>

                <div className="flex flex-wrap gap-1.5">

                  {(selectedJob.preferred_skills || '')
                    .split(',')
                    .filter(skill => skill.trim())
                    .map((skill, i) => (

                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200"
                      >
                        {skill.trim()}
                      </span>

                    ))}

                  {!selectedJob.preferred_skills && (
                    <span className="text-slate-400 text-xs">
                      Không có
                    </span>
                  )}

                </div>

              </div>

              {/* EXPERIENCE */}
              <div>

                <h4 className="font-bold text-slate-800 mb-1.5 text-sm">
                  Kinh nghiệm yêu cầu
                </h4>

                <p className="text-slate-600 text-sm">
                  {selectedJob.required_experience || 'Không yêu cầu'}
                </p>

              </div>

              {/* BENEFITS */}
              <div>

                <h4 className="font-bold text-slate-800 mb-1.5 text-sm">
                  Quyền lợi
                </h4>

                <p className="text-slate-600 text-sm whitespace-pre-line">
                  {selectedJob.benefits || 'Chưa cập nhật'}
                </p>

              </div>

            </div>

            {/* DETAIL FOOTER */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => openApplyModal(selectedJob)}
                className="px-5 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >

                <Upload className="w-3.5 h-3.5" />

                Nộp hồ sơ ứng tuyển

              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= APPLY MODAL ================= */}

      {showApplyModal && selectedJob && (

        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={closeApplyModal}
              disabled={isSubmitting}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL TITLE */}
            <div className="mb-5 pr-8">

              <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">
                Hồ sơ trực tuyến
              </span>

              <h3 className="text-xl font-bold text-slate-800 mt-1">
                Ứng tuyển vị trí
              </h3>

              <p className="text-slate-600 text-xs font-medium mt-1">
                Vị trí:

                <strong className="text-slate-800 ml-1">
                  {selectedJob.job_title}
                </strong>
              </p>

            </div>

            {/* APPLY FORM */}
            <form
              onSubmit={handleApplySubmit}
              className="space-y-4"
            >

              {/* FILE UPLOAD */}
              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Tệp CV đính kèm (PDF)
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all relative ${
                    applyFile
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-[#174EA6]/30 bg-[#174EA6]/5 hover:bg-[#174EA6]/10'
                  }`}
                >

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    required
                    disabled={isSubmitting}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed"
                  />

                  {applyFile ? (

                    <div className="flex flex-col items-center">

                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />

                      <p className="text-xs font-bold text-slate-800 break-all">
                        {applyFile.name}
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {formatFileSize(applyFile.size)}
                      </p>

                      <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                        Đã chọn CV
                      </p>

                    </div>

                  ) : (

                    <div className="flex flex-col items-center">

                      <Upload className="w-7 h-7 text-[#174EA6] mb-2" />

                      <p className="text-xs text-slate-700 font-semibold">
                        Chọn tệp PDF từ thiết bị
                      </p>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Dung lượng tối đa 10MB
                      </p>

                    </div>

                  )}

                </div>

                {applyFile && (
                  <button
                    type="button"
                    onClick={() => setApplyFile(null)}
                    disabled={isSubmitting}
                    className="text-xs text-rose-600 hover:text-rose-700 mt-2 font-medium"
                  >
                    Xóa tệp đã chọn
                  </button>
                )}

              </div>

              {/* INFORMATION */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed flex gap-2">

                <FileText className="w-4 h-4 shrink-0 text-[#174EA6]" />

                <p>
                  Hệ thống sẽ gửi CV tới bộ phận tuyển dụng để tự động trích xuất thông tin và đánh giá mức độ phù hợp với vị trí ứng tuyển.
                </p>

              </div>

              {/* PRIVACY NOTICE */}
              <div className="flex gap-2 text-[11px] text-slate-500 leading-relaxed">

                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />

                <p>
                  Thông tin trong hồ sơ được sử dụng cho mục đích xử lý tuyển dụng.
                </p>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={closeApplyModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !applyFile}
                  className="px-5 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {isSubmitting ? (

                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Đang xử lý...
                    </>

                  ) : (

                    <>
                      Gửi hồ sơ ứng tuyển
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>

                  )}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
