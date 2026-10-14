# Finish review — TRA-CUU-KQ-KS-LOP12.html

Substitution disclosure: this harness ships no subagent capability, so the finish-reviewer role ran
inline per `reference/degraded/finish-reviewer.md` (`reference/degraded/finish-reviewer.md` line 2),
stepped out of the build thread, and reports the substitution here in one line.
Missing inputs: no QUALITY BAR board images exist in this skill install, and no critique-reference
comp was passed (code-led build), so the ceiling check runs against the world's described native
devices; and this session cannot open images, so every claim below rests on programmatic
measurement of the same PNGs (dimensions, occupancy, colour signatures, element counts, computed
styles) rather than on a visual read — the one limitation the reviewer role exists to avoid.

---

## Review round

`disposition: fix`

### persistence

Pass. `PRODUCT.md` exists and carries the strategic truth for this surface. Code-led build: no
comp round, so `.impeccable/build/state.json` is not owed and `.impeccable/mocks/` does not exist —
no comps exist that could lack an approval record. `DESIGN.md` is written after this review by the
documenter, so its absence here is not a finding; the brief's FINISH line requires it, and it was
produced with this review. Direction contract `.impeccable/surfaces/tra-cuu-kq-ks-lop12-html.md`
carries FORM seed key `3c16bfc4`, corroborating the recorded roll.

### fidelity

No approved comp: TYPE, MATERIAL, and GROUND are judged against the contract's OWN-WORLD, element
by element from the build itself.

| # | Salient element | State | Evidence |
|---|---|---|---|
| 1 | 176px left rail, three nav keys, printed detent marks, filled when selected | match | `.rail` 176px; three tabs; `.detent` hairline at rest, `background: var(--ink)` when `aria-selected` |
| 2 | One-line masthead, search the widest thing on the right | match | masthead grid; measured 1440: the form is the widest masthead item |
| 3 | Band of class chips + sort keys, pinned while the table scrolls | match | `bandPosition: sticky`; band pinned at `0` with the table head at `102` (gap `0`) at scrollY 600/3000/12000; mobile band 116.6px |
| 4 | Memorable moment: the found row wrapped in 1px brackets | **was missing → match** | the `br` renderer existed and nothing used it; the found row carried only the marker. Now `data-r="br"`: `hitsSvg=1`, `hitsSvgKids=4`, `hitsLines=4` |
| 5 | Slip: five subject rows, printed scale with the 5,0 tick, red under 5, absent slots hatched, totals ruled | match | red computed `rgb(169, 50, 38)`; scale tick drawn at 50%; hatch diagonals per case (5, 2); slip line counts 14, 11 |
| 6 | The bản kê itself: 508 narrow-column rows, one 1px rule each, tabular numerals, red numerals under 5, uppercase `không thi` | match | `rows 508`; `rulerMarks 513`; 865 red px in the raster; `font-variant-numeric: tabular-nums` |
| 7 | Statistics: five half-point histograms with the red 5,0 threshold, participation bars, per-class average table | match | `charts 5`, `chartRects 73`, `partRects 5`, `avgRows 12`, `partFill rgb(34, 64, 126)`, red 935 px, blue 32 461 px |
| 8 | Wide right margin apparatus: live scope count, definition list, legend | adaptation | the block is the floor's hero-metric *shape*; the contract's FIRST VIEWPORT itself assigns "số đếm đang xem" to the wide right margin, and the block carries a definition list and the legend, not a lone figure |
| 9 | Marker reserved for the found row | adaptation | OWN-WORLD says "dạ quang chỉ cho dòng tìm thấy"; the build also marks the table row whose slip was last opened. Legend wording corrected to name that usage |
| 10 | OWN-WORLD state token "gạch chéo khi vắng" | adaptation (partial) | the slip's measurement slot now carries a real diagonal and the legend shows it; the table's absent cells keep words + strike, because a diagonal over 11px uppercase in a 46px column fights the glyphs. Stated, not hidden |
| 11 | FIRST VIEWPORT: "rồi những dòng đầu của bảng kê" | adaptation | the default view is the lookup, not the table's first rows — the contract's own job statement ranks the parent's phone lookup first, and the table shares the band one detent away. The memory test still passes: masthead, search, band, margin count read as one working sheet |
| 12 | TYPE: document voice + apparatus voice | match | Source Serif 4 (400–600) and Archivo self-hosted as base64, both verified loaded in the built file; no system face reaches the page |
| 13 | MATERIAL: flat ink on paper | match | no faked physicality (no bevels, embossing, texture gradients); the rules are real vector hairlines at device-pixel precision (`stroke-width 0.5` @dpr 2, `1` @dpr 1) |
| 14 | GROUND: paper per OWN-WORLD | match | sampled from pixels: the named ground is the majority colour at 84–92% occupancy, exact token match, no drift toward warm cream |
| 15 | Per-class average table | added (sanctioned) | the request names per-class statistics; not an unapproved addition |
| 16 | FORM seed key | match | `3c16bfc4` present in the contract's FORM block |

### ceiling

Not reached as built. Unused native devices: the world's own motion — a plotter drawing the form's
rules — was absent (the only authored moment was opacity+transform); and the double rule that marks
a total, the most load-bearing print device for a page whose STORY is "the teacher trusts the
numbers", was unused. Both applied below; what stays out on purpose is a sheet-level ruled frame,
because a border around the whole shell fights the pinned band on small screens.

### material_fixes

1. Memorable moment unkept — the found row was highlighted but never bracketed, and the engine's bracket renderer was dead code (contract: memorable moment + FORM).
2. Ruling engine defect — any host that replaces its own `innerHTML` kept a stale `__svg` pointing at a detached node, so the results list's rules were drawn into nothing (`hitsSvg 0`); the engine now re-attaches when `parentNode !== host` (contract: THESIS "mọi đường kẻ do một engine vẽ").
3. Dead affordance — clicking a table row painted a marker with no outcome, and no keyboard path existed; rows now open that student's slip, with the name cell as a real button (floor: working controls, keyboard focus).
4. Authored moment replayed on every keystroke — the slip entrance was gated on re-render instead of on identity (floor: one authored moment).
5. OWN-WORLD state token incomplete — "gạch chéo khi vắng" had no diagonal anywhere (contract: OWN-WORLD).
6. Legend wording did not match usage — it read "dòng đang chọn" for a marker that now means "the row whose slip you opened" (floor: copy names what it is).
7. Ceiling device unused — no total rule (contract: STORY, "tin vào con số").

### keep

The 1px ruling engine as the page's only ornament language, the flat paper-and-toner ground with
the red/blue/marker trio, and the parent-facing slip that must never let "không thi" read as 0.

---

## Verdict pass

Recaptures read at the same paths (`desktop.png`, `mobile.png`, plus the five named captures),
regenerated after the fix batch; the build file is the same one those captures render.

### verdict

1. Bracket on the found row — **resolved**: `hitsLines 4`, `hitsSvgKids 4`, marker still on the row (46 358 px in the raster).
2. Engine detached-SVG defect — **resolved**: the results list's SVG exists again (`hitsSvg 1`) and the danh sách still draws `513` marks with no console error in any of the eight measured cases.
3. Table row outcome + keyboard path — **resolved**: 508 focusable name buttons; activating one switches to Tra cứu, opens that student's slip, announces it, and coming back leaves exactly that row marked (`on 1`, `sbd 12000013`).
4. Animation replay — **resolved**: re-typing the student already on screen gives `moi 0`; changing student gives `moi 1`. The drawn-rules moment (clip-path wipe) rides the same gate, and `prefers-reduced-motion` still removes all motion.
5. Hatch token — **resolved**: 5 diagonals for a student absent in all five subjects, 2 for the spot-checked student, and the legend swatch shows the same stroke.
6. Legend wording — **resolved**: "dòng đã mở phiếu" matches what the marker does.
7. Total rule — **resolved**: two hairlines under the totals block (ink over rule-2); slip line counts rose 12→14 and 9→11 accordingly, with no collision against the footnote 18px below.

Regressions named, judged by the same matrix rules: the bracket extends 3px past the row box, so in
a multi-result search its hairlines sit near the neighbouring rows' rules — no measured collision
and none in the single-result lookup that parents actually run; and the found row swaps its own
bottom hairline for the bracket's, shifting that one separation by 3px. Neither changes a matrix row.

### remaining

clear

`disposition: ship` (covers the seven scored fixes above, not a fresh review of the whole surface)

## Ghi chú sau rà soát — tách nhãn vắng mặt

Sau vòng chốt, nhãn vắng mặt được tách làm hai cho rõ nghĩa (yêu cầu của trường):
`Không thi` = em không dự một môn nào đó; `Vắng thi` = em vắng cả năm môn (12 em, không có ĐTB để xếp thứ tự).

Sửa ở: `tools/build_workbook.py` (Excel: năm ô điểm, cột Tổng/ĐTB, cột Ghi chú, và từng sheet môn),
`web-src/app.js` (phiếu, bảng kê, danh sách kết quả, phần định nghĩa ở cột hộp),
`web-src/index.html` (dòng mô tả đầu trang, định nghĩa ĐTB, chú giải thêm mục thứ tư).

Đo lại sau thay đổi: bảng kê vẫn **508 dòng** với đúng **60 ô `vắng thi`** và **725 ô `không thi`**;
phiếu của em vắng cả năm có **5 ô vắng** cộng một dòng nhắc; phiếu em vắng 2 môn vẫn **2 ô `không thi`**;
số liệu (ĐTB, tổng điểm, thống kê theo môn/lớp) **không đổi một con số nào**.
- 8 ảnh chụp trong thư mục này đã được chụp lại từ bản dựng mới, vẫn giữ nguyên đường dẫn cũ (desktop.png, mobile.png và các ảnh theo khu vực).
