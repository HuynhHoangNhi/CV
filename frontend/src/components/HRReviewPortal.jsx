import React, { useState } from 'react';
import {
  UserCheck, CheckCircle2, X, CalendarDays,
  Video, Mail, Clock, Users, Search
} from 'lucide-react';

export default function HRReviewPortal({
  matchResults, setMatchResults, hrWebhookUrl, showToast
}) {
  const [interviewSchedules, setInterviewSchedules] = useState({});
  const [search, setSearch] = useState({});

  const pending = matchResults.filter(
    c => c["Quyết định của HR"] === 'Pending Review'
  );

  const approved = matchResults.filter(
    c => c["Quyết định của HR"] === 'Approve'
  );

  const rejected = matchResults.filter(
    c => c["Quyết định của HR"] === 'Reject'
  );

  const sentEmails = matchResults.filter(
    c => c["Trạng thái gửi email cho ứng viên"] === 'Đã gửi'
  );

  const handleHRDecision = async (candidateName, email, status) => {
    const schedule = interviewSchedules[email] || {};

    if (status === 'Approve' && (!schedule.date || !schedule.time)) {
      showToast('Vui lòng chọn ngày và giờ phỏng vấn trước khi phê duyệt.', 'error');
      return;
    }

    const generatedMeetLink = status === 'Approve'
      ? `https://meet.google.com/abc-xyz-${Math.floor(100 + Math.random() * 900)}`
      : '';

    setMatchResults(prev => prev.map(c => {
      if (c["Email ứng viên"] === email) {
        return {
          ...c,
          "Quyết định của HR": status,
          "Trạng thái gửi email cho ứng viên": 'Đã gửi',
          "Ngày phỏng vấn": status === 'Approve' ? schedule.date : '-',
          "Giờ phỏng vấn": status === 'Approve' ? schedule.time : '-',
          "Google Meet": generatedMeetLink
        };
      }
      return c;
    }));

    try {
      const res = await fetch(hrWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: candidateName,
          email,
          decision: status,
          meet_link: generatedMeetLink,
          interview_date: status === 'Approve' ? schedule.date : '',
          interview_time: status === 'Approve' ? schedule.time : ''
        })
      });

      if (res.ok) {
        showToast(`Đã chuyển quyết định ${status} sang hệ thống n8n.`);
      } else {
        showToast(`Đã cập nhật giao diện. Máy chủ trả về lỗi ${res.status}.`, 'warning');
      }
    } catch (err) {
      console.warn('Lỗi gọi n8n Webhook:', err);
      showToast('Không thể kết nối n8n. Trạng thái hiện tại mới được cập nhật trên giao diện.', 'warning');
    }
  };

  const filteredCandidates = matchResults.filter(c =>
    `${c["Họ và tên ứng viên"]} ${c["Email ứng viên"]} ${c["Tên vị trí tuyển dụng"]}`
      .toLowerCase().includes((search.candidate || '').toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* STATISTICS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Tổng hồ sơ', value: matchResults.length, icon: Users },
          { title: 'Chờ xét duyệt', value: pending.length, icon: Clock },
          { title: 'Đã phê duyệt', value: approved.length, icon: CheckCircle2 },
          { title: 'Đã từ chối', value: rejected.length, icon: X }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">{item.title}</p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon size={19} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-3">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* CANDIDATE REVIEW */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <UserCheck size={21} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Xét duyệt hồ sơ ứng viên</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kiểm tra kết quả đánh giá và đưa ra quyết định tuyển dụng
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3 items-center">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={search.candidate || ''}
                onChange={e => setSearch(prev => ({ ...prev, candidate: e.target.value }))}
                placeholder="Tìm tên ứng viên, email, vị trí..."
                className="w-full pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
            <span className="text-xs text-slate-500">
              {filteredCandidates.length} hồ sơ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-5 py-4">Thông tin ứng viên</th>
                <th className="px-5 py-4">Lịch phỏng vấn</th>
                <th className="px-5 py-4 text-center">Trạng thái</th>
                <th className="px-5 py-4 text-center">Quyết định</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length > 0 ? filteredCandidates.map((c, idx) => {
                const email = c["Email ứng viên"];
                const isPending = c["Quyết định của HR"] === 'Pending Review';
                const isApproved = c["Quyết định của HR"] === 'Approve';
                const isRejected = c["Quyết định của HR"] === 'Reject';

                return (
                  <tr key={`${email}-${idx}`} className="hover:bg-blue-50/30">
                    <td className="px-5 py-5 align-top min-w-[210px]">
                      <p className="font-semibold text-slate-800">
                        {c["Họ và tên ứng viên"]}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{email}</p>
                      <p className="text-xs text-blue-700 mt-2 font-medium">
                        {c["Tên vị trí tuyển dụng"]}
                      </p>
                      <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        Điểm đánh giá: {c["Điểm phù hợp"]}/10
                      </span>
                    </td>

                    <td className="px-5 py-5 align-top min-w-[220px]">
                      {isPending ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-600">
                            Ngày phỏng vấn
                          </label>
                          <input
                            type="date"
                            value={(interviewSchedules[email] || {}).date || ''}
                            onChange={e => setInterviewSchedules(prev => ({
                              ...prev,
                              [email]: {
                                ...(prev[email] || {}),
                                date: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 text-sm"
                          />

                          <label className="block text-xs font-semibold text-slate-600 pt-1">
                            Giờ phỏng vấn
                          </label>
                          <input
                            type="time"
                            value={(interviewSchedules[email] || {}).time || ''}
                            onChange={e => setInterviewSchedules(prev => ({
                              ...prev,
                              [email]: {
                                ...(prev[email] || {}),
                                time: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 text-sm"
                          />
                        </div>
                      ) : isApproved ? (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-700 flex items-center gap-2">
                            <CalendarDays size={16} className="text-blue-600" />
                            {c["Ngày phỏng vấn"]}
                          </p>
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Clock size={16} />
                            {c["Giờ phỏng vấn"]}
                          </p>
                          {c["Google Meet"] && (
                            <a
                              href={c["Google Meet"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline mt-1"
                            >
                              <Video size={15} /> Google Meet
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Không có lịch phỏng vấn
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-5 text-center align-top">
                      {isPending ? (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                          Chờ duyệt
                        </span>
                      ) : isApproved ? (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                          Đã phê duyệt
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                          Đã từ chối
                        </span>
                      )}

                      <p className="text-[11px] text-slate-400 mt-2">
                        {c["Trạng thái gửi email cho ứng viên"] || 'Chưa gửi'}
                      </p>
                    </td>

                    <td className="px-5 py-5 align-top min-w-[170px]">
                      {isPending ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleHRDecision(
                              c["Họ và tên ứng viên"], email, 'Approve'
                            )}
                            className="w-full flex justify-center items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                          >
                            <CheckCircle2 size={15} /> Phê duyệt
                          </button>
                          <button
                            onClick={() => handleHRDecision(
                              c["Họ và tên ứng viên"], email, 'Reject'
                            )}
                            className="w-full flex justify-center items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold"
                          >
                            <X size={15} /> Từ chối
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center">
                          Đã có quyết định
                        </p>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400">
                    Không tìm thấy hồ sơ phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* INTERVIEW AND EMAIL HISTORY */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarDays size={19} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Lịch phỏng vấn</h3>
              <p className="text-xs text-slate-500 mt-1">
                Danh sách ứng viên đã được phê duyệt
              </p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {approved.length > 0 ? approved.map((c, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-sm text-slate-800">
                  {c["Họ và tên ứng viên"]}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {c["Tên vị trí tuyển dụng"]}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} /> {c["Ngày phỏng vấn"]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {c["Giờ phỏng vấn"]}
                  </span>
                </div>
                {c["Google Meet"] && (
                  <a
                    href={c["Google Meet"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-700 font-semibold hover:underline"
                  >
                    <Video size={15} /> Mở liên kết Google Meet
                  </a>
                )}
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Chưa có lịch phỏng vấn.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail size={19} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Lịch sử gửi email</h3>
              <p className="text-xs text-slate-500 mt-1">
                Trạng thái thông báo gửi đến ứng viên
              </p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {sentEmails.length > 0 ? sentEmails.map((c, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800">
                    {c["Họ và tên ứng viên"]}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 break-all">
                    {c["Email ứng viên"]}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  Đã gửi
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Chưa có email được ghi nhận.
              </p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
