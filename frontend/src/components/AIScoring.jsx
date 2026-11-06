import React, { useState } from 'react';
import {
  BrainCircuit, Search, CheckCircle2,
  AlertCircle, FileSearch
} from 'lucide-react';

export default function AIScoring({ matchResults }) {
  const [search, setSearch] = useState('');

  const filtered = matchResults.filter(c =>
    `${c["Họ và tên ứng viên"]} ${c["Email ứng viên"]} ${c["Tên vị trí tuyển dụng"]}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const average = matchResults.length
    ? matchResults.reduce((sum, c) => sum + (Number(c["Điểm phù hợp"]) || 0), 0) / matchResults.length
    : 0;

  const highScore = matchResults.filter(c => Number(c["Điểm phù hợp"]) >= 8).length;

  const getScoreColor = score => {
    if (score >= 8) return 'bg-blue-600';
    if (score >= 6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreText = score => {
    if (score >= 8) return 'Phù hợp cao';
    if (score >= 6) return 'Phù hợp trung bình';
    return 'Cần xem xét';
  };

  return (
    <div className="space-y-6">

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Tổng hồ sơ đánh giá</p>
            <FileSearch className="text-blue-600" size={21} />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">{matchResults.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Điểm phù hợp trung bình</p>
            <BrainCircuit className="text-blue-600" size={21} />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">{average.toFixed(1)}<span className="text-sm text-slate-400">/10</span></p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Hồ sơ đạt từ 8 điểm</p>
            <CheckCircle2 className="text-blue-600" size={21} />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">{highScore}</p>
        </div>
      </div>

      {/* RESULT TABLE */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-5 md:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BrainCircuit size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Kết quả phân tích và đánh giá CV</h3>
              <p className="text-xs text-slate-500 mt-1">
                Đối chiếu kỹ năng ứng viên với yêu cầu tuyển dụng
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm tên, email hoặc vị trí..."
                className="w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
            <span className="text-xs text-slate-500">
              {filtered.length} / {matchResults.length} hồ sơ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-5 py-4">Thông tin ứng viên</th>
                <th className="px-5 py-4 min-w-[170px]">Điểm phù hợp</th>
                <th className="px-5 py-4">Đề xuất đánh giá</th>
                <th className="px-5 py-4 min-w-[220px]">Kỹ năng phù hợp</th>
                <th className="px-5 py-4 min-w-[220px]">Kỹ năng còn thiếu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map((c, idx) => {
                const score = Number(c["Điểm phù hợp"]) || 0;
                const percentage = Math.max(0, Math.min(score * 10, 100));

                return (
                  <tr key={`${c["Email ứng viên"]}-${idx}`} className="hover:bg-blue-50/40">
                    <td className="px-5 py-5 align-top">
                      <p className="font-semibold text-slate-800">
                        {c["Họ và tên ứng viên"]}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {c["Email ứng viên"]}
                      </p>
                      <p className="inline-block mt-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        {c["Tên vị trí tuyển dụng"]}
                      </p>
                    </td>

                    <td className="px-5 py-5 align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-800">{score}</span>
                        <span className="text-xs text-slate-400">/10</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreColor(score)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        {getScoreText(score)}
                      </p>
                    </td>

                    <td className="px-5 py-5 align-top">
                      <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1.5 rounded-md text-xs font-semibold">
                        {c["Đề xuất đánh giá"] || 'Chưa có đề xuất'}
                      </span>
                    </td>

                    <td className="px-5 py-5 align-top whitespace-normal">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={16} />
                        <span className="text-slate-600 text-xs leading-relaxed">
                          {c["Kỹ năng bắt buộc phù hợp"] || 'Không có dữ liệu'}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-5 align-top whitespace-normal">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <span className="text-slate-600 text-xs leading-relaxed">
                          {c["Kỹ năng bắt buộc còn thiếu"] || 'Không có dữ liệu'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    Chưa có kết quả phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AI EVALUATION DETAILS */}
        <div className="border-t border-slate-200 p-5 md:p-6">
          <h4 className="font-bold text-slate-800 mb-4">Chi tiết nhận xét đánh giá</h4>

          <div className="space-y-3">
            {filtered.map((c, idx) => (
              <div key={`reason-${idx}`} className="border border-slate-200 rounded-lg p-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {c["Họ và tên ứng viên"]}
                  </p>
                  <span className="text-xs text-blue-700 font-semibold">
                    {c["Tên vị trí tuyển dụng"]}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {c["Lý do đánh giá"] || 'Chưa có nhận xét.'}
                </p>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                Không có nhận xét để hiển thị.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
