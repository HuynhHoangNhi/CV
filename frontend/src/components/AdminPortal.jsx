
import React, { useState } from 'react';
import {
  Briefcase,
  BrainCircuit,
  UserCheck,
  RefreshCw,
  Settings,
  Users,
  CalendarDays,
  ChevronRight
} from 'lucide-react';

import JobManagement from './JobManagement';
import AIScoring from './AIScoring';
import HRReviewPortal from './HRReviewPortal';

export default function AdminPortal({
  jobs = [],
  setJobs,
  parserCandidates = [],
  matchResults = [],
  setMatchResults,
  hrWebhookUrl,
  jobManagementUrl,
  fetchSheetData,
  isLoading = false,
  showToast,
  setShowConfigModal
}) {
  const [adminTab, setAdminTab] = useState(1);

  // Thống kê hồ sơ
  const pending = matchResults.filter(
    candidate =>
      candidate['Quyết định của HR'] === 'Pending Review'
  ).length;

  const approved = matchResults.filter(
    candidate =>
      candidate['Quyết định của HR'] === 'Approve'
  ).length;

  // Danh sách chức năng quản trị
  const menu = [
    {
      id: 1,
      title: 'Quản lý tuyển dụng',
      sub: 'Vị trí công việc',
      icon: Briefcase
    },
    {
      id: 2,
      title: 'Đánh giá ứng viên',
      sub: 'Phân tích hồ sơ CV',
      icon: BrainCircuit
    },
    {
      id: 3,
      title: 'Xét duyệt hồ sơ',
      sub: 'Lịch phỏng vấn',
      icon: UserCheck
    }
  ];

  // Các thẻ thống kê
  const statistics = [
    {
      title: 'Vị trí tuyển dụng',
      value: jobs.length,
      icon: Briefcase
    },
    {
      title: 'Hồ sơ ứng viên',
      value: parserCandidates.length,
      icon: Users
    },
    {
      title: 'Chờ xét duyệt',
      value: pending,
      icon: UserCheck
    },
    {
      title: 'Đã phê duyệt',
      value: approved,
      icon: CalendarDays
    }
  ];

  const currentMenu = menu.find(
    item => item.id === adminTab
  );

  return (
    <div className="min-h-screen bg-[#F3F6FC] flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full lg:w-[255px] shrink-0 bg-[#174EA6] text-white lg:min-h-screen">

        <div className="px-4 pt-6 pb-2">

          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest px-3 mb-3">
            Chức năng quản lý
          </p>

          <nav className="space-y-1">
            {menu.map(item => {
              const Icon = item.icon;
              const active = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                    active
                      ? 'bg-white text-[#174EA6] shadow-md'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {item.title}
                    </div>

                    <div
                      className={`text-[11px] ${
                        active
                          ? 'text-blue-500'
                          : 'text-blue-200'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>

                  {item.id === 3 && pending > 0 && (
                    <span className="bg-red-500 text-white rounded-full text-[10px] min-w-5 h-5 flex items-center justify-center px-1">
                      {pending}
                    </span>
                  )}

                  {active && (
                    <ChevronRight size={16} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SYSTEM MENU */}
        <div className="px-4 pt-5">

          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest px-3 mb-3">
            Hệ thống
          </p>

          <button
            onClick={() => fetchSheetData?.()}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-blue-100 hover:bg-white/10 rounded-lg disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={isLoading ? 'animate-spin' : ''}
            />

            Đồng bộ dữ liệu
          </button>

          <button
            onClick={() => setShowConfigModal?.(true)}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-blue-100 hover:bg-white/10 rounded-lg"
          >
            <Settings size={18} />
            Cấu hình hệ thống
          </button>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="hidden lg:block px-7 mt-10">
          <div className="border-t border-blue-400/30 pt-4">
            <p className="text-[11px] text-blue-200">
              AI Recruitment System
            </p>
            <p className="text-[10px] text-blue-300 mt-1">
              Administration Portal
            </p>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">

        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-4">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {currentMenu?.title || 'Quản trị hệ thống'}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Quản lý và theo dõi hoạt động tuyển dụng
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-700">
                  Quản trị viên
                </p>

                <p className="text-xs text-slate-400">
                  Quản lý tuyển dụng
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users size={20} />
              </div>

            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-7 max-w-[1500px] mx-auto space-y-6">

          {/* OVERVIEW */}
          <section>

            <div className="flex flex-wrap justify-between items-end gap-2 mb-4">

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Tổng quan hệ thống
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Thống kê dữ liệu tuyển dụng hiện tại
                </p>
              </div>

              <button
                onClick={() => fetchSheetData?.()}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm text-blue-700 font-semibold px-3 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={isLoading ? 'animate-spin' : ''}
                />

                Làm mới
              </button>

            </div>

            {/* STATISTIC CARDS */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

              {statistics.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm"
                  >

                    <div className="flex justify-between items-start">

                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 font-medium">
                          {item.title}
                        </p>

                        <p className="text-2xl font-bold text-slate-800 mt-2">
                          {item.value}
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon size={21} />
                      </div>

                    </div>

                    <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{
                          width: `${Math.min(item.value * 10, 100)}%`
                        }}
                      />
                    </div>

                  </div>
                );
              })}

            </div>
          </section>

          {/* MODULE CONTENT */}
          <section className="min-w-0">

            {/* TAB 1: JOB MANAGEMENT */}
            {adminTab === 1 && (
              <JobManagement
                jobs={jobs}
                setJobs={setJobs}
                parserCandidates={parserCandidates}
                showToast={showToast}
                fetchSheetData={fetchSheetData}
                jobManagementUrl={jobManagementUrl}
              />
            )}

            {/* TAB 2: AI SCORING */}
            {adminTab === 2 && (
              <AIScoring
                matchResults={matchResults}
              />
            )}

            {/* TAB 3: HR REVIEW */}
            {adminTab === 3 && (
              <HRReviewPortal
                matchResults={matchResults}
                setMatchResults={setMatchResults}
                hrWebhookUrl={hrWebhookUrl}
                showToast={showToast}
              />
            )}

          </section>

          {/* FOOTER */}
          <footer className="border-t border-slate-200 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Hệ thống Quản lý Tuyển dụng AI
            </p>
          </footer>

        </div>
      </main>
    </div>
  );
}
