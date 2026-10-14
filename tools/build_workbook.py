# -*- coding: utf-8 -*-
"""Gop 4 file ket qua khao sat lop 12 thanh 1 workbook duy nhat."""
import os
import unicodedata
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter

SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # thư mục KS (cha của tools)
OUT = os.path.join(SRC, "TONG-HOP-KQ-KS-LOP12.xlsx")

# (tu khoa ten file, ten mon, chi so cot SBD/ten/ngay sinh/diem/lop, dong du lieu dau tien 1-based)
CONFIG = [
    ("toan", "Toán", (6, 1, 2, 8, 9), 6),
    ("ly",   "Lý",   (6, 1, 2, 8, 9), 6),
    ("hoa",  "Hóa",  (6, 1, 2, 8, 9), 6),
    ("anh",  "Anh",  (6, 1, 2, 8, 9), 6),
    ("van",  "Văn",  (1, 2, 3, 5, 4), 4),
]

THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
HDR_FILL = PatternFill("solid", fgColor="1F4E78")
HDR_FONT = Font(bold=True, color="FFFFFF", size=11)
TITLE_FONT = Font(bold=True, size=13, color="1F4E78")


def num(v):
    if v is None:
        return None
    s = str(v).strip().replace(",", ".")
    if s == "":
        return None
    try:
        return float(s)
    except ValueError:
        return None


def norm(s):
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower()


def find_file(key):
    for n in os.listdir(SRC):
        if n.lower().endswith((".xlsx", ".xls")) and key in norm(n) and not n.startswith("~$") \
           and "tong" not in norm(n):
            return n
    raise FileNotFoundError(key)


data = {}       # mon -> {sbd: {name, dob, cls, score}}
order = []      # thu tu hoc sinh theo SBD
meta = {}       # sbd -> (ten, ngay sinh, lop)

for key, mon, (c_sbd, c_name, c_dob, c_diem, c_cls), hrow in CONFIG:
    fname = find_file(key)
    wb = openpyxl.load_workbook(os.path.join(SRC, fname), data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    rec = {}
    for r in rows[hrow:]:                       # hrow = dong dau tien chua du lieu
        if len(r) <= max(c_sbd, c_name, c_dob, c_diem, c_cls):
            r = tuple(r) + (None,) * (max(c_sbd, c_name, c_dob, c_diem, c_cls) + 1 - len(r))
        sbd = r[c_sbd]
        if sbd is None or not str(sbd).strip().isdigit():
            continue
        sbd = str(sbd).strip()
        rec[sbd] = {
            "name": (str(r[c_name]).strip() if r[c_name] is not None else ""),
            "dob":  (str(r[c_dob]).strip() if r[c_dob] is not None else ""),
            "cls":  (str(r[c_cls]).strip() if r[c_cls] is not None else ""),
            "score": num(r[c_diem]),
        }
        if sbd not in meta:
            meta[sbd] = (rec[sbd]["name"], rec[sbd]["dob"], rec[sbd]["cls"])
            order.append(sbd)
    data[mon] = rec
    wb.close()
    print(f"{mon:>4}: {len(rec)} hoc sinh co SBD")

order.sort()
SUBJECTS = [mon for _, mon, _, _ in CONFIG]
HROW = {mon: h for _, mon, _, h in CONFIG}

wb_out = openpyxl.Workbook()

# ---------------------------------------------------------------- Sheet TongHop
ws = wb_out.active
ws.title = "TongHop"
headers = ["STT", "SBD", "Họ và tên", "Ngày sinh", "Lớp"] + SUBJECTS + ["Tổng điểm", "ĐTB", "Ghi chú"]

ws["A1"] = "TỔNG HỢP KẾT QUẢ KHẢO SÁT CHẤT LƯỢNG - KHỐI 12"
ws["A1"].font = TITLE_FONT
ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(headers))
ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 24

HDR_ROW = 2
for j, h in enumerate(headers, 1):
    c = ws.cell(row=HDR_ROW, column=j, value=h)
    c.font = HDR_FONT
    c.fill = HDR_FILL
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = BORDER
ws.row_dimensions[HDR_ROW].height = 28

r_i = HDR_ROW + 1
SC_START = 6                      # cot F = mon dau tien
SC_END = SC_START + len(SUBJECTS) - 1
C_TOTAL = SC_END + 1
C_DTB = C_TOTAL + 1
C_NOTE = C_DTB + 1

KT = "Không thi"          # không dự thi môn đó
VT = "Vắng thi"           # vắng cả năm môn: nhà trường không có điểm nào
vang_sbd = set()

for i, sbd in enumerate(order, 1):
    name, dob, cls = meta[sbd]
    scores = [data[s].get(sbd, {}).get("score") for s in SUBJECTS]
    present = [v for v in scores if v is not None]
    vang = not present                       # em không có điểm ở môn nào
    if vang:
        vang_sbd.add(sbd)
    nhan = VT if vang else KT
    if present:
        total = sum(present)
        dtb = round(total / len(present), 2)
    else:
        total = dtb = nhan
    miss = [s for s, v in zip(SUBJECTS, scores) if v is None]

    row = [i, sbd, name, dob, cls] + [v if v is not None else nhan for v in scores] + [total, dtb]
    if vang:
        row.append("Vắng thi: " + ", ".join(miss))
    elif miss:
        row.append("Không thi: " + ", ".join(miss))
    else:
        row.append("")
    for j, v in enumerate(row, 1):
        c = ws.cell(row=r_i, column=j, value=v)
        c.border = BORDER
        if j <= 5 or j >= SC_START:
            c.alignment = Alignment(horizontal="center", vertical="center")
        if SC_START <= j <= C_TOTAL:
            if isinstance(v, (int, float)):
                c.number_format = "0.00"
            else:
                c.font = Font(italic=True, color="808080")
        if j == C_DTB:
            if isinstance(v, (int, float)):
                c.number_format = "0.00"
                c.font = Font(bold=True)
            else:
                c.font = Font(italic=True, color="808080", bold=True)
    r_i += 1
last_row = r_i - 1

ws.freeze_panes = "A3"
ws.auto_filter.ref = f"A{HDR_ROW}:{get_column_letter(len(headers))}{last_row}"
widths = [5, 11, 26, 12, 7] + [10] * len(SUBJECTS) + [11, 8, 34]
for j, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(j)].width = w

# to do diem duoi trung binh (<5)
ws.conditional_formatting.add(
    f"{get_column_letter(SC_START)}{HDR_ROW+1}:{get_column_letter(SC_END)}{last_row}",
    CellIsRule(operator="lessThan", formula=["5"], font=Font(color="C00000", bold=True),
               fill=PatternFill("solid", fgColor="FFE1E1")),
)

# ------------------------------------------------- Sheet chi tiet tung mon (giu nguyen goc)
for key, mon, (c_sbd, c_name, c_dob, c_diem, c_cls), hrow in CONFIG:
    fname = find_file(key)
    src = openpyxl.load_workbook(os.path.join(SRC, fname), data_only=True)
    s = src.worksheets[0]
    t = wb_out.create_sheet(mon)
    for row in s.iter_rows():
        for cell in row:
            if cell.value is not None:
                t.cell(row=cell.row, column=cell.column, value=cell.value)
    for col, dim in s.column_dimensions.items():
        if dim.width:
            t.column_dimensions[col].width = dim.width
    for mr in s.merged_cells.ranges:
        try:
            t.merge_cells(str(mr))
        except Exception:
            pass
    t.freeze_panes = t.cell(row=hrow + 1, column=1)

    # o diem trong -> "Khong thi"
    sc, sb = c_diem + 1, c_sbd + 1
    for r in range(hrow, t.max_row + 1):
        v = t.cell(row=r, column=sb).value
        if v is None or not str(v).strip().isdigit():
            continue
        cur = t.cell(row=r, column=sc)
        if cur.value is None or str(cur.value).strip() == "":
            # em vắng cả năm môn thì ghi Vắng thi, còn lại Không thi
            cur.value = VT if str(v).strip() in vang_sbd else KT
            cur.font = Font(italic=True, color="808080")
            cur.alignment = Alignment(horizontal="center")
    src.close()
    print(f"  -> sheet '{mon}' da tao")

wb_out.save(OUT)
print("\nDa luu:", OUT)
print("Tong so hoc sinh:", len(order))
