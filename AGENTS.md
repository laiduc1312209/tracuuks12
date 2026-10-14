# KSCL khối 12 — tra cứu kết quả khảo sát chất lượng

5 file Excel của trường (nằm trong `dotks\<đợt>\`) → 1 workbook tổng hợp → `web-src\data.json` → 1 trang HTML tự chứa → Vercel.
Sản phẩm là tiếng Việt: giữ nguyên chữ trên giao diện (`Không thi`, `Vắng thi`, `ĐTB`).

## Lệnh

```
python tools\validate_workbook.py [đợt]   # kiểm chéo SBD / tên / lớp + thống kê từng môn
python tools\build_workbook.py [đợt]      # dotks\<đợt>\*.xlsx -> dotks\<đợt>\TONG-HOP-KQ-KS-LOP12.xlsx
python tools\extract_web_data.py [đợt]    # dotks\<đợt>\TONG-HOP-...xlsx -> web-src\data.json
python web-src\build.py                   # -> TRA-CUU-KQ-KS-LOP12.html (file sinh ra, không nằm trong git)
```

- `[đợt]` mặc định `1`, tức đọc/ghi trong `dotks\1\`. Đợt mới thì tạo `dotks\2\` rồi truyền `2`.
- **Thứ tự bắt buộc**: `build_workbook` trước `extract_web_data` (sau đọc bản Excel gộp mà trước ghi ra). `build.py` chỉ cần `data.json`.
- `web-src\build.py` chỉ dùng thư viện chuẩn; `tools\*.py` cần `openpyxl`.
- `build.py` **hard-code đường dẫn tuyệt đối** trỏ vào `C:\Users\laidu\OneDrive\Desktop\KS\...` — đổi chỗ thư mục là phải sửa file này trước.
- `build.py` dựng xong thì **kiểm tương phản WCAG**: in 8 cặp màu và `sys.exit(1)` nếu có cặp < 4.5:1 (danh sách `cap` trong `build.py`). Thêm màu mới thì thêm vào đó. Dòng cuối khi đạt: `tương phản: tất cả đạt`.
- Không có test suite. Cổng kiểm thực chất: `build.py` (tương phản) và `tools\validate_workbook.py` (`mismatches: 0`, số `blank` từng môn).
- Dựng xong phải chép sang bản deploy: `Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-vercel\index.html -Force`.
- Trong PowerShell: đặt `$env:PYTHONIOENCODING="utf-8"` trước khi chạy, và **đừng lọc output có dấu bằng `Select-String`** — nó không khớp chuỗi UTF-8 và sẽ âm thầm bỏ dòng; đọc file JSON thay vì lọc.

## Dây chuyền dữ liệu

`dotks\<đợt>\` (5 file điểm gốc + bản gộp) → `tools\build_workbook.py` → `TONG-HOP-KQ-KS-LOP12.xlsx` (sheet `TongHop` + 5 sheet môn sao nguyên bản) → `tools\extract_web_data.py` → `web-src\data.json` → `python web-src\build.py` → `TRA-CUU-KQ-KS-LOP12.html`.

- Mọi file `.xlsx` đều bị `.gitignore` chặn (`*.xlsx`) — cả 6 file trong `dotks\` không được đưa lên git.
- `build_workbook.py` tìm 5 file gốc bằng **khớp từ khoá bỏ dấu** (`toan`, `ly`, `hoa`, `anh`, `van`) và bỏ qua file chứa `tong`; đổi tên file nguồn là phải đổi `CONFIG` kèm chỉ số cột. `validate_workbook.py` cũng bỏ qua file `tong` — không thì nó lôi bản gộp vào làm nguồn thứ 6 sai cột.
- `web-src\index.html` là **khung**, chứa placeholder `/*__CSS__*/`, `/*__JS__*/`, `/*__DATA__*/`; `/*FONTS*/` nằm trong `web-src\app.css`. `build.py` thoát nếu thiếu placeholder hoặc còn sót.
- `data.json` có dạng `{ky, mon[5], lop[], hs[{sbd,ten,ns,lop,d[5]}]}`; `d[i]` là số hoặc `null` (null = không thi). Trang đọc từ thẻ `<script id="kqdata">` (`app.js` dòng 7).
- **File sinh ra — không sửa tay**: `TRA-CUU-KQ-KS-LOP12.html` (đã vào `.gitignore`, không nằm trong git) và `deploy-vercel\index.html` (được git theo dõi, là bản phát lên mạng). Hai bản phải giống nhau **từng byte**; lệch nhau là lỗi hay gặp nhất ở repo này.

## Luật nghiệp vụ (dễ làm sai)

- Hai nhãn vắng khác nhau: `Không thi` = không dự **một** môn; `Vắng thi` = vắng **cả năm** môn (12 em) → không có ĐTB, không xếp thứ. Vắng **không phải** điểm 0.
- `ĐTB` = trung bình trên **đúng những môn em đó thực sự dự thi**. `Tổng điểm` giữa hai em dự thi số môn khác nhau **không so sánh được**.
- Lệch làm tròn đã đo: workbook dùng `sum()` + `round()` (banker's) của Python, trang dùng cộng float tuần tự + `toFixed(2)` (half-up) → 56/496 em lệch 0,01. Chưa chốt cách xử lý, **đừng sửa một phía**.
- Đã bị huỷ, không dựng lại: xếp loại học lực, xuất CSV, nút in báo cáo, bảng xếp hạng. Dòng nhỏ `xếp thứ N/M trong lớp` trong phiếu có từ trước — giữ nguyên.

## Giao diện

- `DESIGN.md` và `.impeccable\design.json` là hợp đồng thiết kế; đổi UI thì cập nhật cả hai cùng surface brief `.impeccable\surfaces\*.md`. Phần nhìn nên làm qua skill `impeccable`.
- **Mọi đường kẻ cấu trúc do một engine 1px vẽ** vào lớp SVG phủ, bám nửa device pixel qua `snap()` / `snapFloor()`. **Không dùng `border`, `outline` hay `hr`** cho đường kẻ — ngoại lệ duy nhất là gạch chân hàng tiêu đề `position: sticky`.
- `border-radius: 0` ở mọi nơi, không `box-shadow`, không chuyển sắc. Trạng thái thể hiện bằng dấu in, không bằng nâng phần tử khỏi mặt giấy.
- Markup điều khiển engine: `class="ruled"`, `data-r="…"`, `data-render="rules|chart|parts"`. Thay `innerHTML` xong phải để lượt render lại chạy (`app.js` quét `.ruled`), nếu không đường kẻ biến mất.
- Một file, chạy offline, font tự host nhúng base64: **không thêm request ra ngoài** (CDN, ảnh, font).

## Deploy

- Link đang chạy: **https://tracuuks12.vercel.app/** (kiểm 2026-10-14: `/` và `/robots.txt` đều 200). Link ghi ở phần About của repo (`tracuuks12-deploy-vercel.vercel.app`) trả về 404 — đừng phát.
- Vercel import từ GitHub `laiduc1312209/tracuuks12`, Root Directory là thư mục `deploy-vercel` (không phải gốc repo), Framework `Other`, không build command. Push lên `main` là Vercel tự dựng lại; mọi bản deploy cũ giữ lại để rollback.
- Kiểm bản trên mạng có khớp repo không: tải `https://tracuuks12.vercel.app/index.html` rồi so sha256 với `deploy-vercel\index.html` (đúng chuẩn thì trùng hoàn toàn).
- Đường Cloudflare (`deploy-cloudflare\`, `_headers`) đã bỏ; nếu cần thì lấy lại từ commit trước.

## Riêng tư (trạng thái đã chốt)

- `web-src\data.json` và `deploy-vercel\index.html` chứa họ tên, ngày sinh và điểm của cả 508 học sinh; repo GitHub đang để **public** và người dùng đã biết, đã chốt là chấp nhận — **không nhắc lại nữa, cũng đừng tự đổi sang private**.
- Vẫn giữ đúng một luật: **không commit file `.xlsx` gốc** (`.gitignore` chặn `*.xlsx`). Đừng đổi thành liệt kê tên có dấu — tên file tiếng Việt trên đĩa ở dạng Unicode tổ hợp (NFD) nên dòng ignore viết ở dạng dựng sẵn (NFC) sẽ không khớp, file sẽ lọt lên git.

## Mốc sắp xếp lại (2026-10-14)

- Nguồn điểm chuyển từ gốc KS vào `dotks\1\`; ba script `tools\*.py` đã đọc theo `dotks\<đợt>\` (tham số dòng lệnh, mặc định `1`).
- Bỏ khỏi git: `deploy-cloudflare\`, `TRA-CUU-KQ-KS-LOP12.html`, `HUONG-DAN.md`, `HUONG-DAN-DEPLOY.md`, `PRODUCT.md` (còn trong commit trước, lấy lại bằng `git show <commit>:<file>`).
- Không xem được ảnh bằng mắt: kiểm giao diện phải bằng Chrome headless + CDP (`websocket-client`) rồi phân tích pixel. Bộ script tạm ở `%TEMP%\opencode\ks\` **không nằm trong repo** nên có thể đã mất. Kiểm deep link trong PowerShell nhớ dùng `${base}?q=12000013` (viết `$base?q=…` thì PowerShell hiểu thành tên biến).
