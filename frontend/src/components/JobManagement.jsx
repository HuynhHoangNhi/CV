import React, { useState } from 'react';
import {
  Briefcase, Plus, Edit, Trash2,
  FileSpreadsheet, Search, X, Users
} from 'lucide-react';

export default function JobManagement({
  jobs, setJobs, parserCandidates, showToast, fetchSheetData
}) {
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchJob, setSearchJob] = useState('');
  const [searchCandidate, setSearchCandidate] = useState('');

  const emptyForm = {
    job_id: '',
    job_title: '',
    job_description: '',
    required_skills: '',
    required_experience: '',
    preferred_skills: '',
    work_type: 'Full-time',
    benefits: '',
    deadline: '2026-12-31',
    status: 'Open'
  };

  const [jobForm, setJobForm] = useState(emptyForm);

  const filteredJobs = jobs.filter(j =>
    `${j.job_id} ${j.job_title} ${j.required_skills}`
      .toLowerCase().includes(searchJob.toLowerCase())
  );

  const filteredCandidates = parserCandidates.filter(c =>
    `${c["Họ và tên"]} ${c["Email"]} ${c["Vị trí ứng tuyển"]}`
      .toLowerCase().includes(searchCandidate.toLowerCase())
  );

  const openAdd = () => {
    setEditingJob(null);
    setJobForm({
      ...emptyForm,
      job_id: `JOB${String(jobs.length + 1).padStart(3, '0')}`
    });
    setShowJobModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setJobForm({ ...emptyForm, ...job });
    setShowJobModal(true);
  };

  const handleDelete = (jobId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vị trí ${jobId}?`)) return;

    setJobs(prev => prev.filter(j => j.job_id !== jobId));
    showToast(`Đã xóa vị trí ${jobId}.`);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!jobForm.job_id.trim() || !jobForm.job_title.trim() ||
        !jobForm.required_skills.trim()) {
      showToast('Vui lòng nhập mã vị trí, chức danh và kỹ năng bắt buộc.', 'error');
      return;
    }

    if (editingJob) {
      setJobs(prev => prev.map(j =>
        j.job_id === editingJob.job_id ? { ...jobForm } : j
      ));
      showToast('Cập nhật vị trí tuyển dụng thành công.');
    } else {
      if (jobs.some(j => j.job_id === jobForm.job_id)) {
        showToast('Mã vị trí đã tồn tại.', 'error');
        return;
      }
      setJobs(prev => [jobForm, ...prev]);
      showToast('Thêm vị trí tuyển dụng thành công.');
    }

    setShowJobModal(false);
  };

  const statusStyle = (status) => {
    if (status === 'Open') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (status === 'Closed') return 'bg-slate-100 text-slate-600 border-slate-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-6">

      {/* JOB MANAGEMENT */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-200">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase size={21} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Danh sách vị trí tuyển dụng</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Quản lý thông tin và yêu cầu của các vị trí công việc
                </p>
              </div>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"
            >
              <Plus size={17} /> Thêm vị trí
            </button>
          </div>

          <div className="mt-5 flex flex-wrap justify-between items-center gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={searchJob}
                onChange={e => setSearchJob(e.target.value)}
                placeholder="Tìm mã JD, chức danh, kỹ năng..."
                className="w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
            <span className="text-xs text-slate-500">
              Tổng số: <b className="text-slate-800">{jobs.length}</b> vị trí
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-5 py-4">Mã JD</th>
                <th className="px-5 py-4">Chức danh</th>
                <th className="px-5 py-4 min-w-[200px]">Kỹ năng bắt buộc</th>
                <th className="px-5 py-4">Hình thức</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length > 0 ? filteredJobs.map(j => (
                <tr key={j.job_id} className="hover:bg-blue-50/40">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-blue-700">
                    {j.job_id}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {j.job_title}
                  </td>
                  <td className="px-5 py-4 text-slate-600 whitespace-normal max-w-[260px]">
                    {j.required_skills}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{j.work_type}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${statusStyle(j.status)}`}>
                      {j.status === 'Open' ? 'Đang tuyển' :
                       j.status === 'Closed' ? 'Đã đóng' : j.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(j)}
                        title="Chỉnh sửa"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(j.job_id)}
                        title="Xóa"
                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    Không tìm thấy vị trí tuyển dụng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CV RECORDS */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FileSpreadsheet size={21} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Hồ sơ ứng viên đã tiếp nhận</h3>
              <p className="text-xs text-slate-500 mt-1">
                Thông tin được trích xuất từ hồ sơ CV
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-between items-center gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={searchCandidate}
                onChange={e => setSearchCandidate(e.target.value)}
                placeholder="Tìm ứng viên, email, vị trí..."
                className="w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
            <span className="text-xs text-slate-500">
              Tổng số: <b className="text-slate-800">{parserCandidates.length}</b> hồ sơ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-5 py-4">Ứng viên</th>
                <th className="px-5 py-4">Thông tin liên hệ</th>
                <th className="px-5 py-4">Vị trí ứng tuyển</th>
                <th className="px-5 py-4 min-w-[180px]">Kỹ năng</th>
                <th className="px-5 py-4">Thời gian nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length > 0 ? filteredCandidates.map((c, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40">
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {c["Họ và tên"]}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-700">{c["Email"]}</p>
                    <p className="text-xs text-slate-400 mt-1">{c["Số điện thoại"]}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">{c["Vị trí ứng tuyển"]}</p>
                    <p className="text-xs text-blue-600 mt-1">{c["job_id"]}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 whitespace-normal">
                    {c["Kỹ năng"]}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {c["Thời gian nộp"]}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    Chưa có hồ sơ phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD / EDIT FORM */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">

            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {editingJob ? 'Cập nhật vị trí tuyển dụng' : 'Thêm vị trí tuyển dụng'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Nhập thông tin chi tiết của vị trí công việc
                </p>
              </div>
              <button
                onClick={() => setShowJobModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Mã vị trí *</label>
                  <input
                    required
                    value={jobForm.job_id}
                    onChange={e => setJobForm({ ...jobForm, job_id: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Hình thức làm việc</label>
                  <select
                    value={jobForm.work_type}
                    onChange={e => setJobForm({ ...jobForm, work_type: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tên chức danh *</label>
                <input
                  required
                  value={jobForm.job_title}
                  onChange={e => setJobForm({ ...jobForm, job_title: e.target.value })}
                  placeholder="Ví dụ: Backend Developer"
                  className="w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Mô tả công việc</label>
                <textarea
                  rows="4"
                  value={jobForm.job_description}
                  onChange={e => setJobForm({ ...jobForm, job_description: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Kỹ năng bắt buộc *</label>
                <input
                  required
                  value={jobForm.required_skills}
                  onChange={e => setJobForm({ ...jobForm, required_skills: e.target.value })}
                  placeholder="Java, Spring Boot, PostgreSQL..."
                  className="w-full px-3 py-2.5 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Phân cách các kỹ năng bằng dấu phẩy.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Kỹ năng ưu tiên</label>
                <input
                  value={jobForm.preferred_skills}
                  onChange={e => setJobForm({ ...jobForm, preferred_skills: e.target.value })}
                  placeholder="Docker, Redis..."
                  className="w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kinh nghiệm yêu cầu</label>
                  <input
                    value={jobForm.required_experience}
                    onChange={e => setJobForm({ ...jobForm, required_experience: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Hạn ứng tuyển</label>
                  <input
                    type="date"
                    value={jobForm.deadline}
                    onChange={e => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quyền lợi</label>
                <textarea
                  rows="2"
                  value={jobForm.benefits}
                  onChange={e => setJobForm({ ...jobForm, benefits: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Trạng thái</label>
                <select
                  value={jobForm.status}
                  onChange={e => setJobForm({ ...jobForm, status: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm"
                >
                  <option value="Open">Đang tuyển</option>
                  <option value="Closed">Đã đóng</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  {editingJob ? 'Lưu thay đổi' : 'Tạo vị trí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
