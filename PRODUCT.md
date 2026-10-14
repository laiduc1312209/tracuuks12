# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

1 file HTML tự chứa: HTML/CSS/JS thuần + dữ liệu nhúng sẵn, không dependency ngoài, không CDN, chạy offline khi mở trực tiếp.

## Users

- **Chính: phụ huynh và học sinh khối 12.** Sau kỳ khảo sát chất lượng, họ muốn biết điểm của con/em mình — thường tra trên điện thoại, không có tài khoản, không muốn đọc hướng dẫn.
- **Phụ: giáo viên / GVCN.** Cần rà soát theo lớp, đối chiếu nhanh một học sinh, và lấy số liệu cho cuộc họp.

## Product Purpose

Cổng tra cứu kết quả khảo sát chất lượng khối 12 gồm 508 học sinh thuộc 12 lớp với 5 môn (Toán, Lý, Hóa, Anh, Văn) cùng thống kê toàn trường. Thành công là phụ huynh tra đúng kết quả trong vài giây, hiểu ngay em mình thi môn nào, và giáo viên không phải mở Excel.

## Positioning

Dữ liệu thật của trường (đọc trực tiếp từ bảng điểm gốc) được nhúng vào một file duy nhất, nên bản này chạy offline, không cần máy chủ, tài khoản hay kết nối mạng, và có thể gửi cho phụ huynh qua Zalo/email/USB.

## Operating Context

- Phát hành bằng cách gửi 1 file `.html`, hoặc mở tại chỗ trong buổi họp phụ huynh.
- Thiết bị chủ yếu: điện thoại (phụ huynh) và máy tính (giáo viên).
- Kỳ khảo sát có 2 môn chỉ một phần học sinh dự thi: Hóa 221/508, Anh 217/508, Lý 336/508 → phần lớn ô điểm là "Không thi".
- Bảng điểm gốc dùng chung một danh sách SBD 12000001–12000508 cho cả 5 môn.

## Capabilities and Constraints

- 508 học sinh, 12 lớp, 5 môn, SBD 12000001–12000508.
- Tra cứu theo SBD hoặc tên (chấp nhận gõ không dấu).
- Lọc theo lớp; sắp xếp theo từng môn, tổng điểm, ĐTB.
- Thống kê: phổ điểm từng môn, điểm TB theo lớp, tỉ lệ đạt ≥ 5.
- Ô không dự thi ghi "Không thi" và **không** được tính vào ĐTB (ĐTB chia theo số môn thực thi).
- Dữ liệu đã biết là thiếu/không hoàn hảo: file Văn thiếu 2 học sinh (Nguyễn Tấn Dũng 12000107, Nguyễn Mạnh Tuấn Vũ 12000499); 12 học sinh không thi môn nào. Không được tự suy diễn hay bịa bù các chỗ trống này.
- **Ràng buộc quyền riêng tư đã biết:** họ tên, ngày sinh và điểm của toàn bộ 508 học sinh nằm ngay trong file, nên bất kỳ ai có file đều xem được cả danh sách. Thiết kế phải coi đây là dữ liệu nội bộ, ưu tiên luồng tra cứu cá nhân, và người giao việc đã được cảnh báo.
- Chưa có yêu cầu đăng nhập, phân quyền, hay máy chủ.

## Evidence on Hand

- `TONG-HOP-KQ-KS-LOP12.xlsx` — bản tổng hợp 6 sheet (TongHop + 5 môn), nguồn dữ liệu cho web.
- Bảng điểm gốc: `1.-KQ-KS-TOAN12.xlsx`, `2. KQ KS LY12.xlsx`, `3. KQ KS HOA12.xlsx`, `5. KQ KS ANH12.xlsx`, `Điểm Văn lần 1.xlsx`.
- Không có logo, không có ảnh, không có tên trường cụ thể (bảng gốc để trống "TRƯỜNG………").

## Product Principles

1. **Tra trong vài giây.** Ô tra cứu là việc đầu tiên nhìn thấy, và kết quả hiện ngay khi vừa gõ đủ.
2. **Không bao giờ biến "không thi" thành 0 điểm.** Môn không dự thi phải luôn được đọc là vắng mặt, không phải điểm kém.
3. **Một file, chạy offline.** Không phụ thuộc mạng, không tài khoản, mở là dùng.
4. **Đúng số liệu gốc.** Mọi con số hiển thị phải truy được về bảng điểm, kể cả phần thiếu.
5. **Không phán xét học sinh.** Trình bày trung tính, không gắn nhãn tiêu cực cho em thi ít môn.

## Accessibility & Inclusion

- Phụ huynh có thể lớn tuổi và dùng điện thoại: cỡ chữ đủ lớn, tương phản cao, vùng bấm rộng, không cuộn ngang.
- Không truyền đạt thông tin chỉ bằng màu: điểm dưới 5 phải kèm ký hiệu hoặc nhãn đọc được.
- Dùng được bằng bàn phím; nhãn và thông báo bằng tiếng Việt có dấu.
