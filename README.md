# Tra cứu kết quả khảo sát chất lượng khối 12

Trang tra cứu điểm cho phụ huynh và học sinh: **một file HTML tự chứa** (dữ liệu và font nhúng sẵn nên mở offline vẫn chạy), tra theo số báo danh hoặc họ tên, lọc theo lớp, sắp xếp theo điểm, có thống kê theo môn và theo lớp.

**508 học sinh · 12 lớp · 5 môn** (Toán, Lý, Hóa, Anh, Văn)

## ⚠️ Riêng tư — đọc trước khi đổi repo sang public

Toàn bộ điểm của 508 học sinh nằm **trong** `TRA-CUU-KQ-KS-LOP12.html` và `web-src/data.json`. Ai mở được file hoặc link là đọc được hết. Vì vậy:

- **Repo này phải để private.** Chuyển sang public là toàn bộ điểm lộ ra công khai, **kể cả lịch sử commit** — đổi lại private sau đó cũng không xoá được những gì đã bị máy tìm kiếm sao lại.
- `.gitignore` đã loại 5 file điểm gốc của trường và bản Excel gộp, để lịch sử git không chứa chúng ngay từ commit đầu.
- Khi đã deploy thì **site vẫn công khai theo link** (bất kể repo private): chỉ gửi link trong nhóm Zalo lớp hoặc email phụ huynh, đừng đăng lên Facebook hay website trường.

## Cấu trúc

| Đường dẫn | Là gì |
|---|---|
| `TRA-CUU-KQ-KS-LOP12.html` | Bản phát hành để gửi phụ huynh — mở trực tiếp, chạy offline, không cần mạng |
| `deploy-vercel/` | Bản đưa lên Vercel: `index.html` + `robots.txt` + `vercel.json` |
| `deploy-cloudflare/` | Bản đưa lên Cloudflare Pages: `index.html` + `robots.txt` + `_headers` |
| `web-src/` | Nguồn: `app.js`, `app.css`, `index.html` (khung), `data.json` (dữ liệu), `build.py` |
| `tools/` | `build_workbook.py` (gộp 5 file điểm thành một Excel), `validate_workbook.py` |
| `DESIGN.md` · `PRODUCT.md` | Hệ thống thiết kế và mô tả sản phẩm |
| `HUONG-DAN.md` · `HUONG-DAN-DEPLOY.md` | Hướng dẫn sử dụng và hướng dẫn đưa lên mạng |

`index.html` trong hai thư mục `deploy-*` là bản sao của file phát hành — cần chép lại mỗi lần dựng lại (lệnh ở dưới).

## Dựng lại

```
python web-src\build.py
Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-vercel\index.html -Force
Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-cloudflare\index.html -Force
```

`web-src\build.py` chỉ dùng thư viện chuẩn của Python. Riêng `tools\*.py` cần `openpyxl`.
