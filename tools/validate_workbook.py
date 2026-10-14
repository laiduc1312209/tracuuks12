"""Kiem cheo 5 file diem goc: SBD / ten / lop giua cac mon, va thong ke diem.

Dung: python tools/validate_workbook.py [dot]   (mac dinh dot = 1)
"""
import openpyxl, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # thu muc KS
from collections import Counter

# dot khao sat: mac dinh dotks/1, doi bang tham so dong lenh
DOT = sys.argv[1] if len(sys.argv) > 1 else "1"
D = os.path.join(ROOT, "dotks", DOT)
# bo qua ban tong hop (TONG-HOP-...xlsx) vi no khong phai file diem goc
files = sorted([n for n in os.listdir(D)
                if n.lower().endswith(".xlsx") and "tong" not in n.lower()])
print("nguon:", D)
SUBJ = {}
for n in files:
    low = n.lower()
    if "toan" in low: SUBJ[n] = ("Toán", 6, 6, 1, 8, 9)
    elif "ly" in low: SUBJ[n] = ("Lý", 6, 6, 1, 8, 9)
    elif "hoa" in low: SUBJ[n] = ("Hóa", 6, 6, 1, 8, 9)
    elif "anh" in low: SUBJ[n] = ("Anh", 6, 6, 1, 8, 9)
    else: SUBJ[n] = ("Văn", 4, 1, 2, 5, 4)

def is_sbd(v):
    s = str(v).strip()
    return s.isdigit() and len(s) >= 6

store = {}
for n in files:
    subj, hrow, c_sbd, c_name, c_diem, c_lop = SUBJ[n]
    wb = openpyxl.load_workbook(os.path.join(D, n), data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    recs = {}
    for r in rows[hrow:]:
        if r and is_sbd(r[c_sbd] if len(r) > c_sbd else None):
            sbd = str(r[c_sbd]).strip()
            recs[sbd] = r
    wb.close()
    store[n] = (subj, recs)
    print(f"{n}: {subj}, students={len(recs)}")

# cross check names/class by SBD
base_n = files[0]
allk = sorted(set().union(*[set(v[1]) for v in store.values()]))
print("\nall SBD:", len(allk), allk[0], allk[-1])
mismatch = 0
for k in allk:
    names, classes = set(), set()
    for n, (subj, recs) in store.items():
        if k in recs:
            r = recs[k]
            _, hrow, c_sbd, c_name, c_diem, c_lop = SUBJ[n]
            names.add(str(r[c_name]).strip())
            classes.add(str(r[c_lop]).strip())
    if len(names) > 1:
        print("  NAME MISMATCH", k, names); mismatch += 1
    if len(classes) > 1:
        print("  CLASS MISMATCH", k, classes); mismatch += 1
print("mismatches:", mismatch)

# score stats
for n, (subj, recs) in store.items():
    _, hrow, c_sbd, c_name, c_diem, c_lop = SUBJ[n]
    vals = []
    blank = 0
    for k, r in recs.items():
        v = r[c_diem]
        if v in (None, ""):
            blank += 1
        else:
            try: vals.append(float(str(v).replace(",", ".")))
            except: print("   odd score", subj, k, repr(v)); blank += 1
    vals.sort()
    avg = sum(vals) / len(vals)
    print(f"{subj}: n={len(vals)} blank={blank} min={vals[0]} max={vals[-1]} avg={avg:.2f} "
          f"median={vals[len(vals)//2]} >=5: {sum(1 for v in vals if v>=5)} ({100*sum(1 for v in vals if v>=5)/len(vals):.1f}%)")

# classes
cls = Counter()
for k in allk:
    for n, (subj, recs) in store.items():
        if k in recs:
            cls[str(recs[k][SUBJ[n][5]]).strip()] += 1
            break
print("\nclasses:", dict(sorted(cls.items())))

# kiem tra nhanh: so hoc sinh moi lop theo file diem goc dau tien (Toan)
# (truoc day doan nay dung bien `recs` bi che tu vong lap tren, nen lay nham cot Lop)
mon_base, recs_base = store[base_n]
cot_lop = SUBJ[base_n][5]
c2 = Counter()
for k, r in recs_base.items():
    if len(r) > cot_lop:
        c2[str(r[cot_lop]).strip()] += 1
print("\nstudents per subject by class (%s):" % mon_base)
print(dict(sorted(c2.items())))
