# DỰ ÁN HỆ THỐNG TUYỂN DỤNG TỰ ĐỘNG BẰNG N8N & AI (CV MATCHING SYSTEM)

- **Repository GitHub**: [https://github.com/HuynhHoangNhi/CV](https://github.com/HuynhHoangNhi/CV)
- **Công nghệ sử dụng**: ReactJS (Frontend), n8n Automation, OpenAI / Groq LLM API, Google Sheets API, Gmail API, Google Calendar API.
- **Thành viên nhóm (3 người)**:
  - **Người 1**: Tiếp nhận & Bóc tách CV (WF1: Webhook Intake + OCR Parsing)
  - **Người 2**: AI Chấm điểm & Matching CV (WF2: Score CV Match)
  - **Người 3**: HR Phê duyệt, Tự động gửi Gmail & Tạo Lịch Phỏng vấn (WF3: Gmail + Google Calendar Sync)

---

## 1. CẤU TRÚC REPOSITORY GITHUB (Dành cho 3 thành viên)

Để 3 người làm việc chung thuận tiện và commit thường xuyên, hãy tổ chức thư mục như sau:

```text
CV/
├── frontend/               # Mã nguồn React App
│   ├── public/
│   ├── src/
│   │   ├── App.jsx         # Giao diện chính (Ứng viên + 3 Tab Admin)
│   │   └── main.jsx
│   └── package.json
├── n8n_workflows/          # File JSON n8n xuất ra để nộp dự án
│   ├── wf1_intake.json     # Workflow tiếp nhận CV & Groq OCR (Người 1)
│   ├── wf2_scoring.json    # Workflow chấm điểm CV Match (Người 2)
│   └── wf3_approval.json   # Workflow gửi Mail & Lịch Calendar (Người 3)
└── README.md               # Hướng dẫn chạy hệ thống
```

### Chiến lược Git Commit cho 3 người:
1. **Người 1**:
   - `git commit -m "feat(frontend): cap nhat giao dien Ung vien nop CV qua Webhook"`
   - `git commit -m "feat(n8n): hoan thien WF1 nhan file PDF va trich xuat thong tin voi Groq"`
2. **Người 2**:
   - `git commit -m "feat(n8n): hoan thien WF2 thuat toan tinh diem CV Match va ghi du lieu Sheet"`
   - `git commit -m "feat(frontend): cap nhat tab Nguoi 2 hien thi chi tiet Skill Gap"`
3. **Người 3**:
   - `git commit -m "feat(n8n): hoan thien WF3 quet Google Sheet gui Gmail va tao Google Calendar Event"`
   - `git commit -m "docs: hoan thien README huong dan chay 1-click cho giang vien"`

---

## 2. HƯỚNG DẪN THIẾT LẬP GOOGLE SHEETS (DATABASE)

Tạo một Google Sheet mới đặt tên là **`Danh sách ứng viên`** và chia làm 3 Tab (Worksheets) như sau:

### Tab 1: `Job_Postings` (Bảng tin tuyển dụng)
Tạo các cột ở hàng 1:
`job_id` | `job_title` | `required_skills` | `preferred_skills`

### Tab 2: `Danh sách ứng viên - CV Parser` (Bóc tách CV)
Tạo các cột ở hàng 1:
`Họ và tên` | `Email` | `Số điện thoại` | `Kỹ năng` | `Kinh nghiệm` | `Học Vấn` | `Vị trí ứng tuyển` | `Thời gian nộp` | `job_id` | `Trạng thái gửi email cho HR`

### Tab 3: `CV_Match_Results` (Kết quả chấm điểm & Duyệt HR)
Tạo các cột ở hàng 1:
`Họ và tên ứng viên` | `Email ứng viên` | `Vị trí ứng tuyển` | `Mã tin tuyển dụng` | `Tên vị trí tuyển dụng` | `Điểm phù hợp` | `Đề xuất đánh giá` | `Kỹ năng bắt buộc phù hợp` | `Kỹ năng bắt buộc còn thiếu` | `Kỹ năng ưu tiên phù hợp` | `Kỹ năng ưu tiên còn thiếu` | `Kinh nghiệm liên quan` | `Lý do đánh giá` | `Phương pháp đánh giá` | `Thời gian đánh giá` | `Quyết định của HR` | `Giờ phỏng vấn` | `Ngày phỏng vấn` | `Trạng thái gửi email cho ứng viên`

---

## 3. HƯỚNG DẪN IMPORT & NỐI WF TRÊN N8N

### Buớc 1: Import 3 file Workflow vào n8n
1. Mở n8n local (`http://localhost:5678`) hoặc n8n Cloud.
2. Chọn **Workflows** -> **Import from File**:
   - Import `w1.txt` (đặt tên n8n là: **WF1 - Intake & Extract**)
   - Import `w3.txt` (đặt tên n8n là: **CV Processing** - Đây chính là WF2 chấm điểm)
   - Import `w2.txt` (đặt tên n8n là: **WF3 - HR Approval & Notification**)

### Bước 2: Thiết lập OAuth Credentials trong n8n
- **Google Sheets OAuth2**: Liên kết tài khoản Google Sheets của bạn.
- **Gmail OAuth2**: Liên kết tài khoản Gmail gửi thư thông báo.
- **Google Calendar OAuth2**: Liên kết lịch cá nhân để tự động tạo sự kiện phỏng vấn.
- **Groq API**: Nhập API key miễn phí từ [console.groq.com](https://console.groq.com).

### Bước 3: Đổi ID Google Sheet trong các Node
Trong các node `Google Sheets`, hãy thay thế Document ID `1kMrj8t9K3jPqjRcrOj0n5R7Mz7JV8STFlGlldKhzpBM` bằng ID file Google Sheet thực tế của bạn.

---

## 4. QUY TRÌNH CHẠY DỰ ÁN TOÀN DIỆN (1-CLICK EXECUTION)

1. **Khởi động n8n Workflows**:
   - Bật công tắc **Active** cho cả 3 Workflows trên giao diện n8n.
   - Copy URL từ node **Webhook** trong WF1 (ví dụ: `http://localhost:5678/webhook/upload-cv`).

2. **Khởi chạy Web UI React**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Thực hiện Quy trình Demo**:
   - **Bước 1 (Ứng viên)**: Truy cập giao diện Ứng viên, bấm "Cấu hình Webhook n8n", dán URL Webhook ở trên. Chọn 1 vị trí tuyển dụng và tải file CV `.pdf` lên.
   - **Bước 2 (Người 1 - n8n WF1)**: File PDF được nhận qua Webhook, trích xuất text, gọi Groq LLM và ghi thông tin vào tab `Danh sách ứng viên - CV Parser`.
   - **Bước 3 (Người 2 - n8n WF2)**: n8n tự động gọi Sub-workflow `CV Processing`, đối chiếu kỹ năng CV với `Job_Postings`, tính điểm % và lưu kết quả sang tab `CV_Match_Results`.
   - **Bước 4 (Người 3 - HR Duyệt & WF3)**: HR truy cập Tab 3 trên Giao diện Admin (hoặc mở Google Sheet trực tiếp), đổi cột `Quyết định của HR` thành `Approve` hoặc `Reject`. n8n Trigger quét mỗi 1 phút sẽ tự động gửi Gmail thông báo tới ứng viên và tạo sự kiện phỏng vấn trên Google Calendar kèm link Meet.
