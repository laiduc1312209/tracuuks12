---
name: KSCL 12 — bảng kê có thước kẻ
description: Hệ thống trình bày cho cổng tra cứu kết quả khảo sát chất lượng khối 12 — một bảng kê in, mọi đường kẻ do một engine 1px vẽ.
colors:
  giay-xuong: "#f2f0ea"
  giay-xuong-2: "#e8e5dc"
  giay-xuong-3: "#dedad0"
  muc-toner: "#17191b"
  muc-toner-2: "#46443f"
  muc-toner-3: "#5d5b54"
  duong-ke: "#c8c4b9"
  duong-ke-2: "#aba69b"
  son-do: "#a93226"
  xanh-bi: "#22407e"
  da-quang: "#e8d75f"
typography:
  display:
    fontFamily: "Source Serif 4, Times New Roman, serif"
    fontSize: "clamp(26px, 2.6vw, 34px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Source Serif 4, Times New Roman, serif"
    fontSize: "23px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.008em"
  title:
    fontFamily: "Source Serif 4, Times New Roman, serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Source Serif 4, Times New Roman, serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  numeral:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  none: "0"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "72px"
components:
  nav-key:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner-2}"
    typography: "{typography.label}"
    padding: "8px 0 8px 21px"
  nav-key-selected:
    textColor: "{colors.muc-toner}"
    typography: "{typography.label}"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner-2}"
    rounded: "{rounded.none}"
    padding: "4px 9px"
    typography: "{typography.numeral}"
  filter-chip-selected:
    backgroundColor: "{colors.muc-toner}"
    textColor: "{colors.giay-xuong}"
  sort-key:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner-3}"
    padding: "3px 0 3px 15px"
    typography: "{typography.label}"
  search-field:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner}"
    rounded: "{rounded.none}"
    padding: "11px 38px 11px 12px"
    typography: "{typography.body}"
  row-name-button:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner}"
    typography: "{typography.body}"
    padding: "0"
  ledger-row:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner}"
    typography: "{typography.numeral}"
    padding: "9px 0"
  ledger-row-hover:
    backgroundColor: "{colors.giay-xuong-2}"
  ledger-row-found:
    backgroundColor: "{colors.da-quang}"
  score-slip:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner}"
    typography: "{typography.body}"
    padding: "32px 0 0"
  apparatus-margin:
    backgroundColor: "transparent"
    textColor: "{colors.muc-toner-3}"
    typography: "{typography.label}"
    padding: "24px 0 0"
---

# Design System: KSCL 12 — bảng kê có thước kẻ

## Overview

**Creative North Star: "Bảng kê có thước kẻ"**

Hệ thống này là một tờ bảng kê đang làm việc, không phải một trang trưng bày. Giấy xương làm nền, mực toner làm chữ, và mọi đường kẻ cấu trúc — viền ô, gạch đầu dòng, dấu ngoặc, vạch ngưỡng, gạch chéo — đều do **một engine 1px duy nhất** vẽ vào lớp SVG phủ trên từng khung, bám đúng nửa device pixel (`snap()`/`snapFloor()`, nét `1/dpr`). Không có đường kẻ nào là `border` CSS, ngoại lệ duy nhất là gạch chân của hàng tiêu đề đang dính, vì phần tử `position: sticky` không host được lớp SVG dùng chung.

Cách trình bày đi theo kỷ luật của bản in: cột hẹp, chữ số tabular thẳng cột, nhãn viết hoa giãn chữ, và trạng thái thể hiện bằng **dấu in** chứ không bằng màu trang trí — ô vuông detent 7×7 nằm trơ một nét hairline khi nghỉ, đặc mực khi được chọn; ô không có số đo thì bị **gạch chéo** chứ không phải số 0. Ba dấu màu là toàn bộ lượng màu của hệ: son đỏ cho điểm dưới 5,0, xanh bi cho khung và focus, dạ quang cho đúng một dòng đã tìm thấy.

Điều hệ thống này từ chối: thẻ kết quả nổi trên nền xanh của ngành, bo góc, đổ bóng, chuyển sắc, và mọi thứ mô phỏng vật liệu mà trang không thực sự vẽ ra.

**Key Characteristics:**
- Một nguồn đường kẻ duy nhất: engine 1px vẽ mọi nét cấu trúc, bám nửa device pixel.
- Phẳng tuyệt đối: 0 bo góc, 0 đổ bóng, 0 chuyển sắc, ở mọi trạng thái.
- Ba dấu màu, mỗi dấu một nghĩa: son đỏ dưới 5,0 · xanh bi khung/focus · dạ quang dòng đã tìm thấy.
- Chữ số luôn tabular, nhãn luôn viết hoa giãn chữ.
- Trạng thái là dấu in: hairline → ô đặc: gạch chéo cho ô vắng.

## Colors

Bảng màu là vật liệu in: giấy ấm, mực gần đen, ba dấu màu có nghĩa cố định.

### Primary
- **Son đỏ** (`{colors.son-do}`): dấu duy nhất mang nghĩa "dưới ngưỡng" — điểm môn dưới 5,0, ĐTB dưới 5,0, vạch ngưỡng 5,0 trên phổ điểm, và con số đếm phần dưới 5,0 trong bảng thống kê. Không dùng cho tiêu đề, viền, hay nhấn chung.

### Secondary
- **Xanh bi** (`{colors.xanh-bi}`): thuộc về cái khung, không thuộc về dữ liệu — liên kết, viền focus, và thanh "số học sinh dự thi" trong biểu đồ dự thi.

### Tertiary
- **Dạ quang** (`{colors.da-quang}`): đúng một dòng — dòng kết quả đang tìm thấy trong Tra cứu, và dòng đã mở phiếu trong bảng kê.

### Neutral
- **Giấy xương** (`{colors.giay-xuong}`): nền của mọi mặt phẳng, kể cả nền của hàng tiêu đề đang dính.
- **Giấy xương 2 / 3** (`{colors.giay-xuong-2}`, `{colors.giay-xuong-3}`): nền phản hồi khi rê chuột và các bậc tông nhẹ hơn khi cần tách lớp bằng tông, không bằng bóng.
- **Mực toner** (`{colors.muc-toner}`): thân chữ, chữ số, ô detent đặc, thanh biểu đồ phổ điểm.
- **Mực toner 2** (`{colors.muc-toner-2}`): chữ phụ (mô tả, lớp, nhãn cột), vẫn đạt 8,54:1 trên giấy.
- **Mực toner 3** (`{colors.muc-toner-3}`): nhãn nhỏ nhất và dấu "vắng mặt" — sắc nhạt nhất được phép, 5,96:1 trên giấy.
- **Đường kẻ / Đường kẻ 2** (`{colors.duong-ke}`, `{colors.duong-ke-2}`): hai cỡ nét kẻ. `duong-ke` là nét cấu trúc thường (1px, vẽ bởi engine); `duong-ke-2` là nét nặng hơn cho rãnh cuộn, viền detent, gạch ngang chữ "không thi", vạch mốc 5,0 giữa ô đo, và nét dưới của đường đôi.

### Named Rules
**The One Mark Rule.** Son đỏ chỉ xuất hiện ở nơi một con số thấp hơn 5,0. Nếu son đỏ xuất hiện mà không có nghĩa "dưới ngưỡng", đó là lỗi hệ thống.

**The Marker Rule.** Dạ quang dành cho đúng một dòng: dòng đã tìm thấy hoặc đã mở phiếu. Không dùng dạ quang cho nhấn, cho nút, hay cho nhiều hơn một dòng cùng lúc.

**The Tonal Paper Rule.** Tách lớp bằng tông giấy (`giay-xuong` → `giay-xuong-2` → `giay-xuong-3`), không bằng bóng.

## Typography

**Display Font:** Source Serif 4 (với Times New Roman, serif)
**Body Font:** Source Serif 4 (với Times New Roman, serif)
**Label/Numeral Font:** Archivo (với Segoe UI, system-ui, sans-serif)

**Character:** Hai giọng tách bạch: serif đọc như chữ in trên bảng kê (tên học sinh, tiêu đề, mọi câu chữ), còn Archivo — grotesque, khô, có chữ số tabular — dành riêng cho bộ máy: số báo danh, nhãn viết hoa, khoá sắp xếp, mọi con số điểm. Cả hai font đều tự host và được nhúng base64 vào file phát hành, không gọi CDN.

### Hierarchy
- **Display** (600, `clamp(26px, 2.6vw, 34px)`/1.12, -0.012em): tiêu đề ở masthead, một dòng, cân dòng bằng `text-wrap: balance`.
- **Headline** (600, 23px/1.2, -0.008em): tên học sinh trên phiếu điểm — cấp cao nhất trong phần dữ liệu.
- **Title** (600, 19px/1.25, -0.005em): tiêu đề mục trong Thống kê và các nhóm lớn.
- **Body** (400, 16.5px/1.55): thân chữ mặc định; đoạn dẫn giới hạn 68ch; khối phiếu điểm và tổng giới hạn 560px để mắt không phải quét ngang.
- **Label** (600, 11.5px/1.2, 0.08em, viết hoa): nhãn cột bảng, khoá sắp xếp, tên trường trong lề chú giải; có bậc nhỏ hơn 10.5px/0.13em cho nhãn trong lề.
- **Numeral** (400–600, 14.5–19px, Archivo + `tnum`): mọi con số — SBD, điểm môn, tổng, ĐTB, số học sinh.

### Named Rules
**The Tabular Numeral Rule.** Mọi con số đi qua Archivo với `font-variant-numeric: tabular-nums`. Chữ số không thẳng cột là lỗi hệ thống, vì cả trang này tồn tại để so cột.

**The Two Voices Rule.** Serif nói phần con người, Archivo nói phần số liệu. Không trộn: nhãn và số không bao giờ dùng serif, câu chữ không bao giờ dùng Archivo.

## Layout

Khung xếp ba cột trên màn hình rộng: **rail 176px** (dấu `KSCL 12`, ba khoá nav, phần chân) · cột nội dung co giãn · **lề chú giải 264px** chứa số đếm đang xem, danh sách định nghĩa và chú giải dấu. Dưới 1200px lề chú giải gấp xuống dưới nội dung; dưới 900px rail trở thành một dải ngang và bảng kê chuyển sang lối xếp dọc từng học sinh.

Trong tab trình duyệt, trang mang đúng dấu đó: biểu tượng tab là chữ `K` serif trên nền giấy, nhúng base64 ngay trong `<head>` — không tệp rời, không gọi ra ngoài, nên bản mở offline lẫn bản đưa lên mạng đều không xin favicon từ đâu cả.

Nhịp dọc là thang 8 bậc (`s1` 4px … `s8` 72px): mỗi mục lớn cách nhau `s7` (48px), tiêu đề mục cách phần trên nhiều hơn phần dưới (`s7` trên, `s2` dưới), các khối trong phiếu cách nhau `s4`, hàng trong bảng kê đệm 9px trên/dưới, hàng kết quả đệm `s3`.

Trên cùng, một **band** dính giữ hai tầng điều khiển (lọc lớp bằng chip, khoá sắp xếp) và biến thành biến `--bandH` để hàng tiêu đề bảng kê dính ngay dưới nó đúng 0px khe. Bề rộng cột trong bảng kê do nội dung quyết định; cột số hẹp và đều nhau, cột họ tên rộng nhất.

## Elevation & Depth

**Không có bóng, không có tầng nổi.** Hệ thống này phẳng tuyệt đối ở mọi trạng thái — không `box-shadow`, không `backdrop-filter`, không chuyển sắc, không bo góc. Độ sâu được truyền bằng cấu trúc chứ không bằng ánh sáng: các bậc tông giấy, nét kẻ 1px dày/nhạt khác nhau, nét đôi dưới dòng tổng, và dạ quang trên dòng đang xét. Trạng thái đẩy lên không nâng phần tử lên khỏi mặt giấy mà **in thêm một dấu** lên đó.

### Named Rules
**The Flat-Sheet Rule.** Không thêm bóng hay chuyển sắc ở bất kỳ trạng thái nào. Nếu một phần tử cần "nổi", nó cần một nét kẻ hoặc một dấu, không cần bóng.

## Shapes

Bo góc bằng 0 ở mọi nơi — `*, *::before, *::after { border-radius: 0 }`. Hình dáng của hệ thống là góc vuông và nét 1px, với bốn hình dấu tạo thành ngôn ngữ riêng:

- **Nét cấu trúc:** hairline `1/dpr`, bám nửa device pixel, vẽ từ mép trái sang mép phải của phần tử.
- **Ngoặc (bracket):** bốn hairline mực bao quanh một dòng, nhô ra 3px mỗi phía — dấu cho dòng đã tìm thấy.
- **Đường đôi (total rule):** dưới khối tổng, một nét mực rồi một nét nhạt hơn cách nhau 3px — quy ước in cho "số này là số cộng lại".
- **Gạch chéo (hatch):** một nét mực nhạt chéo qua ô đo nơi học sinh vắng mặt, kèm nét chân ô — ô trống có dấu, không phải số 0.
- **Ô detent:** hình vuông 7×7 viền hairline nằm trước mỗi khoá nav/khoá sắp xếp; khi được chọn thì đặc mực.
- **Vạch mốc 5,0:** một nét dọc 1px cao 13px ở giữa mỗi ô đo điểm, để mắt đọc được ngưỡng mà không cần đọc số.

## Components

### Buttons
- **Shape:** góc vuông (0 radius), không viền ngoài, chỉ nét kẻ do engine vẽ.
- **Khoá nav (rail):** chữ Archivo 500 13,5px màu `muc-toner-2`, đệm `8px 0 8px 21px`; khoá đang mở đậm lên 600 và `muc-toner`; ô detent 7×7 nằm ở mép trái.
- **Khoá sắp xếp (band):** chữ Archivo 600 11,5px viết hoa giãn 0,08em màu `muc-toner-3`; đang áp dụng thì `muc-toner` và ô detent đặc mực; mũi tên hướng là SVG 7×9 nét vẽ, không phải ký tự.
- **Nút mở phiếu (ô họ tên trong bảng kê):** chữ thừa hưởng nguyên dòng, không nền không viền; rê chuột hiện gạch chân 1px màu `duong-ke-2`; bấm hoặc Enter mở phiếu của học sinh đó.
- **Hover / Focus:** không đổi nền, đổi mực hoặc hiện gạch chân; focus luôn là viền 1px `xanh-bi` lệch 2px.

### Chips
- **Style:** chip lọc lớp — nền trong suốt, viền 1px `duong-ke`, chữ Archivo 500 12,5px `muc-toner-2`, đệm `4px 9px`, góc vuông.
- **State:** rê chuột đổi viền sang `duong-ke-2` và chữ sang `muc-toner`; đang lọc thì **đặc mực** (nền `muc-toner`, chữ `giay-xuong`) — trạng thái chọn là ô đặc, không phải nền nhạt.

### Inputs / Fields
- **Style:** ô tra cứu — nền trong suốt, **viền 1px mực toner** (nét đậm nhất trong trang, vì đây là việc chính), đệm `11px 38px 11px 12px`, chữ serif 17px; nút xoá nằm trong lòng ô bên phải.
- **Focus:** viền 1px `xanh-bi` lệch 2px; con trỏ màu mực.
- **Placeholder:** `muc-toner-3` (5,96:1), không phải xám nhạt.

### Navigation
- **Style:** ba khoá dọc trong rail, mỗi khoá một ô detent; trên màn hình hẹp ba khoá xếp thành dải ngang phía trên nội dung, vẫn giữ ô detent. Điều hướng được bằng mũi tên trái/phải trong nhóm, `aria-selected` giữ trạng thái.

### Score Slip (signature)
- Phiếu của đúng một học sinh: tên ở cấp headline, SBD/lớp/ngày sinh bằng nhãn nhỏ cùng dòng, rồi năm hàng môn. Mỗi hàng: nhãn viết hoa — ô đo (thanh mực hoặc **gạch chéo** nếu vắng, luôn có vạch mốc 5,0 ở giữa) — điểm số bên phải. Điểm dưới 5,0 đổi sang son đỏ; ô vắng ghi `KHÔNG THI` (em không dự môn đó) hoặc `VẮNG THI` (em vắng cả năm môn) bằng `muc-toner-3` viết hoa và bị gạch ngang, tuyệt đối không phải số 0. Khối tổng in Tổng điểm / ĐTB / số môn dự thi / môn không thi, chốt bằng đường đôi.
- **Motion:** khi đổi sang học sinh khác, phần thân phiếu hiện dần rồi lớp thước kẻ được **vẽ từ trái sang phải** (clip-path 460ms, ease-out); mô-típ này chỉ chạy khi đổi người, không chạy lại mỗi lần gõ phím hay đổi bộ lọc, và tắt hoàn toàn khi `prefers-reduced-motion`.

### Ledger Table (signature)
- 508 dòng, cột hẹp, chữ số tabular, mỗi dòng một nét kẻ 1px do engine vẽ; ô vắng là `KHÔNG THI` (một môn) hay `VẮNG THI` (cả năm môn) viết hoa `muc-toner-3`, ô dưới 5,0 là số son đỏ; dòng đang rê chuột đổi nền sang `giay-xuong-2`; dòng đã mở phiếu giữ nền dạ quang. Trên màn hình hẹp, mỗi học sinh gấp thành một khối: SBD và tên chiếm trọn dòng, mỗi điểm tự gắn nhãn môn bằng `::before`.

### Apparatus Margin (signature)
- Lề phải 264px: số đếm phạm vi đang xem (chữ số lớn), danh sách định nghĩa của học sinh đang mở, và chú giải năm dòng (điểm dưới 5 · ô gạch chéo mang nhãn `không thi` hoặc `vắng thi` · dòng tìm thấy được ngoặc · dòng đã mở phiếu). Chú giải là hợp đồng của hệ: thêm một dấu mới thì phải thêm một dòng chú giải.

## Do's and Don'ts

### Do:
- **Do** vẽ mọi nét cấu trúc bằng engine 1px và `snap()`/`snapFloor()`; nét phải bám nửa device pixel.
- **Do** giữ `border-radius: 0`, không `box-shadow`, không `background-image` chuyển sắc ở mọi trạng thái.
- **Do** đặt mọi con số trong Archivo với `font-variant-numeric: tabular-nums`.
- **Do** thể hiện trạng thái bằng dấu in: hairline lúc nghỉ, ô đặc khi chọn, gạch chéo khi vắng.
- **Do** dùng son đỏ chỉ cho giá trị dưới 5,0 và vạch ngưỡng 5,0.
- **Do** giữ ô `KHÔNG THI` / `VẮNG THI` ngoài mọi phép tính và ngoài định dạng đỏ (vắng ≠ thấp) — hàng vắng phải đọc được là vắng mặt ngay từ cái liếc đầu tiên.
- **Do** giữ lề chú giải nói đúng thứ đang xem (số đếm phạm vi) và cập nhật chú giải mỗi khi thêm dấu mới.

### Don't:
- **Don't** dùng `border`, `outline` hay `hr` cho đường kẻ cấu trúc — ngoại lệ đã biết là gạch chân của hàng tiêu đề dính.
- **Don't** bo góc, đổ bóng, chuyển sắc, hay làm mờ nền; kể cả ở trạng thái hover/focus.
- **Don't** đặt font hệ thống làm giọng hiển thị: hai giọng của trang đều tự host và nhúng trong file.
- **Don't** dùng ký tự Unicode hay emoji làm biểu tượng — mũi tên, ngoặc, detent, dấu chéo đều là SVG hoặc hình CSS.
- **Don't** thêm nhãn nhỏ (kicker/eyebrow) phía trên một tiêu đề.
- **Don't** dùng serif cho chữ số hay nhãn, và không dùng Archivo cho câu chữ.
- **Don't** dùng dạ quang cho nhiều hơn một dòng, hay cho bất cứ thứ gì ngoài dòng đã tìm thấy/đã mở.
