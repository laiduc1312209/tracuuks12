'use strict';
/* Bảng kê kết quả khảo sát chất lượng khối 12 — tra cứu, bảng, thống kê,
   và engine kẻ vẽ mọi đường kẻ cấu trúc đúng một device pixel. */
(function () {

/* ---------------------------------------------------------------- dữ liệu -- */
var DATA = JSON.parse(document.getElementById('kqdata').textContent);
var MON = DATA.mon;
var LOP = DATA.lop;
var TONG_HS = DATA.hs.length;

function boDau(s) {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
}

var HS = DATA.hs.map(function (s) {
  var co = s.d.filter(function (v) { return v !== null; });
  var tong = co.length ? co.reduce(function (a, b) { return a + b; }, 0) : null;
  return {
    sbd: s.sbd, ten: s.ten, ns: s.ns, lop: s.lop, d: s.d,
    duthi: co.length, tong: tong,
    dtb: co.length ? tong / co.length : null,
    k: boDau(s.ten)
  };
});

/* xếp thứ tự theo ĐTB; đồng điểm thì đồng hạng */
function xepHang(list, prop) {
  var s = list.slice().sort(function (a, b) {
    return b.dtb - a.dtb || (a.sbd < b.sbd ? -1 : 1);
  });
  var hang = 0, truoc = null;
  s.forEach(function (h, i) {
    if (truoc === null || h.dtb !== truoc) { hang = i + 1; truoc = h.dtb; }
    h[prop] = hang;
  });
  return s.length;
}
var CO_DTB = HS.filter(function (s) { return s.dtb !== null; });
var SO_CO_DTB = xepHang(CO_DTB, 'hang');
var LOP_DEM = {};
LOP.forEach(function (l) {
  var inLop = HS.filter(function (s) { return s.lop === l; });
  LOP_DEM[l] = { n: inLop.length, coDiem: xepHang(inLop.filter(function (s) { return s.dtb !== null; }), 'hangLop') };
});
/* học sinh không có điểm ở môn nào không có hangLop */
HS.forEach(function (s) { if (s.hangLop === undefined) s.hangLop = null; });

/* ------------------------------------------------------------ thống kê ----- */
function thongKeMotMon(list, m) {
  var v = list.map(function (s) { return s.d[m]; })
    .filter(function (x) { return x !== null; })
    .sort(function (a, b) { return a - b; });
  if (!v.length) return { n: 0, bins: null, dinh: 0 };
  var bins = new Array(20).fill(0);
  v.forEach(function (x) { bins[Math.min(19, Math.floor(x / 0.5))] += 1; });
  var sum = v.reduce(function (a, b) { return a + b; }, 0);
  return {
    n: v.length, sum: sum, mean: sum / v.length,
    med: v[Math.floor(v.length / 2)], min: v[0], max: v[v.length - 1],
    ge5: v.filter(function (x) { return x >= 5; }).length,
    bins: bins, dinh: Math.max.apply(null, bins)
  };
}

function thongKe(list) {
  var mon = MON.map(function (_, i) { return thongKeMotMon(list, i); });
  var dtbs = list.map(function (s) { return s.dtb; }).filter(function (x) { return x !== null; });
  var lop = LOP.map(function (l) {
    var inLop = list.filter(function (s) { return s.lop === l; });
    var d = inLop.map(function (s) { return s.dtb; }).filter(function (x) { return x !== null; });
    return {
      lop: l, n: inLop.length,
      tb: MON.map(function (_, i) { return thongKeMotMon(inLop, i).mean || null; }),
      tbDTB: d.length ? d.reduce(function (a, b) { return a + b; }, 0) / d.length : null
    };
  }).filter(function (x) { return x.n > 0; });
  return {
    n: list.length, mon: mon, lop: lop,
    tbDTB: dtbs.length ? dtbs.reduce(function (a, b) { return a + b; }, 0) / dtbs.length : null,
    khongThiCa: list.filter(function (s) { return s.duthi === 0; }).length,
    du5Mon: list.filter(function (s) { return s.duthi === 5; }).length
  };
}

var TK_TOAN = thongKe(HS);
var LOP_TB = {};
LOP.forEach(function (l) {
  var d = HS.filter(function (s) { return s.lop === l; })
    .map(function (s) { return s.dtb; })
    .filter(function (x) { return x !== null; });
  LOP_TB[l] = d.length ? d.reduce(function (a, b) { return a + b; }, 0) / d.length : null;
});

/* --------------------------------------------------------------- engine ---- */
var NS = 'http://www.w3.org/2000/svg';
function dpr() { return Math.min(window.devicePixelRatio || 1, 3); }
function hair() { return 1 / dpr(); }
function snap(v) { return (Math.round(v * dpr()) + 0.5) / dpr(); }
function snapFloor(v) { return Math.round(v * dpr()) / dpr(); }

function mkEl(tag, attrs) {
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function duong(svg, x1, y1, x2, y2, mau) {
  var l = mkEl('line', {
    x1: x1, y1: y1, x2: x2, y2: y2,
    'stroke-width': hair(), 'shape-rendering': 'geometricPrecision'
  });
  l.style.stroke = mau || 'var(--duong-ke)';
  svg.appendChild(l);
}
function chu(svg, x, y, noiDung, neo, mau, co, font) {
  var t = mkEl('text', {
    x: x, y: y, 'text-anchor': neo || 'start',
    'font-size': co || 10.5,
    'font-family': font === 'ui' ? 'var(--ui)' : 'var(--serif)'
  });
  t.style.fill = mau || 'var(--muc-toner-3)';
  t.textContent = noiDung;
  svg.appendChild(t);
}
function hcn(svg, x, y, w, h, mau) {
  if (h <= 0 || w <= 0) return;
  var r = mkEl('rect', {
    x: snapFloor(x), y: snapFloor(y),
    width: Math.max(hair(), snapFloor(w)), height: Math.max(hair(), snapFloor(h))
  });
  r.style.fill = mau;
  svg.appendChild(r);
}

var RENDER = {
  /* đường kẻ cấu trúc: host tự vẽ viền của nó và mọi [data-r] bên trong */
  rules: function (svg, host, g) {
    var ung = [host].concat(Array.prototype.slice.call(host.querySelectorAll('[data-r]')))
      .filter(function (el) {
        if (el.closest('.ruled') !== host) return false;
        return /\b(t|b|br|x|db)\b/.test(el.getAttribute('data-r') || '');
      });
    ung.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.height && !r.width) return;
      var top = r.top - g.box.top, bot = r.bottom - g.box.top;
      var left = r.left - g.box.left, right = r.right - g.box.left;
      var k = ' ' + el.getAttribute('data-r') + ' ';
      if (k.indexOf(' t ') > -1) duong(svg, snapFloor(left), snap(top), snapFloor(right), snap(top));
      if (k.indexOf(' b ') > -1) duong(svg, snapFloor(left), snap(bot), snapFloor(right), snap(bot));
      if (k.indexOf(' br ') > -1) {
        duong(svg, snap(left), snap(top - 3), snap(left), snap(bot + 3), 'var(--muc-toner)');
        duong(svg, snap(right), snap(top - 3), snap(right), snap(bot + 3), 'var(--muc-toner)');
        duong(svg, snap(left), snap(top - 3), snap(right), snap(top - 3), 'var(--muc-toner)');
        duong(svg, snap(left), snap(bot + 3), snap(right), snap(bot + 3), 'var(--muc-toner)');
      }
      if (k.indexOf(' x ') > -1) duong(svg, snapFloor(left), snap(bot), snapFloor(right), snap(top), 'var(--muc-toner-3)');
      /* đường đôi dưới dòng tổng: quy ước in để mắt biết đây là số cộng lại */
      if (k.indexOf(' db ') > -1) {
        duong(svg, snapFloor(left), snap(bot + 3), snapFloor(right), snap(bot + 3), 'var(--muc-toner)');
        duong(svg, snapFloor(left), snap(bot + 6), snapFloor(right), snap(bot + 6), 'var(--duong-ke-2)');
      }
    });
  },

  /* phổ điểm một môn: cột rộng nửa điểm, vạch đỏ ở ngưỡng 5 */
  chart: function (svg, host, g) {
    var bins = JSON.parse(host.getAttribute('data-bins') || '[]');
    var dinh = +(host.getAttribute('data-dinh') || 0);
    if (!bins.length) return;
    var padB = 17, padT = 16;
    var h = Math.max(10, g.h - padB - padT);
    var bw = g.w / bins.length;
    var y0 = g.h - padB;
    duong(svg, snap(0), snap(y0), snapFloor(g.w), snap(y0), 'var(--duong-ke-2)');
    duong(svg, snap(0), snap(padT - 7), snap(0), snap(y0 + 2), 'var(--duong-ke-2)');
    bins.forEach(function (c, i) {
      if (!c || !dinh) return;
      hcn(svg, i * bw + hair(), y0 - (c / dinh) * h, Math.max(hair(), bw - hair() * 2), (c / dinh) * h, 'var(--muc-toner)');
    });
    var xm = 0.5 * g.w;
    duong(svg, snap(xm), snap(padT - 7), snap(xm), snap(y0 + 2), 'var(--son-do)');
    chu(svg, snapFloor(xm), g.h - 4, '5', 'middle', 'var(--son-do)', 10.5, 'ui');
    chu(svg, 0, g.h - 4, '0', 'start', 'var(--muc-toner-3)', 10.5, 'ui');
    chu(svg, snapFloor(g.w), g.h - 4, '10', 'end', 'var(--muc-toner-3)', 10.5, 'ui');
    if (dinh) {
      var iMax = bins.indexOf(dinh);
      chu(svg, Math.min(g.w - 1, Math.max(8, (iMax + 0.5) * bw)), padT - 5, String(dinh), 'middle', 'var(--muc-toner)', 10.5, 'ui');
    }
  },

  /* số học sinh dự thi mỗi môn: thanh ngang, thước chia mỗi 100 */
  parts: function (svg, host, g) {
    var vals = JSON.parse(host.getAttribute('data-vals') || '[]');
    var labels = JSON.parse(host.getAttribute('data-labels') || '[]');
    var tong = +(host.getAttribute('data-tong') || TONG_HS) || TONG_HS;
    var labW = 44, numW = 70, padT = 26;
    var rowH = (g.h - padT) / (vals.length || 1);
    var wBar = Math.max(20, g.w - labW - numW);
    duong(svg, snap(labW), snap(padT - 9), snapFloor(labW + wBar), snap(padT - 9), 'var(--duong-ke-2)');
    for (var t = 0; t <= tong; t += 100) {
      var x = labW + (t / tong) * wBar;
      duong(svg, snap(x), snap(padT - 14), snap(x), snap(padT - 9), 'var(--duong-ke-2)');
      chu(svg, snap(x), padT - 18, String(t), 'middle', 'var(--muc-toner-3)', 9.5, 'ui');
    }
    vals.forEach(function (v, i) {
      var y = padT + i * rowH;
      var bh = Math.min(11, Math.max(6, rowH - 9));
      chu(svg, labW - 9, y + rowH / 2 + 4, labels[i], 'end', 'var(--muc-toner)', 12.5, 'ui');
      hcn(svg, labW, y + (rowH - bh) / 2, (v / tong) * wBar, bh, 'var(--xanh-bi)');
      chu(svg, labW + (v / tong) * wBar + 9, y + rowH / 2 + 4, v + '/' + tong, 'start', 'var(--muc-toner)', 12.5, 'ui');
      if (i) duong(svg, snapFloor(labW), snap(y), snapFloor(labW + wBar), snap(y));
    });
  }
};

function giai(host) {
  var svg = host.__svg;
  /* khung nào tự thay innerHTML thì lớp thước kẻ cũ bị gỡ khỏi DOM — phải gắn lại,
     nếu không mọi đường kẻ sẽ được vẽ vào một node đã rời khỏi trang */
  if (!svg || svg.parentNode !== host) {
    svg = mkEl('svg', { 'class': 'ruler', 'aria-hidden': 'true' });
    host.insertBefore(svg, host.firstChild);
    host.__svg = svg;
  }
  var box = host.getBoundingClientRect();
  var w = Math.round(host.clientWidth);
  var h = Math.round(host.scrollHeight);
  if (!w || !h) { svg.setAttribute('viewBox', '0 0 0 0'); return; }
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  (RENDER[host.getAttribute('data-render') || 'rules'] || RENDER.rules)(svg, host, { w: w, h: h, box: box });
}

var choKe = null;
function keLai() {
  if (choKe) return;
  choKe = requestAnimationFrame(function () {
    choKe = null;
    var band = document.getElementById('band');
    if (band) document.documentElement.style.setProperty('--bandH', band.offsetHeight + 'px');
    Array.prototype.forEach.call(document.querySelectorAll('.ruled'), function (h) {
      if (h.closest('[hidden]')) return;
      /* một khung lỗi không được làm mất đường kẻ của mọi khung còn lại */
      try { giai(h); } catch (e) {
        if (window.console && console.error) console.error('ruler:', h.className, e);
      }
    });
  });
}
window.addEventListener('resize', keLai);
window.addEventListener('orientationchange', keLai);
window.addEventListener('load', keLai);
if (window.ResizeObserver) new ResizeObserver(keLai).observe(document.body);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(keLai);

/* ---------------------------------------------------------------- trạng thái */
var state = { view: 'tracuu', q: '', lop: 'all', sort: { k: 'sbd', dir: 1 }, chon: null };

var KEYS = [
  { k: 'sbd', nhan: 'Số BD', dir: 1 },
  { k: 'ten', nhan: 'Họ và tên', dir: 1 },
  { k: 'lop', nhan: 'Lớp', dir: 1 }
].concat(MON.map(function (m, i) { return { k: 'd' + i, nhan: m, dir: -1 }; }))
  .concat([{ k: 'tong', nhan: 'Tổng', dir: -1 }, { k: 'dtb', nhan: 'ĐTB', dir: -1 }]);

function loc(ds) {
  var q = boDau(state.q).trim();
  if (!q) return ds.filter(function (s) { return state.lop === 'all' || s.lop === state.lop; });
  var toks = q.split(/\s+/);
  return ds.filter(function (s) {
    if (state.lop !== 'all' && s.lop !== state.lop) return false;
    for (var i = 0; i < toks.length; i++) {
      if (s.k.indexOf(toks[i]) === -1 && s.sbd.indexOf(toks[i]) === -1) return false;
    }
    return true;
  });
}

function sapXep(ds) {
  var k = state.sort.k, dir = state.sort.dir;
  function lay(s) { return k.charAt(0) === 'd' && k.length === 2 ? s.d[+k.slice(1)] : s[k]; }
  return ds.slice().sort(function (a, b) {
    var va = lay(a), vb = lay(b);
    var na = va === null || va === undefined, nb = vb === null || vb === undefined;
    if (na && nb) return a.sbd < b.sbd ? -1 : 1;
    if (na) return 1;
    if (nb) return -1;
    var r = (typeof va === 'string') ? va.localeCompare(vb, 'vi') : va - vb;
    return r ? r * dir : (a.sbd < b.sbd ? -1 : 1);
  });
}
function hienThi() { return sapXep(loc(HS)); }

/* --------------------------------------------------------------- tiện ích --- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function so(v) { return v === null || v === undefined ? '—' : v.toFixed(2); }
function lopDiem(v) { return v === null ? 'none' : (v < 5 ? 'low' : ''); }
/* em vắng cả năm môn — khác với không thi ở một môn: em này không có điểm nào cả */
function vangCa(s) { return s.duthi === 0; }
function nhanVang(s) { return vangCa(s) ? 'vắng thi' : 'không thi'; }
var $ = function (id) { return document.getElementById(id); };
function bao(tin) { $('live').textContent = tin; }

/* ------------------------------------------------------------------- band --- */
function veBand(list) {
  var pham = state.lop === 'all' ? 'tất cả các lớp' : 'lớp ' + state.lop;
  var key = KEYS.filter(function (x) { return x.k === state.sort.k; })[0];
  $('scopeline').innerHTML = 'Đang xem <span class="num">' + list.length + '</span>/<span class="num">' + TONG_HS +
    '</span> học sinh · ' + esc(pham) + ' · sắp theo ' + esc(key.nhan) +
    (state.sort.dir === 1 ? ' tăng' : ' giảm');

  var wrap = $('classes');
  if (!wrap.__ve) {
    var html = '<button type="button" class="chip" data-lop="all">Tất cả</button>';
    LOP.forEach(function (l) {
      html += '<button type="button" class="chip" data-lop="' + l + '">' + l + '</button>';
    });
    wrap.innerHTML = html;
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      state.lop = b.getAttribute('data-lop');
      state.chon = null;
      capNhat();
    });
    wrap.__ve = true;
  }
  Array.prototype.forEach.call(wrap.children, function (c) {
    c.setAttribute('aria-pressed', String(c.getAttribute('data-lop') === state.lop));
  });

  var kw = $('keys');
  kw.innerHTML = '';
  KEYS.forEach(function (x) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'key';
    b.setAttribute('data-k', x.k);
    b.setAttribute('aria-pressed', String(state.sort.k === x.k));
    if (state.sort.k === x.k) b.setAttribute('aria-label', 'Sắp theo ' + x.nhan + (state.sort.dir === 1 ? ' tăng dần' : ' giảm dần'));
    b.innerHTML = '<span class="detent" aria-hidden="true"></span>' + esc(x.nhan) +
      (state.sort.k === x.k
        ? '<span class="dir" aria-hidden="true"><svg width="7" height="9" viewBox="0 0 7 9"><path d="' +
          (state.sort.dir === 1 ? 'M3.5 0L7 7H0z' : 'M3.5 9L0 2h7z') + '" fill="currentColor"/></svg></span>'
        : '');
    kw.appendChild(b);
  });
  kw.onclick = function (e) {
    var b = e.target.closest('.key');
    if (!b) return;
    sapTheo(b.getAttribute('data-k'));
  };

  var ths = $('kq').querySelectorAll('thead th');
  Array.prototype.forEach.call(ths, function (th, i) {
    th.removeAttribute('aria-sort');
    if (i >= 1 && KEYS[i - 1].k === state.sort.k) {
      th.setAttribute('aria-sort', state.sort.dir === 1 ? 'ascending' : 'descending');
    }
  });
}

function sapTheo(k) {
  var mac = KEYS.filter(function (x) { return x.k === k; })[0].dir;
  if (state.sort.k === k) state.sort.dir = -state.sort.dir;
  else state.sort = { k: k, dir: mac };
  capNhat();
}

/* --------------------------------------------------------------- tra cứu --- */
var GOI_Y = ['12000013', '12000002', '12000300'];

function veHits(list) {
  var host = $('hits');
  if (!state.q) {
    if (state.chon) {
      var dangMo = HS.filter(function (s) { return s.sbd === state.chon; })[0];
      host.innerHTML = '<p class="lb" style="padding:var(--s3) 0">Đang mở phiếu của ' +
        esc(dangMo.ten) + ' — gõ vào ô tra cứu để tìm em khác</p>';
      host.onclick = null;
      return;
    }
    host.innerHTML = '<div class="empty"><h3>Nhập số báo danh hoặc họ tên để xem kết quả</h3>' +
      '<p>Số báo danh của kỳ này chạy từ <span class="num">12000001</span> đến <span class="num">12000508</span>. ' +
      'Gõ không cần dấu cũng được, ví dụ <em>nguyen bao anh</em>.</p><ul>' +
      GOI_Y.map(function (s) {
        return '<li><button type="button" class="chip" data-goiy="' + s + '">Thử ' + s + '</button></li>';
      }).join('') + '</ul></div>';
    ganGoiY(host);
    return;
  }
  if (!list.length) {
    host.innerHTML = '<div class="empty"><h3>Không tìm thấy học sinh nào khớp</h3>' +
      '<p>Thử số báo danh đầy đủ 9 số, hoặc chỉ một phần họ tên. Số báo danh của kỳ này chạy từ ' +
      '<span class="num">12000001</span> đến <span class="num">12000508</span>.</p><ul>' +
      GOI_Y.map(function (s) {
        return '<li><button type="button" class="chip" data-goiy="' + s + '">Thử ' + s + '</button></li>';
      }).join('') + '</ul></div>';
    ganGoiY(host);
    return;
  }
  var toiDa = 60;
  var show = list.slice(0, toiDa);
  host.innerHTML = show.map(function (s) {
    var chon = state.chon === s.sbd;
    /* dòng tìm thấy được ngoặc 1px bao quanh (mô-típ chốt của hướng này) */
    return '<button type="button" class="hit" data-r="' + (chon ? 'br' : 'b') + '" data-sbd="' + s.sbd + '"' +
      (chon ? ' aria-current="true"' : '') + '>' +
      '<span class="ten">' + esc(s.ten) + '</span>' +
      '<span class="meta2"><span class="sbd num">' + s.sbd + '</span><span class="lop">' + s.lop + '</span></span>' +
      '<span class="dtb num">' + (s.dtb === null ? nhanVang(s) : s.dtb.toFixed(2)) + '</span></button>';
  }).join('') +
    (list.length > toiDa
      ? '<p class="lb" style="padding-top:14px">Còn ' + (list.length - toiDa) + ' học sinh khớp — gõ thêm để thu hẹp</p>'
      : '');
  host.onclick = function (e) {
    var b = e.target.closest('.hit');
    if (!b) return;
    state.chon = b.getAttribute('data-sbd');
    capNhat();
  };
}

function ganGoiY(host) {
  Array.prototype.forEach.call(host.querySelectorAll('[data-goiy]'), function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-goiy');
      $('q').value = v;
      $('search').classList.add('has-q');
      state.q = v;
      state.chon = null;
      capNhat();
    });
  });
}

function veSlip(s) {
  var host = $('slip');
  if (!s) { host.innerHTML = ''; host.__sbd = null; return; }
  /* chỉ chạy mô-típ nhập phiếu khi đổi sang học sinh khác, không chạy lại mỗi
     lần gõ phím hay đổi bộ lọc */
  var moi = host.__sbd !== s.sbd;
  host.__sbd = s.sbd;
  var rows = MON.map(function (m, i) {
    var v = s.d[i], lop = lopDiem(v);
    return '<div class="srow" data-r="b">' +
      '<span class="lb lb-ink">' + esc(m) + '</span>' +
      (v === null ? '<span class="hatch" data-r="x"></span>' :
        '<span class="meter"><i class="' + lop + '" style="width:' + (v / 10 * 100).toFixed(2) + '%"></i><b></b></span>') +
      '<span class="score ' + lop + (v === null ? ' struck' : '') + '">' +
      (v === null ? nhanVang(s) : v.toFixed(2)) + '</span></div>';
  }).join('');
  var thieu = MON.filter(function (m, i) { return s.d[i] === null; });
  var lopHS = LOP_DEM[s.lop];

  host.innerHTML = '<div class="slip ruled' + (moi ? ' moi' : '') + '" data-r="t" data-render="rules">' +
    '<div class="ident"><span class="name">' + esc(s.ten) + '</span>' +
    '<span class="lb">SBD <span class="num">' + s.sbd + '</span></span>' +
    '<span class="lb">Lớp ' + esc(s.lop) + '</span>' +
    '<span class="lb">Ngày sinh ' + esc(s.ns) + '</span></div>' +
    '<div class="subjects">' + rows + '</div>' +
    '<div class="totals ruled" data-r="t db" data-render="rules">' +
    '<div><span class="lb">Tổng điểm</span><span class="v num">' + so(s.tong) + '</span></div>' +
    '<div><span class="lb">ĐTB</span><span class="v num ' + lopDiem(s.dtb) + '">' + so(s.dtb) + '</span></div>' +
    '<div><span class="lb">Số môn dự thi</span><span class="v num">' + s.duthi + '/5</span></div>' +
    '<div><span class="lb">Không thi</span><span class="v">' + (thieu.length ? esc(thieu.join(', ')) : '—') + '</span></div>' +
    '</div>' +
    (vangCa(s) ? '<p class="lb" style="margin-top:18px">Em vắng cả năm môn thi, nên không có ĐTB và không xếp thứ tự.</p>' : '') +
    '<p class="lb" style="margin-top:18px">Vạch nhỏ trong ô điểm là mốc 5,0 · ĐTB tính trên những môn em này thực sự dự thi' +
    (s.hangLop !== null ? ' · xếp thứ <span class="num">' + s.hangLop + '/' + lopHS.coDiem + '</span> trong lớp' : '') +
    '</p></div>';
}

/* -------------------------------------------------------------- danh sách -- */
function veBang(list) {
  var tb = $('tbody');
  if (!list.length) {
    tb.innerHTML = '<tr><td class="t-l" colspan="11" style="padding:28px 0;text-align:left">' +
      'Không có dòng nào khớp bộ lọc đang chọn. Bỏ bớt từ khoá hoặc chọn lại lớp.</td></tr>';
    $('tfoot').innerHTML = '';
    $('list-summary').textContent = 'Không có dòng nào khớp bộ lọc.';
    tb.onclick = null;
    return;
  }
  tb.innerHTML = list.map(function (s, i) {
    return '<tr' + (state.chon === s.sbd ? ' class="on"' : '') + ' data-r="b" data-sbd="' + s.sbd + '">' +
      '<td class="idx num t-l">' + (i + 1) + '</td>' +
      '<td class="sbd num t-l">' + s.sbd + '</td>' +
      '<td class="name t-l"><button type="button" class="open" data-sbd="' + s.sbd + '">' + esc(s.ten) +
      '</button><span class="meta">' + esc(s.lop) + '</span></td>' +
      '<td class="cls t-l">' + esc(s.lop) + '</td>' +
      s.d.map(function (v, j) {
        return '<td class="' + (v === null ? 'none' : 'n ' + lopDiem(v)) + '" data-mon="' + esc(MON[j]) + '">' +
          (v === null ? nhanVang(s) : v.toFixed(2)) + '</td>';
      }).join('') +
      '<td class="total n">' + so(s.tong) + '</td>' +
      '<td class="mean n ' + lopDiem(s.dtb) + '">' + so(s.dtb) + '</td></tr>';
  }).join('');

  var key = KEYS.filter(function (x) { return x.k === state.sort.k; })[0];
  $('list-summary').textContent = 'Bảng đang hiện ' + list.length + ' trên ' + TONG_HS +
    ' học sinh, sắp theo ' + key.nhan + (state.sort.dir === 1 ? ' tăng dần' : ' giảm dần') + '.';

  var foot = '<tr data-r="t"><td class="t-l" colspan="4">Trung bình của <span class="num">' +
    list.length + '</span> học sinh đang xem</td>';
  MON.forEach(function (_, j) {
    var v = list.map(function (s) { return s.d[j]; }).filter(function (x) { return x !== null; });
    foot += '<td class="n">' + (v.length ? (v.reduce(function (a, b) { return a + b; }, 0) / v.length).toFixed(2) : '—') + '</td>';
  });
  var tg = list.map(function (s) { return s.tong; }).filter(function (x) { return x !== null; });
  var dt = list.map(function (s) { return s.dtb; }).filter(function (x) { return x !== null; });
  foot += '<td class="n">' + (tg.length ? (tg.reduce(function (a, b) { return a + b; }, 0) / tg.length).toFixed(2) : '—') + '</td>' +
    '<td class="n">' + (dt.length ? (dt.reduce(function (a, b) { return a + b; }, 0) / dt.length).toFixed(2) : '—') + '</td></tr>';
  $('tfoot').innerHTML = foot;

  tb.onclick = function (e) {
    var tr = e.target.closest('tr');
    if (!tr || !tr.getAttribute('data-sbd')) return;
    moHocSinh(tr.getAttribute('data-sbd'));
  };
}

function veDauBang() {
  var ths = $('kq').querySelectorAll('thead th');
  Array.prototype.forEach.call(ths, function (th, i) {
    if (i === 0) { th.style.width = '44px'; return; }
    th.style.cursor = 'pointer';
    th.onclick = function () { sapTheo(KEYS[i - 1].k); };
  });
}

/* --------------------------------------------------------------- thống kê -- */
function veThongKe(list) {
  var tk = thongKe(list);
  var nguon = state.lop === 'all' ? 'toàn khối' : 'lớp ' + state.lop;
  var pham = state.q ? 'khớp “' + esc(state.q) + '” trong ' + nguon : nguon;
  var h = '';

  h += '<section class="story ruled" data-r="t" data-render="rules"><h2>Phổ điểm năm môn</h2>' +
    '<p class="lede">Mỗi cột là nửa điểm. Chỉ tính những học sinh thực sự có điểm ở môn đó, vạch đỏ là ngưỡng 5,0.</p>' +
    '<div class="multi">';
  tk.mon.forEach(function (m, i) {
    var hh = m.n ? 104 : 30;
    h += '<figure class="mini">' +
      '<h3>' + esc(MON[i]) + '<span class="num">' + m.n + ' dự thi</span></h3>' +
      '<div class="chart ruled" data-render="chart" data-bins="' + JSON.stringify(m.bins || []) +
      '" data-dinh="' + (m.dinh || 0) + '" style="height:' + hh + 'px"></div>' +
      '<figcaption class="stats">' + (m.n
        ? 'Trung bình <b class="num">' + m.mean.toFixed(2) + '</b> · trung vị <b class="num">' + m.med.toFixed(2) +
          ' · từ <b class="num">' + m.min.toFixed(2) + '</b> đến <b class="num">' + m.max.toFixed(2) + '</b><br>' +
          'Từ 5,0 trở lên <b class="num">' + m.ge5 + '</b>/' + m.n + ' (<b class="num">' + (100 * m.ge5 / m.n).toFixed(1) +
          '%</b>) · dưới 5,0 <b class="num" style="color:var(--son-do)">' + (m.n - m.ge5) + '</b>'
        : 'Không có học sinh nào dự thi môn này trong phạm vi đang xem.') +
      '</figcaption></figure>';
  });
  h += '</div></section>';

  h += '<section class="story ruled" data-r="t" data-render="rules"><h2>Số học sinh dự thi mỗi môn</h2>' +
    '<p class="lede">Không phải em nào cũng dự đủ năm môn, nên mẫu số mỗi môn một khác. Thanh dài bằng số học sinh dự thi.</p>' +
    '<figure class="chart ruled" data-render="parts" data-labels="' + esc(JSON.stringify(MON)).replace(/"/g, '&quot;') +
    '" data-vals="' + JSON.stringify(tk.mon.map(function (m) { return m.n; })) + '" data-tong="' + tk.n +
    '" style="height:190px;margin-top:24px"></figure>' +
    '<p class="lede" style="margin-top:12px">' +
    tk.mon.map(function (m, i) { return esc(MON[i]) + ' <b class="num">' + m.n + '</b>'; }).join(' · ') +
    ' trên <b class="num">' + tk.n + '</b> học sinh.</p></section>';

  h += '<section class="story ruled" data-r="t" data-render="rules"><h2>Điểm trung bình theo lớp</h2>' +
    '<p class="lede">Ô ghi <span class="struck">không thi</span> là lớp không có học sinh nào dự thi môn đó trong phạm vi đang xem.</p>' +
    '<div class="wrap ruled" data-r="b" data-render="rules" style="margin-top:20px"><table class="avg"><thead><tr>' +
    '<th scope="col" class="t-l">Lớp</th><th scope="col">Số HS</th>' +
    MON.map(function (m) { return '<th scope="col">' + esc(m) + '</th>'; }).join('') +
    '<th scope="col">ĐTB chung</th></tr></thead><tbody>' +
    tk.lop.map(function (r) {
      return '<tr data-r="b"><td class="t-l">' + r.lop + '</td><td class="n">' + r.n + '</td>' +
        r.tb.map(function (v) {
          return '<td class="' + (v === null ? 'none' : 'n ' + lopDiem(v)) + '">' +
            (v === null ? 'không thi' : v.toFixed(2)) + '</td>';
        }).join('') +
        '<td class="n">' + (r.tbDTB === null ? '—' : r.tbDTB.toFixed(2)) + '</td></tr>';
    }).join('') + '</tbody></table></div></section>';

  h += '<section class="story ruled" data-r="t" data-render="rules"><h2>Phạm vi và cách tính</h2>' +
    '<p class="lede">Số liệu tính trên <b class="num">' + tk.n + '/' + TONG_HS + '</b> học sinh — ' + pham + '. ' +
    (state.lop !== 'all' || state.q ? 'Bỏ bộ lọc ở khung trên để xem lại toàn khối.' : 'Lọc lớp hoặc gõ tên ở ô tra cứu để thu hẹp phạm vi.') +
    '</p><p class="lede">ĐTB của một học sinh là trung bình những môn em đó thực sự có điểm, môn <span class="struck">không thi</span> ' +
    'không bị tính là 0. Trong phạm vi này có <b class="num">' + tk.khongThiCa + '</b> em <span class="struck">vắng thi</span> cả năm môn và <b class="num">' +
    tk.du5Mon + '</b> em dự đủ cả năm môn.</p></section>';

  $('stats').innerHTML = h;
}

/* --------------------------------------------------------------- apparatus -- */
function veLe(list) {
  var big = $('apBig'), nhan = $('apLabel'), note = $('apNote'), dl = $('apList');
  var chon = state.chon ? HS.filter(function (s) { return s.sbd === state.chon; })[0] : null;
  var html = '';

  if (state.view === 'tracuu') {
    if (!chon) {
      nhan.textContent = 'Chưa chọn học sinh';
      big.textContent = String(list.length);
      note.textContent = state.q ? 'học sinh khớp từ khoá' : 'học sinh trong danh sách';
      html += '<dt>Cách tra</dt><dd>Nhập số báo danh hoặc họ tên ở ô phía trên</dd>' +
        '<dt>Số báo danh</dt><dd>12000001 – 12000508</dd>';
    } else {
      nhan.textContent = 'Học sinh đang xem';
      big.textContent = chon.dtb === null ? '—' : chon.dtb.toFixed(2);
      note.textContent = chon.dtb === null
        ? 'vắng thi cả năm môn nên không có ĐTB'
        : 'ĐTB của ' + chon.duthi + ' môn em này dự thi';
      html += '<dt>Số báo danh</dt><dd>' + chon.sbd + '</dd>' +
        '<dt>Lớp</dt><dd>' + esc(chon.lop) + ' · ' + LOP_DEM[chon.lop].n + ' học sinh</dd>' +
        '<dt>Ngày sinh</dt><dd>' + esc(chon.ns) + '</dd>';
      if (chon.dtb === null) {
        html += '<dt>Xếp thứ tự</dt><dd>không xếp — em vắng thi cả năm môn</dd>';
      } else {
        html += '<dt>Xếp toàn khối</dt><dd>' + chon.hang + '/' + SO_CO_DTB + ' học sinh có điểm</dd>' +
          '<dt>Xếp trong lớp</dt><dd>' + chon.hangLop + '/' + LOP_DEM[chon.lop].coDiem + ' học sinh có điểm</dd>' +
          '<dt>ĐTB lớp</dt><dd>' + (LOP_TB[chon.lop] === null ? '—' : LOP_TB[chon.lop].toFixed(2)) +
          ' · toàn khối ' + (TK_TOAN.tbDTB === null ? '—' : TK_TOAN.tbDTB.toFixed(2)) + '</dd>';
      }
    }
  } else if (state.view === 'thongke') {
    var tk = thongKe(list);
    nhan.textContent = 'Phạm vi thống kê';
    big.textContent = String(list.length);
    note.textContent = 'trên ' + TONG_HS + ' học sinh';
    html += '<dt>Lớp</dt><dd>' + (state.lop === 'all' ? 'tất cả' : state.lop) + '</dd>' +
      '<dt>Từ khoá</dt><dd>' + (state.q ? '“' + esc(state.q) + '”' : 'không') + '</dd>' +
      '<dt>ĐTB chung</dt><dd>' + (tk.tbDTB === null ? '—' : tk.tbDTB.toFixed(2)) + '</dd>' +
      '<dt>Vắng thi cả năm</dt><dd>' + tk.khongThiCa + ' em</dd>';
  } else {
    var du5 = list.filter(function (s) { return s.duthi === 5; }).length;
    var khong = list.filter(function (s) { return s.duthi === 0; }).length;
    nhan.textContent = 'Đang xem';
    big.textContent = String(list.length);
    note.textContent = 'trên ' + TONG_HS + ' học sinh';
    html += '<dt>Lớp</dt><dd>' + (state.lop === 'all' ? 'tất cả' : state.lop) + '</dd>' +
      '<dt>Sắp theo</dt><dd>' + KEYS.filter(function (x) { return x.k === state.sort.k; })[0].nhan +
      (state.sort.dir === 1 ? ' tăng' : ' giảm') + '</dd>' +
      '<dt>Dự đủ 5 môn</dt><dd>' + du5 + ' em</dd>' +
      '<dt>Vắng thi cả năm</dt><dd>' + khong + ' em</dd>';
  }
  dl.innerHTML = html;
}

/* ------------------------------------------------------------------- chạy --- */
function capNhat() {
  var list = hienThi();

  if (state.view === 'tracuu') {
    if (state.chon && !list.some(function (s) { return s.sbd === state.chon; })) state.chon = null;
    if (!state.chon && state.q && list.length) state.chon = list[0].sbd;
  }

  veBand(list);

  $('view-tracuu').hidden = state.view !== 'tracuu';
  $('view-danhsach').hidden = state.view !== 'danhsach';
  $('view-thongke').hidden = state.view !== 'thongke';

  if (state.view === 'tracuu') {
    veHits(list);
    veSlip(state.chon ? HS.filter(function (s) { return s.sbd === state.chon; })[0] : null);
  } else if (state.view === 'danhsach') {
    veBang(list);
  } else {
    veThongKe(list);
  }

  veLe(list);
  keLai();

  if (state.view === 'tracuu') {
    bao(!state.q ? 'Ô tra cứu đang trống, đang hiện gợi ý số báo danh'
      : list.length ? 'Tìm thấy ' + list.length + ' học sinh khớp từ khoá'
        : 'Không tìm thấy học sinh nào khớp từ khoá');
  } else if (state.view === 'danhsach') {
    bao('Bảng đang hiện ' + list.length + ' trên ' + TONG_HS + ' học sinh');
  } else {
    bao('Thống kê tính trên ' + list.length + ' học sinh');
  }
}

/* tabs */
var TABS = ['tracuu', 'danhsach', 'thongke'];
function doiView(v, day) {
  state.view = v;
  TABS.forEach(function (t) {
    var b = $('tab-' + t);
    b.setAttribute('aria-selected', String(t === v));
    b.tabIndex = t === v ? 0 : -1;
  });
  if (day !== false) { try { history.replaceState(null, '', '#' + v); } catch (e) { } }
  capNhat();
  var p = $('view-' + v);
  try { p.focus({ preventScroll: true }); } catch (e) { p.focus(); }
}
TABS.forEach(function (t) {
  $('tab-' + t).addEventListener('click', function () { doiView(t); });
  $('tab-' + t).addEventListener('keydown', function (e) {
    var i = TABS.indexOf(t), j = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % TABS.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i + TABS.length - 1) % TABS.length;
    if (j === null) return;
    e.preventDefault();
    doiView(TABS[j]);
    $('tab-' + TABS[j]).focus();
  });
});

/* mở phiếu của một học sinh: dùng cho cả bấm dòng trong bảng kê */
function moHocSinh(sbd) {
  var s = HS.filter(function (x) { return x.sbd === sbd; })[0];
  if (!s) return;
  state.chon = sbd;
  doiView('tracuu');
  bao('Đang mở phiếu điểm của ' + s.ten + ', lớp ' + s.lop);
}

/* ô tra cứu */
var q = $('q');
var hen = null;
q.addEventListener('input', function () {
  $('search').classList.toggle('has-q', !!q.value);
  if (hen) clearTimeout(hen);
  hen = setTimeout(function () {
    state.q = q.value;
    state.chon = null;
    capNhat();
  }, 90);
});
$('search').addEventListener('submit', function (e) { e.preventDefault(); });
$('clearq').addEventListener('click', function () {
  q.value = '';
  state.q = '';
  state.chon = null;
  $('search').classList.remove('has-q');
  capNhat();
  q.focus();
});
document.addEventListener('keydown', function (e) {
  if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  if (e.key === 'Escape' && document.activeElement === q && q.value) {
    q.value = '';
    state.q = '';
    state.chon = null;
    $('search').classList.remove('has-q');
    capNhat();
  }
});

veDauBang();
var tham = new URLSearchParams(location.search || '');
if (tham.get('q')) {
  state.q = tham.get('q');
  q.value = state.q;
  $('search').classList.add('has-q');
}
if (tham.get('lop') && LOP.indexOf(tham.get('lop')) > -1) state.lop = tham.get('lop');

var viewDau = (location.hash || '').replace('#', '');
doiView(TABS.indexOf(viewDau) > -1 ? viewDau : 'tracuu', false);

/* đổi hash (bấm back/forward hoặc mở link #thongke) thì đổi khu vực */
window.addEventListener('hashchange', function () {
  var v = (location.hash || '').replace('#', '');
  if (TABS.indexOf(v) > -1 && v !== state.view) doiView(v, false);
});

})();
