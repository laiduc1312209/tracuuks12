# Tra cứu kết quả khảo sát chất lượng khối 12

Trang tra cứu điểm cho phụ huynh và học sinh: **một file HTML tự chứa** (dữ liệu và font nhúng sẵn nên mở offline vẫn chạy), tra theo số báo danh hoặc họ tên, lọc theo lớp, sắp xếp theo điểm, có thống kê theo môn và theo lớp.

**508 học sinh · 12 lớp · 5 môn** (Toán, Lý, Hóa, Anh, Văn)

Trang đang chạy: <https://tracuuks12.vercel.app/>

## Cấu trúc

| Đường dẫn | Là gì |
|---|---|
| `dotks\1\` | Nguồn của đợt khảo sát 1: 5 file điểm gốc và bản gộp `TONG-HOP-KQ-KS-LOP12.xlsx`. Mọi file `.xlsx` đều bị `.gitignore` chặn, không nằm trong git |
| `web-src\` | Nguồn trang: `app.js`, `app.css`, `index.html` (khung), `data.json` (dữ liệu đã trích), `build.py` |
| `deploy-vercel\` | Bản phát lên Vercel: `index.html` + `robots.txt` + `vercel.json` |
| `tools\` | `build_workbook.py` (gộp điểm), `extract_web_data.py` (ra `data.json`), `validate_workbook.py` (kiểm chéo) |
| `DESIGN.md`, `.impeccable\` | Hệ thống thiết kế và biên bản review |
| `AGENTS.md` | Ghi chú cho phiên làm việc tự động |

`TRA-CUU-KQ-KS-LOP12.html` là **file sinh ra** khi dựng nên không nằm trong git; bản `deploy-vercel\index.html` được git theo dõi và phải giống nó từng byte.

## Dựng lại

```
python tools\validate_workbook.py         # kiểm chéo 5 file gốc (mong đợi: mismatches: 0)
python tools\build_workbook.py            # -> dotks\1\TONG-HOP-KQ-KS-LOP12.xlsx
python tools\extract_web_data.py          # -> web-src\data.json
python web-src\build.py                   # -> TRA-CUU-KQ-KS-LOP12.html
Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-vercel\index.html -Force
```

- Đợt khảo sát khác thì tạo `dotks\2\` rồi truyền số đợt: `python tools\build_workbook.py 2` (cả `extract_web_data.py` và `validate_workbook.py` cũng nhận tham số này).
- `tools\*.py` cần `openpyxl`; `web-src\build.py` chỉ dùng thư viện chuẩn.
- Push lên nhánh `main` là Vercel tự dựng lại trang.
- Hướng dẫn cũ (`HUONG-DAN.md`, `HUONG-DAN-DEPLOY.md`, `PRODUCT.md`) đã bỏ khỏi repo; lấy lại bằng `git show <commit>:<tên file>` nếu cần.

## Dữ liệu

Điểm nằm trong `web-src\data.json` và trong các bản HTML đã dựng. Hai nhãn vắng khác nhau: `Không thi` (không dự **một** môn) và `Vắng thi` (vắng **cả năm** môn — 12 em, không có ĐTB, không xếp thứ). ĐTB tính trên đúng những môn em đó dự thi; vắng không bị tính là 0.
