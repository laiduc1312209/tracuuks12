# -*- coding: utf-8 -*-
"""Gop index.html + app.css + app.js + data.json + font self-host thanh 1 file HTML."""
import base64
import json
import os
import re
import sys

ROOT = r"C:\Users\laidu\OneDrive\Desktop\KS\web-src"
FONTS = os.path.join(os.path.dirname(ROOT), "tools", "fonts")
if not os.path.isdir(FONTS):   # du phong: ban font cu nam trong thu muc tam
    FONTS = r"C:\Users\laidu\AppData\Local\Temp\opencode\ks\fonts"
OUT = r"C:\Users\laidu\OneDrive\Desktop\KS\TRA-CUU-KQ-KS-LOP12.html"

FAM_TEN = {
    "Source Serif 4": "SourceSerif4",
    "Archivo": "Archivo",
}


def doc(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


# ---- font: doc gf.css de lay dung unicode-range, roi nhung base64 -------------
css_google = doc(os.path.join(FONTS, "gf.css"))
font_css = []
da_co = set()
for blk in re.findall(r"@font-face\s*\{(.*?)\}", css_google, re.S):
    fam = re.search(r"font-family:\s*'([^']+)'", blk).group(1)
    w = re.search(r"font-weight:\s*(\d+)", blk).group(1)
    ur = re.search(r"unicode-range:\s*([^;]+)", blk).group(1).strip()
    tag = "vn" if "1EA0" in ur else ("lat" if "U+0000-00FF" in ur else None)
    if tag is None or fam not in FAM_TEN:
        continue
    if (fam, tag) in da_co:
        continue
    da_co.add((fam, tag))
    ten_file = "%s-%s-%s.woff2" % (FAM_TEN[fam], w, tag)
    with open(os.path.join(FONTS, ten_file), "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    font_css.append(
        "@font-face{font-family:'%s';font-style:normal;font-weight:400 600;"
        "font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2');"
        "unicode-range:%s}" % (fam, b64, ur)
    )

css = doc(os.path.join(ROOT, "app.css")).replace("/*FONTS*/", "\n".join(font_css))
js = doc(os.path.join(ROOT, "app.js"))
data = doc(os.path.join(ROOT, "data.json")).replace("<", "\\u003c")
html = doc(os.path.join(ROOT, "index.html"))

for ph, val in (("/*__CSS__*/", css), ("/*__JS__*/", js), ("/*__DATA__*/", data)):
    if ph not in html:
        sys.exit("thieu placeholder " + ph)
    html = html.replace(ph, val)

if "/*__" in html:
    sys.exit("con placeholder chua thay")

with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write(html)

# ---- kiem tra tuong phan theo WCAG ------------------------------------------
def lum(hexmau):
    hexmau = hexmau.lstrip("#")
    c = [int(hexmau[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ty(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


PAPER = "#f2f0ea"
PAPER2 = "#e8e5dc"
cap = [
    ("chữ chính", "#17191b", PAPER, 4.5),
    ("chữ phụ", "#46443f", PAPER, 4.5),
    ("nhãn nhỏ", "#5d5b54", PAPER, 4.5),
    ("mực đỏ (dưới 5)", "#a93226", PAPER, 4.5),
    ("xanh bi (liên kết)", "#22407e", PAPER, 4.5),
    ("chữ trên dạ quang", "#17191b", "#e8d75f", 4.5),
    ("chữ trên nền phụ", "#17191b", PAPER2, 4.5),
    ("mực đỏ trên nền phụ", "#a93226", PAPER2, 4.5),
]
print("\n--- tương phản (cần >= 4.5) ---")
loi = 0
for ten, a, b, minn in cap:
    r = ty(a, b)
    ok = "OK " if r >= minn else "THẤP"
    if r < minn:
        loi += 1
    print("%s %-22s %5.2f:1  %s trên %s" % (ok, ten, r, a, b))

size = os.path.getsize(OUT)
print("\n--- kết quả ---")
print("file  : %s" % OUT)
print("kích thước: %.0f KB" % (size / 1024))
print("font  : %d @font-face nhúng" % len(font_css))
print("dữ liệu: %d học sinh" % len(json.loads(data.replace("\\u003c", "<"))["hs"]))
if loi:
    print("CẢNH BÁO: %d cặp màu chưa đạt tương phản" % loi)
    sys.exit(1)
print("tương phản: tất cả đạt")
