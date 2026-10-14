# Hướng dẫn dùng & dựng lại

## Trong thư mục này có gì

| File / thư mục | Là gì | Có được sửa tay không |
|---|---|---|
| `TRA-CUU-KQ-KS-LOP12.html` | **Cổng tra cứu cho PH/HS** — một file duy nhất, mở là chạy | **Không** (file sinh tự động) |
| `TONG-HOP-KQ-KS-LOP12.xlsx` | Bảng tổng hợp 508 học sinh, 6 sheet | Được, nhưng lần dựng sau sẽ ghi đè |
| `web-src\index.html`, `app.css`, `app.js`, `data.json` | Nguồn của trang tra cứu | **Được** — sửa ở đây rồi dựng lại |
| `web-src\build.py` | Dựng 4 file nguồn thành 1 file HTML | Được |
| `tools\build_workbook.py` | Dựng bảng tổng hợp từ 5 file điểm gốc | Được |
| `tools\extract_web_data.py` | Trích Excel → `web-src\data.json` | Được |
| `tools\validate_workbook.py` | Kiểm tra chéo 5 file điểm gốc | Được |
| `tools\fonts\` | Font nhúng sẵn (Source Serif 4, Archivo) | Không cần |
| `PRODUCT.md`, `DESIGN.md` | Sản phẩm là gì / hệ thống trình bày | Được |
| `.impeccable\` | Hồ sơ thiết kế: hợp đồng hướng, ảnh chụp, biên bản rà soát | Không |

Năm file điểm gốc (kết quả khảo sát từng môn) **luôn được giữ nguyên** — không script nào ghi vào chúng.

## 1. Mở trang tra cứu

**Máy tính:** bấm đúp vào `TRA-CUU-KQ-KS-LOP12.html`. Không cần mạng, không cần cài gì.

**Điện thoại của phụ huynh:**
1. Gửi file qua Zalo / Email / Google Drive.
2. Tải về máy, rồi mở bằng **Chrome** (Android) hoặc **Safari** (iPhone). Trên iPhone, cách chắc ăn nhất là lưu vào app **Tệp** rồi mở từ đó.
3. Nếu Zalo hiện ra chữ như mã nguồn, chọn **Mở bằng trình duyệt**.

**Cách dùng:** gõ số báo danh hoặc tên vào ô tra cứu (gõ không dấu cũng ra: `ha tu anh` = `Hà Tú Anh`). Ba khu vực: **Tra cứu** · **Danh sách** (lọc lớp, sắp theo điểm) · **Thống kê**.

## 2. Gửi link riêng cho từng phụ huynh

Thêm phần đuôi vào đường dẫn file:

- `...TRA-CUU-KQ-KS-LOP12.html?q=12000013` — mở thẳng phiếu của một học sinh
- `...TRA-CUU-KQ-KS-LOP12.html?lop=12A` — mở thẳng danh sách lớp 12A
- `#tracuu` · `#danhsach` · `#thongke` — mở thẳng từng khu vực

Lưu ý: đường dẫn dạng `file:///...` chỉ đúng trên máy đang giữ file. Muốn gửi một link dùng được cho tất cả mọi người thì phải đưa file lên web — **nhưng khi đó toàn bộ 508 hồ sơ sẽ công khai với bất kỳ ai có link**, vì cả dữ liệu nằm bên trong file HTML. Chỉ nên đăng nội bộ, có kiểm soát.

## 3. Sửa và dựng lại

Cần **Python 3** (máy này đã có). Mở PowerShell:

```powershell
# Sửa giao diện / logic: edit web-src\app.css, app.js, index.html  → rồi:
python "C:\Users\laidu\OneDrive\Desktop\KS\web-src\build.py"

# Đổi dữ liệu điểm (lấy lại từ Excel):
python "C:\Users\laidu\OneDrive\Desktop\KS\tools\extract_web_data.py"
python "C:\Users\laidu\OneDrive\Desktop\KS\web-src\build.py"

# Dựng lại bảng tổng hợp Excel từ 5 file điểm gốc (GHI ĐÈ file TONG-HOP):
python "C:\Users\laidu\OneDrive\Desktop\KS\tools\build_workbook.py"

# Kiểm tra chéo số liệu giữa 5 file gốc:
python "C:\Users\laidu\OneDrive\Desktop\KS\tools\validate_workbook.py"
```

`build.py` sẽ in ra `dữ liệu: 508 học sinh` và `tương phản: tất cả đạt` khi thành công.

- `web-src\build.py` chỉ dùng thư viện chuẩn của Python.
- `tools\*.py` cần `openpyxl` (nếu thiếu: `pip install openpyxl`).
- **Đừng sửa trực tiếp `TRA-CUU-KQ-KS-LOP12.html`** — mọi thay đổi sẽ mất ở lần dựng sau.

## 4. Ba điều nên nhớ

1. **"Không thi" không phải điểm 0.** Ô vắng mặt được đánh dấu bằng chữ viết hoa, gạch ngang và gạch chéo, và bị loại khỏi mọi phép tính (ĐTB chia theo số môn em đó thực sự dự thi). Có hai nhãn vắng: `Không thi` = em không dự môn đó, `Vắng thi` = em vắng cả năm môn.
2. **Điểm dưới 5,0** được in son đỏ ở cả bảng kê, phiếu điểm và vạch ngưỡng trên biểu đồ.
3. Số liệu trong web lấy từ `TONG-HOP-KQ-KS-LOP12.xlsx`. Nếu sửa Excel bằng tay thì phải chạy lại `extract_web_data.py` rồi `build.py`, nếu không web vẫn hiển thị số cũ.

## 5. Ghi chú về dữ liệu gốc (đã kiểm chứng)

- **12 em vắng cả năm môn** được ghi `Vắng thi` ở cả 5 ô điểm, ở cột Tổng/ĐTB và ở cột Ghi chú trong sheet `TongHop` — và trong từng sheet môn. Nhãn `Không thi` chỉ dùng cho em không dự **một** môn nào đó.
- **File điểm Văn gốc chỉ có 506 học sinh**, thiếu `12000107` và `12000499`. Cả hai đều thuộc nhóm vắng cả năm môn, nên ĐTB của các em khác không bị ảnh hưởng; vì thế sheet `Văn` chỉ có 10 ô `Vắng thi` thay vì 12 (hai em này không có dòng trong file gốc).
- Không tự suy diễn hay bù số cho các chỗ trống đó.
