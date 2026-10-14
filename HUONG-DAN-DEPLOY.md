# Đưa trang tra cứu lên mạng (Cloudflare Pages / Vercel / GitHub → Vercel)

> **Đọc dòng này trước.** Sau khi lên mạng, ai có link đều đọc được điểm của **cả 508 em** — dữ liệu nằm ngay trong file HTML, không giấu được. `robots.txt` chỉ ngăn máy tìm kiếm (Google) đánh dấu trang, không ngăn người. **Đừng đăng link lên Facebook hay website trường — chỉ gửi trong nhóm Zalo lớp/email phụ huynh.** Cần chặn bằng danh sách người xem thì xem mục *Chặn người xem* bên dưới.

## Hai bộ đã dựng sẵn — chọn một

Cả hai thư mục đều upload **nguyên thư mục**, giữ nguyên tên file:

| | `deploy-cloudflare\` | `deploy-vercel\` |
|---|---|---|
| Trang | `index.html` (265 KB, đã nhúng font + dữ liệu + biểu tượng tab) | `index.html` (y hệt) |
| Chặn máy tìm kiếm | `robots.txt` (`Disallow: /`) | `robots.txt` (y hệt) |
| Tệp cấu hình | `_headers` (đệm 5 phút, không dò nội dung, không gửi `referrer`) | `vercel.json` (cùng ba quy tắc đó, viết theo cú pháp Vercel) |

**Chọn nền tảng nào?**

| | Cloudflare Pages | Vercel |
|---|---|---|
| Chi phí | Miễn phí | Miễn phí (bản Hobby, cho dự án cá nhân/phi thương mại) |
| Đăng bằng kéo–thả | **Upload assets** (Direct Upload) | **Vercel Drop** tại `vercel.com/drop` |
| Băng thông | Không giới hạn cho trang tĩnh | Dư sức cho quy mô này (~100 GB/tháng ≈ hàng trăm nghìn lượt mở) |
| **Chặn người xem** | **Miễn phí** bằng Cloudflare Access (tới 50 người, đăng nhập bằng mã gửi email) | **Không có ở bản miễn phí** — Password Protection chỉ từ gói Pro (~$20/tháng cho mỗi dự án; bản Hobby không có) |
| Tên miền riêng | Có (miễn phí, bạn tự mang tên miền) | Có (miễn phí, bạn tự mang tên miền) |
| Gỡ xuống | Xoá project là link chết ngay | Xoá project là link chết ngay |

→ **Cần khoá danh sách người xem: chọn Cloudflare.** Chỉ cần một link công khai gọn nhẹ: cả hai như nhau, Vercel Drop thao tác nhanh hơn một nhịp.

## A. Cloudflare Pages

1. `dash.cloudflare.com` → đăng ký/đăng nhập. Miễn phí, **không cần thẻ**.
2. Menu trái: **Workers & Pages** → **Create** → tab **Pages** → **Upload assets**.
3. Đặt tên project. **Tên project chính là địa chỉ link**, nên thêm đuôi khó đoán — ví dụ `tra-cuu-ks12-k7p2` → `https://tra-cuu-ks12-k7p2.pages.dev`.
4. Kéo **cả thư mục `deploy-cloudflare`** vào ô upload.
   ⚠️ `index.html` phải nằm ở **gốc** thư mục (đừng để trong thư mục con), nếu không mở link gốc sẽ ra 404.
5. **Deploy site** → đợi ~10 giây → nhận link `https://<tên-project>.pages.dev`.

**Cập nhật:** Pages → project → **Create new deployment** → upload lại thư mục → Deploy. Link không đổi.

## B. Vercel (Vercel Drop)

1. `vercel.com` → đăng ký/đăng nhập (có thể đăng nhập bằng GitHub/Google/email).
2. Vào **`vercel.com/drop`**.
3. Kéo **cả thư mục `deploy-vercel`** vào trang (hoặc bấm chọn folder). Vercel Drop nhận cả file, folder và `.zip`.
4. Chọn team và **đặt tên project** — cũng là địa chỉ link, nên thêm đuôi khó đoán: `tra-cuu-ks12-k7p2` → `https://tra-cuu-ks12-k7p2.vercel.app`.
5. Bấm **Deploy**. Vercel đăng thẳng lên production và trả link ngay.
   Thư mục đã có `index.html` ở gốc nên Vercel tự lấy làm trang chính, không hỏi gì thêm.

**Cập nhật:** mở project trên dashboard → kéo thư mục vào chính project đó → Vercel tạo bản production mới. Link không đổi.

**Cách khác (nếu bạn thích dòng lệnh):** trong thư mục deploy chạy `npx vercel --prod` (cần Node.js, lần đầu hỏi đăng nhập và vài câu thiết lập — chọn đúng thư mục hiện tại, không framework, không build). Muốn mỗi lần push là tự cập nhật thì xem **mục C** bên dưới.

**Đừng dùng cách "import từ Git"**: repo công khai sẽ đăng luôn dữ liệu điểm lên đó, Google dò được, và xoá cũng khó sạch. Vercel Drop và Cloudflare Direct Upload đều không cần Git.

## Kiểm sau khi có link (làm trước khi gửi phụ huynh)

- Mở link **trên điện thoại**, không chỉ trên máy tính.
- `link/?q=12000013` → phải ra **Hà Tú Anh**, lớp 12A, ĐTB **6.90**.
- `link/?q=ha tu anh` → gõ không dấu vẫn ra.
- `link/#danhsach` → bảng kê 508 dòng; `link/#thongke` → biểu đồ và bảng thống kê.
- Bấm thử một tên trong bảng kê để mở phiếu điểm.
- Mở `link/robots.txt` → phải thấy `Disallow: /`.

## Chặn người xem

**Cloudflare (miễn phí):** cần một **tên miền riêng** trỏ vào Cloudflare trước (project → **Custom domains** → **Set up a domain**). Sau đó: Zero Trust → **Access** → **Applications** → *Add an application* → **Self-hosted** → chọn tên miền đó → policy cho phép theo **danh sách email** phụ huynh → login method **One-time PIN** (phụ huynh nhận mã qua email, không phải tạo mật khẩu). Bản miễn phí đủ cho quy mô này (tối đa 50 người dùng).

**Vercel:** bản miễn phí **không** khoá được trang production cho người ngoài (`Vercel Authentication` chỉ cho thành viên có tài khoản Vercel — phụ huynh không dùng được; `Password Protection` là tính năng trả phí từ gói Pro). Nếu bắt buộc phải khoá mà vẫn dùng Vercel: gửi link riêng cho từng người và chấp nhận rằng link lộ là lộ hết, hoặc tách theo lớp ở mục cuối.

## Tách theo lớp (nếu phụ huynh lớp này không nên thấy điểm lớp khác)

Nói tôi dựng 12 bản, mỗi bản chỉ chứa điểm một lớp — gửi riêng vào nhóm Zalo từng lớp. Vẫn đăng y như trên, chỉ khác là 12 project (hoặc 12 thư mục con trong cùng project).

## Gỡ xuống khi hết nhu cầu

- Cloudflare: Pages → project → Settings → **Delete project**.
- Vercel: project → Settings → **Delete Project**.

Link chết ngay. Đây là điểm hơn hẳn cách gửi file: file đã gửi đi thì không thu hồi được, link thì thu hồi được.

## Khi sửa điểm rồi muốn đăng lại

```
python web-src\build.py
Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-cloudflare\index.html -Force
Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-vercel\index.html -Force
```

Rồi upload lại thư mục tương ứng như mục *Cập nhật*. Đệm chỉ 5 phút nên phụ huynh không gặp bản cũ lâu.

## C. GitHub → Vercel (tự cập nhật mỗi lần push)

Cách này đổi lại quy trình: mỗi lần `git push` là Vercel tự dựng lại site, nên sửa điểm xong chỉ cần push — không phải kéo–thả thư mục nữa. Vercel còn giữ **mọi bản deploy cũ**, lỡ đẩy bản sai thì quay lại bản trước trong một cú bấm.

**Hai điều kiện, cả hai đều bắt buộc:**

1. **Repo phải để private.** Nếu public, toàn bộ điểm 508 em nằm công khai trong repo, và **lịch sử commit cũng lộ theo** — đổi lại private sau cũng không xoá được những gì đã bị sao lại.
2. **Repo private đó phải nằm ở tài khoản GitHub cá nhân, không phải Organization.** Vercel gói miễn phí (Hobby) **không deploy được repo private thuộc GitHub Organization** — gặp trường hợp đó chỉ còn hai đường: để repo public (mất dữ liệu) hoặc nâng gói Pro. Repo private trong tài khoản cá nhân thì chạy bình thường.

**Đừng dùng GitHub Pages:** bản miễn phí chỉ phục vụ repo **public**, tức là vừa lộ dữ liệu trong repo vừa lộ qua link. GitHub ở đây chỉ làm nguồn cho Vercel.

### Lần đầu

```
cd C:\Users\laidu\OneDrive\Desktop\KS
git init -b main
git config user.name "Tên Bạn"
git config user.email "email-github-cua-ban@gmail.com"
git add -A
git commit -m "Trang tra cuu ket qua KSCL lop 12"
```

Tạo repo trên GitHub: `github.com/new` → đặt tên → **chọn Private** → không thêm README/gitignore (đã có sẵn trong máy) → Create. Rồi:

```
git remote add origin https://github.com/<tài-khoản>/<tên-repo>.git
git push -u origin main
```

Lần push đầu tiên, Git Credential Manager sẽ mở trình duyệt cho bạn đăng nhập GitHub (hoặc bạn dán Personal Access Token). Chỉ lần đầu phải làm việc này.

### Nối vào Vercel

1. `vercel.com/new` → **Import Git Repository** → chọn repo vừa push. Nếu repo không hiện trong danh sách, bấm *Adjust GitHub App Permissions* để cấp quyền cho đúng repo đó.
2. Ở màn hình cấu hình:
   - **Framework Preset**: `Other`
   - **Root Directory**: bấm *Edit* → chọn `deploy-vercel`
   - **Build Command**, **Output Directory**: để trống
3. **Deploy**. Từ đó, mỗi lần push vào nhánh `main` là site tự cập nhật.

### Cập nhật điểm về sau

```
python web-src\build.py
Copy-Item TRA-CUU-KQ-KS-LOP12.html deploy-vercel\index.html -Force
git add -A
git commit -m "Cap nhat diem"
git push
```

Vercel dựng lại sau khoảng nửa phút. Muốn quay lại bản trước: Vercel → **Deployments** → chọn bản cũ → **Promote to Production**.

> Mẹo: đừng đưa `.git` ra ngoài OneDrive nếu thấy OneDrive đồng bộ ồn ào — có thể để repo ở `C:\Users\laidu\repos\...` rồi trỏ về đây khi cần.
