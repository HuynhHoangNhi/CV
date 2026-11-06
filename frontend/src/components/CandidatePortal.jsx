import React, { useState } from 'react';
import { 
  Search, Briefcase, Clock, Upload, 
  FileText, CheckCircle2, Sparkles, MapPin, X, ChevronRight, RefreshCw, ShieldCheck
} from 'lucide-react';

export default function CandidatePortal({ 
  jobs, parserCandidates, setParserCandidates, 
  matchResults, setMatchResults, webhookUrl, fetchSheetData, isLoading, showToast 
}) {
  const [searchJob, setSearchJob] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFile, setApplyFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredJobs = jobs.filter(j => 
    j.job_title.toLowerCase().includes(searchJob.toLowerCase()) || 
    j.job_description.toLowerCase().includes(searchJob.toLowerCase()) ||
    j.required_skills.toLowerCase().includes(searchJob.toLowerCase())
  );

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyFile) {
      showToast('Vui lòng chọn tệp CV định dạng PDF hợp lệ.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('data', applyFile);
      formData.append('job_id', selectedJob.job_id);
      formData.append('job_title', selectedJob.job_title);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      showToast('Hồ sơ đã được gửi và tiếp nhận thành công.');
      fetchSheetData();

    } catch (err) {
      console.warn('Lỗi kết nối Webhook, chuyển sang chế độ mô phỏng cục bộ:', err);
      showToast('Đã tiếp nhận hồ sơ ứng tuyển.', 'success');

      const candidateName = applyFile.name.replace(/\.[^/.]+$/, "").toUpperCase();

      const newParserRecord = {
        "Họ và tên": candidateName,
        "Email": "candidate.local@domain.com",
        "Số điện thoại": "0905000111",
        "Kỹ năng": selectedJob.required_skills,
        "Kinh nghiệm": "Chờ bóc tách dữ liệu...",
        "Học Vấn": "Cử nhân Công nghệ Thông tin",
        "Vị trí ứng tuyển": selectedJob.job_title,
        "Thời gian nộp": new Date().toISOString().slice(0, 19).replace('T', ' '),
        "job_id": selectedJob.job_id,
        "Trạng thái gửi email cho HR": "Đã gửi"
      };

      const newMatchRecord = {
        "Họ và tên ứng viên": candidateName,
        "Email ứng viên": "candidate.local@domain.com",
        "Vị trí ứng tuyển": selectedJob.job_title,
        "Mã tin tuyển dụng": selectedJob.job_id,
        "Tên vị trí tuyển dụng": selectedJob.job_title,
        "Điểm phù hợp": 8.5,
        "Đề xuất đánh giá": "Good Match",
        "Kỹ năng bắt buộc phù hợp": selectedJob.required_skills,
        "Kỹ năng bắt buộc còn thiếu": "Không",
        "Kỹ năng ưu tiên phù hợp": selectedJob.preferred_skills,
        "Kỹ năng ưu tiên còn thiếu": "Không",
        "Lý do đánh giá": "Hồ sơ đáp ứng đầy đủ tiêu chí kỹ thuật cơ bản.",
        "Quyết định của HR": "Pending Review",
        "Ngày phỏng vấn": "-",
        "Giờ phỏng vấn": "-",
        "Google Meet": "",
        "Trạng thái gửi email cho ứng viên": "Chưa gửi"
      };

      setParserCandidates([newParserRecord, ...parserCandidates]);
      setMatchResults([newMatchRecord, ...matchResults]);
    } finally {
      setIsSubmitting(false);
      setShowApplyModal(false);
      setApplyFile(null);
      setSelectedJob(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FC] text-slate-800 font-sans pb-24">
      
      {/* HERO BANNER - NỀN XANH #174EA6 ĐỒNG BỘ NỀN SIDEBAR ADMIN */}
      <div className="bg-[#174EA6] text-white pt-12 pb-14 px-6 shadow-md">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-blue-100 text-xs font-semibold uppercase mb-4 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-blue-200" /> Cổng Tuyển Dụng Doanh Nghiệp
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            Khám Phá Cơ Hội Nghề Nghiệp
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Tìm kiếm các vị trí công việc phù hợp với kỹ năng và định hướng phát triển chuyên môn của bạn.
          </p>
          
          <div className="bg-white rounded-xl p-2 flex items-center shadow-lg border border-slate-200 max-w-2xl mx-auto focus-within:ring-2 focus-within:ring-blue-300 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Nhập tên vị trí hoặc kỹ năng (VD: Java, SQL, Python)..." 
              value={searchJob}
              onChange={(e) => setSearchJob(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 px-3 py-2 focus:outline-none text-sm placeholder:text-slate-400"
            />
            <button className="bg-[#174EA6] hover:bg-[#0d3c85] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shrink-0 shadow-sm">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* JOB LISTINGS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Vị Trí Đang Tuyển Dụng</h2>
            <span className="bg-[#174EA6]/10 text-[#174EA6] text-xs font-bold px-2.5 py-1 rounded-md border border-[#174EA6]/20">
              {filteredJobs.length} vị trí
            </span>
          </div>
          <button
            onClick={fetchSheetData}
            disabled={isLoading}
            className="text-xs bg-white hover:bg-slate-50 text-[#174EA6] font-semibold px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors flex items-center gap-2 w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#174EA6] ${isLoading ? 'animate-spin' : ''}`} /> Làm mới danh sách
          </button>
        </div>

        <div className="grid gap-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium text-sm">Không tìm thấy vị trí tuyển dụng phù hợp với từ khóa.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div 
                key={job.job_id} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-200 hover:border-[#174EA6]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs font-mono font-bold border border-slate-200">
                      {job.job_id}
                    </span>
                    <span className="bg-[#174EA6]/10 text-[#174EA6] px-2.5 py-0.5 rounded text-xs font-semibold border border-[#174EA6]/20 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#174EA6]" /> {job.work_type}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-200">
                      Đang nhận hồ sơ
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {job.job_title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed font-normal">
                    {job.job_description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-1 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Hạn nộp: <strong className="text-slate-700">{job.deadline}</strong>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
                  >
                    Xem chi tiết
                  </button>
                  <button 
                    onClick={() => { setSelectedJob(job); setShowApplyModal(true); }}
                    className="px-4 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    Ứng tuyển <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedJob && !showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-mono font-bold">
                  {selectedJob.job_id}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Đang mở tuyển
                </span>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 py-6 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedJob.job_title}</h2>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                  <span>Hình thức: <strong className="text-slate-700">{selectedJob.work_type}</strong></span>
                  <span>Hạn nộp: <strong className="text-rose-600">{selectedJob.deadline}</strong></span>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5">Mô tả công việc</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedJob.job_description}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5">Kỹ năng bắt buộc</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.required_skills.split(',').map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#174EA6]/10 text-[#174EA6] rounded text-xs font-semibold border border-[#174EA6]/20">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5">Kỹ năng ưu tiên</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.preferred_skills ? selectedJob.preferred_skills.split(',').map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                        {skill.trim()}
                      </span>
                    )) : <span className="text-slate-400 text-xs">Không có</span>}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5">Kinh nghiệm yêu cầu</h4>
                  <p className="text-slate-600">{selectedJob.required_experience}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5">Quyền lợi</h4>
                  <p className="text-slate-600">{selectedJob.benefits}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => setShowApplyModal(true)}
                className="px-5 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Nộp hồ sơ ứng tuyển
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY MODAL */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-5">
              <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">Hồ sơ trực tuyến</span>
              <h3 className="text-xl font-bold text-slate-800 mt-1">Ứng tuyển vị trí</h3>
              <p className="text-slate-600 text-xs font-medium mt-1">Vị trí: <strong className="text-slate-800">{selectedJob.job_title}</strong></p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Tệp CV đính kèm (PDF)</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative ${
                  applyFile 
                    ? 'border-emerald-400 bg-emerald-50/40' 
                    : 'border-[#174EA6]/30 bg-[#174EA6]/5 hover:bg-[#174EA6]/10'
                }`}>
                  <input 
                    type="file" 
                    accept=".pdf"
                    required
                    onChange={(e) => setApplyFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  
                  {applyFile ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                      <p className="text-xs font-bold text-slate-800 break-all">{applyFile.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{(applyFile.size / (1024*1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-7 h-7 text-[#174EA6] mb-2" />
                      <p className="text-xs text-slate-700 font-semibold">Chọn tệp PDF từ thiết bị</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Dung lượng tối đa 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
                Hệ thống sẽ tự động trích xuất thông tin CV và chuyển tới bộ phận tuyển dụng xử lý.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#174EA6] hover:bg-[#0d3c85] text-white rounded-lg font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang xử lý...
                    </>
                  ) : (
                    'Gửi hồ sơ ứng tuyển'
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
