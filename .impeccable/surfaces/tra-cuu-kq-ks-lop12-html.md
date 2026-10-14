---
version: 1
slug: "tra-cuu-kq-ks-lop12-html"
primary_target: "TRA-CUU-KQ-KS-LOP12.html"
related_targets: []
---

# TRA-CUU-KQ-KS-LOP12.html — bảng kê kết quả khảo sát chất lượng khối 12

## Scope & mode

Operate. Một surface duy nhất: công cụ tra cứu + bảng kê + thống kê của kỳ KSCL khối 12 (508 học sinh, 12 lớp, 5 môn), phát hành dạng một file HTML tự chứa.

## Audience, job, action

- **Phụ huynh / học sinh:** gõ số báo danh hoặc họ tên, nhận phiếu 5 môn của đúng một học sinh. Việc chính là tra xong trong vài giây trên điện thoại.
- **Giáo viên / GVCN:** lọc một lớp, sắp xếp theo môn hoặc ĐTB, đọc bảng kê dày và lấy số liệu cho cuộc họp.

Proof/content: bảng điểm gốc 5 môn (`TONG-HOP-KQ-KS-LOP12.xlsx`), 508 học sinh, SBD 12000001–12000508; ô trống nghĩa là "Không thi" và không được tính vào ĐTB.

Constraints: một file, chạy offline, font tự host (không CDN); hai thiết bị đích 1440 và 390; không bịa tên trường, năm học hay ngày tháng.

## Chosen direction

`rw-centre-rail-reference-setting` — challenger, verdict competitive, chọn thay cho hướng được roll. Bảng kê có thước kẻ: lề chú giải rộng, cột hẹp, một engine kẻ vẽ mọi đường đúng 1px, state là dấu in, không bo góc ở đâu cả.

Memorable moment: tra ra một học sinh thì dòng đó được **ngoặc 1px** bao quanh và lề chú giải đổi sang số liệu của riêng em đó.

## Open decisions

- Thêm cột xếp loại học lực, nút xuất CSV, hay bản in riêng cho cuộc họp: chưa đặt, không nằm trong ba chức năng đã chốt.

## Direction contract

THESIS: Trang này là một bảng kê đang làm việc — 508 dòng số đo xếp trong cột hẹp, mọi đường kẻ do một engine vẽ đúng một device pixel — và nó từ chối thẻ kết quả nổi trên nền xanh của ngành.
OWN-WORLD: giấy xương, mực toner ấm, son đỏ cho điểm dưới 5, xanh bi cho shell và focus, dạ quang chỉ cho dòng tìm thấy; hairline 1px; 0 bo góc; state là dấu in — detent hairline lúc nghỉ, ô đặc khi chọn, gạch chéo khi vắng.
STORY: phụ huynh gõ SBD, hiểu ngay năm môn của con và không đọc "không thi" thành điểm 0; giáo viên lọc lớp, sắp xếp và tin vào con số.
FIRST VIEWPORT: masthead một dòng với ô tra cứu là thứ rộng nhất ở bên phải; rail trái hẹp giữ ba khoá nav; dưới là band lọc lớp và khoá sắp xếp, rồi những dòng đầu của bảng kê; lề phải rộng giữ số đếm đang xem.
FORM: bảng kê chỉ huy bởi thước kẻ 1px, challenger `rw-centre-rail-reference-setting` ở vị trí hai trong tay bài, seed key `3c16bfc4`.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
