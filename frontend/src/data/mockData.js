export const initialJobs = [
  {
    job_id: 'JOB001',
    job_title: 'Backend Developer',
    job_description: 'Phát triển REST API, xây dựng chức năng backend và làm việc với cơ sở dữ liệu. Đảm bảo hiệu suất và bảo mật của hệ thống.',
    required_skills: 'Java, Spring Boot, PostgreSQL, RESTful API, Git',
    required_experience: 'Từ 2 năm kinh nghiệm backend; ưu tiên ứng viên từng làm việc với các hệ thống phân tán.',
    preferred_skills: 'Docker, Redis, Microservices, CI/CD',
    work_type: 'Full-time',
    benefits: 'Lương thưởng hấp dẫn, bảo hiểm sức khỏe cao cấp, môi trường trẻ trung.',
    deadline: '2026-10-11',
    status: 'Open'
  },
  {
    job_id: 'JOB002',
    job_title: 'Chuyên viên Phân tích Dữ liệu (Data Analyst)',
    job_description: 'Thu thập, xử lý và phân tích dữ liệu; xây dựng báo cáo, trực quan hóa dữ liệu và hỗ trợ các bộ phận đưa ra quyết định.',
    required_skills: 'SQL, Excel, Python, Data Analysis, Data Visualization',
    required_experience: 'Từ 1.5 năm kinh nghiệm; ưu tiên ứng viên đã làm trong ngành bán lẻ hoặc tài chính.',
    preferred_skills: 'Power BI, Tableau, Pandas, Statistics, Machine Learning',
    work_type: 'Full-time',
    benefits: 'Được tham gia các dự án Big Data thực tế, lộ trình thăng tiến rõ ràng.',
    deadline: '2026-10-15',
    status: 'Open'
  },
  {
    job_id: 'JOB003',
    job_title: 'Chuyên viên Truyền thông & Marketing',
    job_description: 'Lập kế hoạch và triển khai hoạt động truyền thông, xây dựng nội dung trên các kênh trực tuyến, tổ chức sự kiện.',
    required_skills: 'Content Marketing, Social Media, Copywriting, Communication, Marketing Planning',
    required_experience: 'Có ít nhất 1 năm kinh nghiệm quản lý Fanpage hoặc chạy chiến dịch truyền thông.',
    preferred_skills: 'SEO, Canva, Digital Marketing, Google Analytics, Event Planning',
    work_type: 'Full-time',
    benefits: 'Được cấp ngân sách chạy ads lớn, du lịch công ty 2 lần/năm.',
    deadline: '2026-10-20',
    status: 'Open'
  }
];

export const initialParserCandidates = [
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
    "Vị trí ứng tuyển": "Chuyên viên Phân tích Dữ liệu",
    "Thời gian nộp": "2026-10-10 07:48:18",
    "job_id": "JOB002",
    "Trạng thái gửi email cho HR": "Đã gửi"
  },
  {
    "Họ và tên": "PHẠM THU TRANG",
    "Email": "huynhhoangnhi1902@gmail.com",
    "Số điện thoại": "0934567890",
    "Kỹ năng": "Digital Marketing, Content Marketing, Facebook Ads, SEO, Canva",
    "Kinh nghiệm": "Chuyên viên Content tại SunMedia",
    "Học Vấn": "Đại học Quốc gia TP.HCM",
    "Vị trí ứng tuyển": "Chuyên viên Truyền thông & Marketing",
    "Thời gian nộp": "2026-10-10 07:49:27",
    "job_id": "JOB003",
    "Trạng thái gửi email cho HR": "Đã gửi"
  }
];

export const initialMatchResults = [
  {
    "Họ và tên ứng viên": "NGUYỄN VĂN AN",
    "Email ứng viên": "nguyenvanan.dev@gmail.com",
    "Vị trí ứng tuyển": "Backend Developer",
    "Mã tin tuyển dụng": "JOB001",
    "Tên vị trí tuyển dụng": "Backend Developer",
    "Điểm phù hợp": 9.5,
    "Đề xuất đánh giá": "Strong Match",
    "Kỹ năng bắt buộc phù hợp": "Java, Spring Boot, PostgreSQL, RESTful API, Git",
    "Kỹ năng bắt buộc còn thiếu": "Không",
    "Kỹ năng ưu tiên phù hợp": "Docker, Redis, Microservices",
    "Kỹ năng ưu tiên còn thiếu": "CI/CD",
    "Lý do đánh giá": "Đáp ứng toàn bộ kỹ năng bắt buộc và hầu hết kỹ năng ưu tiên. Kinh nghiệm liên quan mật thiết.",
    "Quyết định của HR": "Approve",
    "Ngày phỏng vấn": "2026-11-14",
    "Giờ phỏng vấn": "09:30",
    "Google Meet": "https://meet.google.com/abc-xyz-def",
    "Trạng thái gửi email cho ứng viên": "Đã gửi"
  },
  {
    "Họ và tên ứng viên": "TRẦN MINH HOÀNG",
    "Email ứng viên": "hoang.tm.data@gmail.com",
    "Vị trí ứng tuyển": "Chuyên viên Phân tích Dữ liệu",
    "Mã tin tuyển dụng": "JOB002",
    "Tên vị trí tuyển dụng": "Chuyên viên Phân tích Dữ liệu (Data Analyst)",
    "Điểm phù hợp": 6.8,
    "Đề xuất đánh giá": "Potential Match",
    "Kỹ năng bắt buộc phù hợp": "SQL, Excel, Python",
    "Kỹ năng bắt buộc còn thiếu": "Data Analysis, Data Visualization",
    "Kỹ năng ưu tiên phù hợp": "Power BI, Tableau, Pandas",
    "Kỹ năng ưu tiên còn thiếu": "Statistics, Machine Learning",
    "Lý do đánh giá": "Thiếu một số keyword về Data Visualization trong CV. Cần kiểm tra thêm năng lực thực tế.",
    "Quyết định của HR": "Reject",
    "Ngày phỏng vấn": "-",
    "Giờ phỏng vấn": "-",
    "Google Meet": "",
    "Trạng thái gửi email cho ứng viên": "Đã gửi"
  },
  {
    "Họ và tên ứng viên": "PHẠM THU TRANG",
    "Email ứng viên": "huynhhoangnhi1902@gmail.com",
    "Vị trí ứng tuyển": "Chuyên viên Truyền thông & Marketing",
    "Mã tin tuyển dụng": "JOB003",
    "Tên vị trí tuyển dụng": "Chuyên viên Truyền thông & Marketing (Marketing Executive)",
    "Điểm phù hợp": 7.5,
    "Đề xuất đánh giá": "Good Match",
    "Kỹ năng bắt buộc phù hợp": "Content Marketing, Social Media",
    "Kỹ năng bắt buộc còn thiếu": "Communication, Marketing Planning",
    "Kỹ năng ưu tiên phù hợp": "SEO, Canva, Digital Marketing",
    "Kỹ năng ưu tiên còn thiếu": "Event Planning",
    "Lý do đánh giá": "Phù hợp tốt với mảng Content, tuy nhiên cần bổ sung kỹ năng lập kế hoạch.",
    "Quyết định của HR": "Pending Review",
    "Ngày phỏng vấn": "-",
    "Giờ phỏng vấn": "-",
    "Google Meet": "",
    "Trạng thái gửi email cho ứng viên": "Chưa gửi"
  }
];
