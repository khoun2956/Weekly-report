// Application state initialized from default data (cloned)
let DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
let WEEKLY_SUMMARY = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_SUMMARY));
let REWORK_SERVICE = JSON.parse(JSON.stringify(DEFAULT_REWORK_SERVICE));

let manualInTotals = true,
  manualFixTotals = true;

let sourceFiles = { in: "", fix: "", summary: "", service: "" },
  sourceTimes = { in: "", fix: "", summary: "", service: "" },
  pendingUpload = null;
const KEY = "weeklyPartsReportClassifications";
let classes = {};
try {
  classes = JSON.parse(localStorage.getItem(KEY) || "{}");
} catch {}
try {
  let combined = localStorage.getItem("weeklyPartsUploadedData");
  if (combined) {
    const saved = JSON.parse(combined);
    if (Array.isArray(saved.in) && saved.in.length) {
      DATA.in = saved.in;
      manualInTotals = false;
    }
    if (Array.isArray(saved.fix) && saved.fix.length) {
      DATA.fix = saved.fix;
      manualFixTotals = false;
    }
  }
  let v = localStorage.getItem("weeklyPartsInData");
  if (v) {
    let savedRows = JSON.parse(v);
    if (Array.isArray(savedRows) && savedRows.length) {
      DATA.in = savedRows;
      manualInTotals = false;
    }
  }
  v = localStorage.getItem("weeklyPartsFixData");
  if (v) {
    let savedRows = JSON.parse(v);
    if (Array.isArray(savedRows) && savedRows.length) {
      DATA.fix = savedRows;
      manualFixTotals = false;
    }
  }
  v = localStorage.getItem("weeklyPartsSummaryData");
  if (v) {
    let savedRows = JSON.parse(v);
    if (Array.isArray(savedRows) && savedRows.length)
      WEEKLY_SUMMARY = savedRows;
  }
  v = localStorage.getItem("weeklyPartsManualInTotals");
  if (v !== null) manualInTotals = v === "true";
  v = localStorage.getItem("weeklyPartsManualFixTotals");
  if (v !== null) manualFixTotals = v === "true";
  v = localStorage.getItem("weeklyPartsServiceData");
  if (v) {
    let savedRows = JSON.parse(v);
    if (Array.isArray(savedRows) && savedRows.length)
      REWORK_SERVICE = savedRows;
  }
  for (const k of ["in", "fix", "summary", "service"]) {
    sourceFiles[k] = localStorage.getItem("weeklyPartsSource_" + k) || "";
    sourceTimes[k] = localStorage.getItem("weeklyPartsUpdatedAt_" + k) || "";
  }
} catch {}

for (const [k, id] of [
  ["in", "statusIn"],
  ["fix", "statusFix"],
  ["summary", "statusSummary"],
  ["service", "statusService"],
]) {
  const el = document.getElementById(id);
  if (el && sourceFiles[k])
    el.textContent =
      "ໃຊ້ Excel · " +
      sourceFiles[k] +
      (sourceTimes[k]
        ? " · " + new Date(sourceTimes[k]).toLocaleString("en-GB")
        : "");
}

for (const [id, key] of [
  ["rwLaoColor", "weeklyReportRwLaoColor"],
  ["partInFixColor", "weeklyReportPartInFixColor"],
]) {
  const picker = document.getElementById(id),
    savedColor = localStorage.getItem(key);
  if (picker && savedColor && /^#[0-9a-f]{6}$/i.test(savedColor))
    picker.value = savedColor;
}

const reportFoot = document.getElementById("reportFoot");
if (reportFoot)
  reportFoot.textContent =
    "ແຕ່ລະສ່ວນອັບເດດຈາກໄຟລ໌ Excel ແຍກກັນ ແລະບັນທຶກໄວ້ໃນ browser ນີ້";

// Part classification logic based on user rules:
// - MIC PART ID CODE start with '010' - '070' -> 'ELECTRONIC'
// - MIC PART ID CODE >= '080' -> 'Wear/Tear'
// - MIC PART ID CODE start with 'HCS' -> 'HCS'
function classifyPartCode(code, name = "") {
  const c = String(code || "").trim().toUpperCase();
  if (c.startsWith("HCS")) {
    return "HCS";
  }
  const m = c.match(/^(\d{3})/);
  if (m) {
    const num = parseInt(m[1], 10);
    if (num >= 10 && num <= 70) {
      return "ELECTRONIC";
    } else if (num >= 80) {
      return "Wear/Tear";
    }
  }
  const n = String(name || "").toLowerCase();
  if (
    n.includes("roller") ||
    n.includes("gear") ||
    n.includes("belt") ||
    n.includes("guide") ||
    n.includes("filter") ||
    n.includes("wear")
  ) {
    return "Wear/Tear";
  }
  return "ELECTRONIC";
}

const getClass = (code, name = "") => {
  if (classes[code]) return classes[code];
  if (classes[name]) return classes[name];
  return classifyPartCode(code, name);
};

const setClass = (key, v) => {
  if (v) classes[key] = v;
  else delete classes[key];
  localStorage.setItem(KEY, JSON.stringify(classes));
  render();
};

const dateOnly = (s) => String(s || "").slice(0, 10);

// Format date to dd-mmm-yy (e.g. 09-Oct-26, 06-Nov-26)
const fmtDate = (s) => {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return String(s);
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

// Start monday ISO
const startMon = (s) => {
  if (!s) return "";
  let [y, m, day] = s.split("-").map(Number);
  if (!y || !m || !day) return "";
  let d = new Date(Date.UTC(y, m - 1, day));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};

const wlabel = (k) => {
  let [y, m, day] = k.split("-").map(Number),
    a = new Date(Date.UTC(y, m - 1, day)),
    b = new Date(a);
  b.setUTCDate(b.getUTCDate() + 5);
  return `${a.toLocaleDateString("en-GB", { timeZone: "UTC", day: "2-digit", month: "short" })} – ${b.toLocaleDateString("en-GB", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })}`;
};

let weeks = [];
const sel = document.getElementById("week");

function refreshWeeks(preferred) {
  weeks = [
    ...new Set(
      [...DATA.in, ...DATA.fix]
        .map((x) => startMon(dateOnly(x.date)))
        .concat(
          WEEKLY_SUMMARY.map((x) => x.week),
          REWORK_SERVICE.map((x) => x.week),
        ),
    ),
  ]
    .filter(Boolean)
    .sort();
  sel.innerHTML = "";
  weeks.forEach((k) => {
    let o = document.createElement("option");
    o.value = k;
    o.textContent = wlabel(k);
    sel.append(o);
  });
  sel.value =
    preferred && weeks.includes(preferred)
      ? preferred
      : weeks[weeks.length - 1] || "";
}
refreshWeeks();

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// Compare part codes Min to Max (ascending)
function comparePartCode(a, b) {
  const codeA = String(a.code || a.micPartCode || "").trim();
  const codeB = String(b.code || b.micPartCode || "").trim();
  if (!codeA && !codeB) return (a.name || "").localeCompare(b.name || "");
  if (!codeA) return 1;
  if (!codeB) return -1;
  return codeA.localeCompare(codeB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function current() {
  let k = sel.value;
  return {
    in: DATA.in
      .filter((x) => startMon(dateOnly(x.date)) === k)
      .sort(comparePartCode),
    fix: DATA.fix
      .filter((x) => startMon(dateOnly(x.date)) === k)
      .sort(comparePartCode),
  };
}

function mergeDateRows(existing, incoming) {
  let touched = new Set(
    incoming.map((x) => startMon(dateOnly(x.date))).filter(Boolean),
  );
  if (!touched.size) return incoming;
  return [
    ...existing.filter((x) => !touched.has(startMon(dateOnly(x.date)))),
    ...incoming,
  ];
}

function mergeWeekBlocks(existing, incoming) {
  let touched = new Set(incoming.map((x) => x.week).filter(Boolean));
  if (!touched.size) return incoming;
  return [...existing.filter((x) => !touched.has(x.week)), ...incoming].sort(
    (a, b) => a.week.localeCompare(b.week),
  );
}

function clsSelect(code, name) {
  const currentClass = getClass(code, name);
  const key = code || name;
  return `<select class="tagselect" data-key="${esc(key)}" onchange="setClass(this.dataset.key, this.value)">
    <option value="ELECTRONIC" ${currentClass === "ELECTRONIC" ? "selected" : ""}>ELECTRONIC</option>
    <option value="Wear/Tear" ${currentClass === "Wear/Tear" ? "selected" : ""}>Wear/Tear</option>
    <option value="HCS" ${currentClass === "HCS" ? "selected" : ""}>HCS</option>
  </select>`;
}

function barRows(obj, color = "") {
  let vals = Object.entries(obj).sort((a, b) => b[1] - a[1]);
  let max = Math.max(1, ...vals.map((x) => x[1]));
  return vals.length
    ? vals
        .map(
          ([n, v]) =>
            `<div class="barrow"><span title="${esc(n)}">${esc(n)}</span><div class="track"><div class="fill ${color}" style="width:${(v / max) * 100}%"></div></div><b>${v}</b></div>`,
        )
        .join("")
    : '<div class="empty">ບໍ່ມີລາຍການໃນອາທິດນີ້</div>';
}

function kpi(label, value, hint) {
  return `<div class="card"><div class="label">${label}</div><div class="value">${value}</div><div class="hint">${hint}</div></div>`;
}

function typeSummary(stats, grandTotal) {
  let groups = [
    [
      "ELECTRONIC",
      "electronic",
      stats.ELECTRONIC,
      (stats.ELECTRONIC?.parts?.size || 0) + " ຊື່ອາໄຫຼ່",
    ],
    [
      "Wear/Tear",
      "wear",
      stats["Wear/Tear"],
      (stats["Wear/Tear"]?.parts?.size || 0) + " ຊື່ອາໄຫຼ່",
    ],
    [
      "HCS",
      "pending",
      stats.HCS,
      (stats.HCS?.parts?.size || 0) + " ຊື່ອາໄຫຼ່",
    ],
  ];
  return (
    '<div class="type-summary">' +
    groups
      .map(
        ([n, c, v, note]) =>
          '<div class="type-box ' +
          c +
          '"><strong>' +
          n +
          "</strong><b>" +
          (v?.qty || 0) +
          " ຊິ້ນ</b><span>" +
          note +
          "</span></div>",
      )
      .join("") +
    "</div>"
  );
}

function fixTypeSummary(stats, manual) {
  if (manual) {
    let groups = [
      ["Electronic", "electronic", 43, "ຊິ້ນ"],
      ["Card Fix", "wear", 15, "Unit"],
      ["Reuse Wear/Tear", "pending", 4, "ຊິ້ນ"],
      ["Total Part Move", "electronic", 47, "Electronic + Wear/Tear"],
    ];
    return (
      '<div class="type-summary">' +
      groups
        .map(
          ([n, c, v, note]) =>
            '<div class="type-box ' +
            c +
            '"><strong>' +
            n +
            "</strong><b>" +
            v +
            " ຊິ້ນ</b><span>" +
            note +
            "</span></div>",
        )
        .join("") +
      "</div>"
    );
  }
  return typeSummary(stats);
}

function normalizeZipPath(base, target) {
  let parts = target.startsWith("/") ? [] : base.split("/").slice(0, -1);
  for (const p of target.replace(/^\//, "").split("/")) {
    if (!p || p === ".") continue;
    if (p === "..") parts.pop();
    else parts.push(p);
  }
  return parts.join("/");
}

function summaryValue(v, label) {
  if (v === null || v === undefined || v === "") return "";
  if (typeof v === "number") {
    if (v > 30000) {
      let d = new Date(Date.UTC(1899, 11, 30) + Math.round(v * 86400000));
      return d
        .toLocaleDateString("en-GB", {
          timeZone: "UTC",
          day: "2-digit",
          month: "short",
        })
        .replace(" ", "-");
    }
    if (/part\s*in\s*\/\s*part\s*fixed/i.test(label) && v >= 0 && v <= 2)
      return (v * 100).toFixed(1).replace(/\.0$/, "").replace(".", ",") + "%";
    if (/part\s*error\s*\/\s*part\s*fixed/i.test(label) && v >= 0 && v <= 1)
      return (v * 100).toFixed(2).replace(/0+$/, "").replace(/,$/, "") + "%";
  }
  return String(v).trim();
}

async function readXlsx(file) {
  const buffer = await file.arrayBuffer(),
    view = new DataView(buffer),
    bytes = new Uint8Array(buffer),
    decoder = new TextDecoder();
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw Error("Excel ZIP directory not found");
  let count = view.getUint16(eocd + 10, true),
    cursor = view.getUint32(eocd + 16, true),
    entries = new Map();
  for (let i = 0; i < count; i++) {
    if (view.getUint32(cursor, true) !== 0x02014b50)
      throw Error("Invalid Excel ZIP entry");
    let method = view.getUint16(cursor + 10, true),
      size = view.getUint32(cursor + 20, true),
      nameLen = view.getUint16(cursor + 28, true),
      extraLen = view.getUint16(cursor + 30, true),
      commentLen = view.getUint16(cursor + 32, true),
      offset = view.getUint32(cursor + 42, true),
      name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLen));
    entries.set(name, { method, size, offset });
    cursor += 46 + nameLen + extraLen + commentLen;
  }
  async function text(path) {
    let entry = entries.get(path);
    if (!entry) return null;
    let off = entry.offset,
      nameLen = view.getUint16(off + 26, true),
      extraLen = view.getUint16(off + 28, true),
      start = off + 30 + nameLen + extraLen,
      compressed = bytes.slice(start, start + entry.size);
    if (entry.method === 0) return decoder.decode(compressed);
    if (entry.method !== 8) throw Error("Unsupported Excel compression method");
    let stream = new Blob([compressed])
      .stream()
      .pipeThrough(new DecompressionStream("deflate-raw"));
    return await new Response(stream).text();
  }
  function xml(text) {
    if (!text) throw Error("Missing Excel workbook content");
    let doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.getElementsByTagName("parsererror").length)
      throw Error("Could not read Excel XML");
    return doc;
  }
  const workbook = xml(await text("xl/workbook.xml")),
    rels = xml(await text("xl/_rels/workbook.xml.rels")),
    relMap = new Map();
  for (const r of rels.getElementsByTagNameNS("*", "Relationship"))
    relMap.set(
      r.getAttribute("Id"),
      normalizeZipPath("xl/workbook.xml", r.getAttribute("Target")),
    );
  let strings = [];
  const shared = await text("xl/sharedStrings.xml");
  if (shared) {
    const doc = xml(shared);
    strings = [...doc.getElementsByTagNameNS("*", "si")].map(
      (si) => si.textContent || "",
    );
  }
  function colIndex(ref) {
    let letters = (ref.match(/[A-Z]+/i) || ["A"])[0].toUpperCase(),
      n = 0;
    for (const ch of letters) n = n * 26 + ch.charCodeAt(0) - 64;
    return n - 1;
  }
  function readRows(doc) {
    return [...doc.getElementsByTagNameNS("*", "row")].map((row) => {
      let arr = [];
      for (const c of row.getElementsByTagNameNS("*", "c")) {
        let idx = colIndex(c.getAttribute("r") || "A"),
          type = c.getAttribute("t"),
          v = c.getElementsByTagNameNS("*", "v")[0],
          value = v ? v.textContent : "";
        if (type === "s" && value) value = strings[Number(value)] || "";
        else if (type === "inlineStr") value = c.textContent || "";
        else if (type === "b") value = value === "1";
        else if (value !== "" && type !== "str") {
          let num = Number(value);
          if (Number.isFinite(num)) value = num;
        }
        arr[idx] = value;
      }
      return arr;
    });
  }
  function norm(x) {
    return String(x ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }
  function getIndex(row, matcher) {
    return row.findIndex((v) => matcher(norm(v)));
  }
  function parseDate(value) {
    if (typeof value === "number" && value > 10000) {
      let d = new Date(Date.UTC(1899, 11, 30) + Math.round(value * 86400000));
      return d.toISOString();
    }
    let s = String(value ?? "").trim();
    let m = s.match(
      /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
    );
    if (m)
      return new Date(
        Date.UTC(
          +m[3],
          +m[2] - 1,
          +m[1],
          +(m[4] || 0),
          +(m[5] || 0),
          +(m[6] || 0),
        ),
      ).toISOString();
    let d = new Date(s);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString();
  }
  function qtyNum(v) {
    let n =
      typeof v === "number"
        ? v
        : Number(String(v ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  function category(v, name) {
    let s = String(v ?? "").toLowerCase();
    if (s.includes("wear") || s.includes("tear")) classes[name] = "Wear/Tear";
    else if (s.includes("elect")) classes[name] = "ELECTRONIC";
  }
  function person(v) {
    return (
      String(v ?? "")
        .replace(
          /\s*(?:fix part|reuse part)\s+in\s+(?:the\s+)?(?:rework|rw).*$/i,
          "",
        )
        .replace(/\s+fix$/i, "")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase()) || "ບໍ່ລະບຸ"
    );
  }
  const out = { in: [], fix: [], summary: [], service: [] };
  let inSourceChosen = false;
  for (const sh of workbook.getElementsByTagNameNS("*", "sheet")) {
    const name = sh.getAttribute("name") || "",
      id =
        sh.getAttribute("r:id") ||
        sh.getAttributeNS(
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
          "id",
        ),
      path = relMap.get(id);
    if (!path || /^rework|^weekly|^part\s*short/i.test(name)) continue;
    const isMove = /^part\s*move/i.test(name),
      isIn = !isMove;
    if (isIn && inSourceChosen) continue;
    const rows = readRows(xml(await text(path)));
    let map = null;
    for (const row of rows) {
      let pi = getIndex(
          row,
          (x) =>
            x.includes("partname") ||
            x.includes("partitem") ||
            x.includes("itemname") ||
            x.includes("partdescription") ||
            x.includes("itemdescription") ||
            x === "part" ||
            x === "item" ||
            x === "description",
        ),
        di = getIndex(row, (x) => x.includes("date")),
        qi = getIndex(
          row,
          (x) =>
            x === "quantity" ||
            x === "qty" ||
            x.includes("quantity") ||
            x.includes("qty"),
        );
      if (pi >= 0 && di >= 0 && qi >= 0) {
        if (isIn) inSourceChosen = true;
        map = {
          pi,
          di,
          qi,
          code: getIndex(
            row,
            (x) =>
              x.includes("micpartcode") ||
              x.includes("partcode") ||
              x.includes("micpart") ||
              x === "partno" ||
              x === "partnumber",
          ),
          source: getIndex(
            row,
            (x) =>
              x === "remark" ||
              x === "source" ||
              x.includes("branch") ||
              x.includes("location") ||
              x === "unit",
          ),
          bank: getIndex(row, (x) => x.includes("bank")),
          store: getIndex(row, (x) => x.includes("store") || x.includes("storename")),
          fromStore: getIndex(row, (x) => x.includes("fromstore")),
          toStore: getIndex(row, (x) => x.includes("tostore")),
          status: getIndex(row, (x) => x === "status"),
          purpose: getIndex(row, (x) => x.includes("purpose")),
          ticket: getIndex(row, (x) => x.includes("ticket")),
          person: getIndex(
            row,
            (x) =>
              x.includes("partfixthisweek") ||
              x.includes("sender") ||
              x === "fixby" ||
              x === "repairedby" ||
              x === "technician",
          ),
          category: getIndex(
            row,
            (x) =>
              x === "category" ||
              x === "parttype" ||
              x === "type" ||
              x === "wearttear" ||
              x === "weartear",
          ),
        };
        continue;
      }
      if (!map) continue;
      let date = parseDate(row[map.di]),
        part = String(row[map.pi] ?? "").trim(),
        qty = qtyNum(row[map.qi]);
      if (!date || !part || qty <= 0) continue;
      if (!isIn) {
        if (
          map.status >= 0 &&
          String(row[map.status] ?? "")
            .trim()
            .toLowerCase() !== "confirmed"
        )
          continue;
        let to =
          map.toStore >= 0
            ? String(row[map.toStore] ?? "")
                .trim()
                .toLowerCase()
            : "";
        if (to && !to.includes("usable")) continue;
      }
      let codeVal = map.code >= 0 ? String(row[map.code] ?? "").trim() : "";
      let cat = map.category >= 0 ? row[map.category] : "";
      if (cat) category(cat, part);
      if (isIn) {
        let source =
          map.source >= 0 ? String(row[map.source] ?? "").trim() : "";
        let bank =
          map.bank >= 0
            ? String(row[map.bank] ?? "").trim()
            : source.split(" - ")[0] || "ບໍ່ລະບຸ";
        let store = map.store >= 0 ? String(row[map.store] ?? "").trim() : "";
        let purpose = map.purpose >= 0 ? String(row[map.purpose] ?? "").trim() : "";
        let ticket = map.ticket >= 0 ? String(row[map.ticket] ?? "").trim() : "";
        out.in.push({
          ticket,
          date,
          from: bank,
          code: codeVal,
          name: part,
          storeName: store || "Lao-Defective",
          type: classifyPartCode(codeVal, part),
          qty,
          purpose,
          remark: source,
          bank: bank || "ບໍ່ລະບຸ",
          source: source || bank || "ບໍ່ລະບຸ",
        });
      } else {
        let work = map.person >= 0 ? String(row[map.person] ?? "").trim() : "";
        let fromStore = map.fromStore >= 0 ? String(row[map.fromStore] ?? "").trim() : "Lao-Rework";
        let toStore = map.toStore >= 0 ? String(row[map.toStore] ?? "").trim() : "Lao-Usable";
        let purpose = map.purpose >= 0 ? String(row[map.purpose] ?? "").trim() : "";
        let ticket = map.ticket >= 0 ? String(row[map.ticket] ?? "").trim() : "";
        out.fix.push({
          date,
          code: codeVal,
          name: part,
          type: classifyPartCode(codeVal, part),
          sender: person(work),
          fromStore,
          toStore,
          qty,
          status: "Confirmed",
          purpose,
          remark: work,
          ticket,
          who: person(work),
          work,
        });
      }
    }
  }
  for (const sh of workbook.getElementsByTagNameNS("*", "sheet")) {
    const name = sh.getAttribute("name") || "";
    if (!/^rework\s*lao/i.test(name)) continue;
    const id =
        sh.getAttribute("r:id") ||
        sh.getAttributeNS(
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
          "id",
        ),
      path = relMap.get(id);
    if (!path) continue;
    let block = null;
    for (const row of readRows(xml(await text(path)))) {
      const title = row.find(
        (v) => typeof v === "string" && /rework\s+weekly\s+report/i.test(v),
      );
      if (title) {
        const m = String(title).match(
          /(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})/,
        );
        if (m) {
          const iso =
            m[4] +
            "-" +
            String(m[3]).padStart(2, "0") +
            "-" +
            String(m[1]).padStart(2, "0");
          block = { week: startMon(iso), headers: [], rows: [] };
          out.summary.push(block);
        } else block = null;
        continue;
      }
      if (!block) continue;
      if (row.some((v) => norm(v) === "rwhn")) {
        block.headers = row.map((v) => String(v ?? "").trim());
        continue;
      }
      if (!block.headers.length) continue;
      const label = String(row[0] ?? "").trim();
      if (
        !/^(total\s*%|part\s*in\s*\/\s*part\s*fixed|part\s*error\s*\/\s*part\s*fixed)$/i.test(
          label,
        )
      )
        continue;
      block.rows.push(
        row.slice(0, block.headers.length).map((v) => summaryValue(v, label)),
      );
    }
  }
  for (const sh of workbook.getElementsByTagNameNS("*", "sheet")) {
    const name = sh.getAttribute("name") || "";
    if (!/^rework\s*service/i.test(name)) continue;
    const id =
        sh.getAttribute("r:id") ||
        sh.getAttributeNS(
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
          "id",
        ),
      path = relMap.get(id);
    if (!path) continue;
    let block = null,
      currentPerson = "";
    for (const row of readRows(xml(await text(path)))) {
      const range = row.find(
        (v) => typeof v === "string" && /^\s*date\s*:/i.test(v),
      );
      if (range) {
        const m = String(range).match(
          /(\d{1,2})[./](\d{1,2})[./](\d{4})\s*[–-]\s*(\d{1,2})[./](\d{1,2})[./](\d{4})/,
        );
        if (m) {
          let from =
              m[3] +
              "-" +
              String(m[2]).padStart(2, "0") +
              "-" +
              String(m[1]).padStart(2, "0"),
            to =
              m[6] +
              "-" +
              String(m[5]).padStart(2, "0") +
              "-" +
              String(m[4]).padStart(2, "0");
          block = {
            week: startMon(from),
            label: formatDMY(from) + " – " + formatDMY(to),
            people: [],
            tasks: [],
          };
          out.service.push(block);
          currentPerson = "";
        } else block = null;
        continue;
      }
      if (!block) continue;
      if (row.some((v) => norm(v) === "reworkname")) continue;
      let name = String(row[0] ?? "").trim();
      if (name) {
        currentPerson = name.replace(/^\w/, (c) => c.toUpperCase());
        block.people.push({
          name: currentPerson,
          onsite: qtyNum(row[1]),
          remote: qtyNum(row[2]),
          help: qtyNum(row[3]),
          delivery: qtyNum(row[4]),
          total: qtyNum(row[5]),
        });
      }
      let remark = String(row[6] ?? "").trim();
      if (remark && currentPerson) {
        let date = parseDate(row[7]),
          type = /\b(send|sent|delivery|power supply 335w)\b/i.test(remark)
            ? "Delivery"
            : /remote support/i.test(remark)
              ? "Remote support"
              : /help bank/i.test(remark)
                ? "Help bank fix"
                : "Onsite Service";
        block.tasks.push({
          person: currentPerson,
          type,
          remark,
          date: date ? date.slice(0, 10) : "",
        });
      }
    }
  }
  if (
    !out.in.length &&
    !out.fix.length &&
    !out.summary.length &&
    !out.service.length
  )
    throw Error("No matching weekly sheets found");
  return out;
}

async function handleSectionUpload(event, section) {
  let file = event.target.files?.[0];
  if (!file) return;
  let statusId =
      section === "in"
        ? "statusIn"
        : section === "fix"
          ? "statusFix"
          : section === "summary"
            ? "statusSummary"
            : "statusService",
    status = document.getElementById(statusId);
  status.textContent = "ກຳລັງອ່ານ Excel…";
  try {
    let parsed = await readXlsx(file),
      rows =
        section === "summary"
          ? parsed.summary
          : section === "service"
            ? parsed.service
            : parsed[section];
    if (!rows || !rows.length)
      throw Error(
        section === "in"
          ? "ບໍ່ພົບຊີດ Part In"
          : section === "fix"
            ? "ບໍ່ພົບຊີດ Part Move"
            : section === "service"
              ? "ບໍ່ພົບຊີດ Rework Service"
              : "ບໍ່ພົບຊີດ Rework Lao",
      );
    let storedRows;
    if (section === "in") {
      DATA.in = mergeDateRows(DATA.in, rows);
      storedRows = DATA.in;
      manualInTotals = false;
    } else if (section === "fix") {
      DATA.fix = mergeDateRows(DATA.fix, rows);
      storedRows = DATA.fix;
      manualFixTotals = false;
    } else if (section === "summary") {
      WEEKLY_SUMMARY = mergeWeekBlocks(WEEKLY_SUMMARY, rows);
      storedRows = WEEKLY_SUMMARY;
    } else {
      REWORK_SERVICE = mergeWeekBlocks(REWORK_SERVICE, rows);
      storedRows = REWORK_SERVICE;
    }
    sourceFiles[section] = file.name;
    sourceTimes[section] = new Date().toISOString();
    let saveError = "";
    try {
      const key =
        section === "summary"
          ? "weeklyPartsSummaryData"
          : section === "service"
            ? "weeklyPartsServiceData"
            : section === "in"
              ? "weeklyPartsInData"
              : "weeklyPartsFixData";
      localStorage.setItem(key, JSON.stringify(storedRows));
      localStorage.setItem("weeklyPartsSource_" + section, file.name);
      localStorage.setItem(
        "weeklyPartsUpdatedAt_" + section,
        sourceTimes[section],
      );
      localStorage.setItem(KEY, JSON.stringify(classes));
      localStorage.setItem("weeklyPartsManualInTotals", String(manualInTotals));
      localStorage.setItem(
        "weeklyPartsManualFixTotals",
        String(manualFixTotals),
      );
    } catch (e) {
      saveError = e?.message || "browser storage error";
    }
    let uploadedWeeks = (
        section === "in" || section === "fix"
          ? rows.map((x) => startMon(dateOnly(x.date)))
          : rows.map((x) => x.week)
      ).filter(Boolean),
      preferredWeek = uploadedWeeks.sort().at(-1);
    refreshWeeks(preferredWeek);
    document.getElementById("insearch").value = "";
    document.getElementById("fixsearch").value = "";
    render();
    renderLifecycle();
    renderService();
    status.textContent =
      "ອັບເດດແລ້ວ · " +
      file.name +
      " · " +
      rows.length +
      " ລາຍການ · " +
      (preferredWeek ? wlabel(preferredWeek) : "") +
      (saveError ? " · ບັນທຶກໃນ browser ບໍ່ສຳເລັດ: " + saveError : "");
  } catch (err) {
    status.textContent = "ອ່ານບໍ່ສຳເລັດ: " + (err?.message || "ກວດຊີດໃນໄຟລ໌");
  }
  event.target.value = "";
}

function partLookup(query, d) {
  let q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q)
    return '<div class="lookup-prompt">ຄົ້ນຫາຊື່ອາໄຫຼ່ ເພື່ອເບິ່ງຈຳນວນ Part In ແລະ Part Fix ຂອງອາໄຫຼ່ນັ້ນ</div>';
  let inRows = d.in.filter((x) =>
      (
        (x.name || "") +
        " " +
        (x.code || "") +
        " " +
        (x.bank || "") +
        " " +
        (x.from || "") +
        " " +
        (x.storeName || "") +
        " " +
        (x.source || "")
      )
        .toLowerCase()
        .includes(q),
    ),
    fixRows = d.fix.filter((x) =>
      (
        (x.name || "") +
        " " +
        (x.code || "") +
        " " +
        (x.who || "") +
        " " +
        (x.sender || "") +
        " " +
        (x.work || "")
      )
        .toLowerCase()
        .includes(q),
    );
  let names = [...new Set([...inRows, ...fixRows].map((x) => x.name))].sort(
    (a, b) => a.localeCompare(b),
  );
  if (!names.length)
    return '<div class="lookup-prompt">ບໍ່ພົບອາໄຫຼ່ທີ່ຄົ້ນຫາ</div>';
  let totalIn = inRows.reduce((n, x) => n + (Number(x.qty) || 0), 0),
    totalFix = fixRows.reduce((n, x) => n + (Number(x.qty) || 0), 0);
  return (
    '<div class="lookup-totals"><div class="lookup-total"><span>Part In ທີ່ພົບ</span><b>' +
    totalIn +
    ' ຊິ້ນ</b></div><div class="lookup-total"><span>Part Fix ທີ່ພົບ</span><b>' +
    totalFix +
    ' ຊິ້ນ</b></div><div class="lookup-total"><span>ລາຍການຊື່ອາໄຫຼ່</span><b>' +
    names.length +
    ' ຊື່</b></div></div><div class="lookup-list">' +
    names
      .map((name) => {
        let a = inRows.filter((x) => x.name === name),
          b = fixRows.filter((x) => x.name === name),
          ain = a.reduce((n, x) => n + (Number(x.qty) || 0), 0),
          bfix = b.reduce((n, x) => n + (Number(x.qty) || 0), 0),
          banks = [...new Set(a.map((x) => x.bank || x.from).filter(Boolean))].join(", "),
          techs = [...new Set(b.map((x) => x.who || x.sender).filter(Boolean))].join(", ");
        return (
          '<div class="lookup-row"><b>' +
          esc(name) +
          "</b><span>Part In: <strong>" +
          ain +
          "</strong> ຊິ້ນ" +
          (banks ? " · " + esc(banks) : "") +
          "</span><span>Part Fix: <strong>" +
          bfix +
          "</strong> ຊິ້ນ" +
          (techs ? " · " + esc(techs) : "") +
          "</span></div>"
        );
      })
      .join("") +
    "</div>"
  );
}

function toISODate(value) {
  let v = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  let m = v.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if (!m) return "";
  let day = Number(m[1]),
    month = Number(m[2]),
    year = Number(m[3]),
    d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
    ? year +
        "-" +
        String(month).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    : "";
}

function formatDMY(value) {
  return fmtDate(value);
}

// Rework Service - Render table layout matching ReworkService.png
function renderService() {
  const currentWeek = sel.value;
  let block = REWORK_SERVICE.find((x) => x.week === currentWeek) || REWORK_SERVICE[0];
  let tasks = block?.tasks || [];
  let people = block?.people || [];

  document.getElementById("serviceTitle").textContent = "Rework Service this week";

  // Calculate summary KPIs
  let sums = people.reduce(
    (a, p) => ({
      onsite: a.onsite + (Number(p.onsite) || 0),
      remote: a.remote + (Number(p.remote) || 0),
      help: a.help + (Number(p.help) || 0),
      delivery: a.delivery + (Number(p.delivery) || 0),
      total: a.total + (Number(p.total) || 0),
    }),
    { onsite: 0, remote: 0, help: 0, delivery: 0, total: 0 },
  );

  document.getElementById("serviceKpis").innerHTML =
    kpi("Onsite Service", sums.onsite, "ວຽກ") +
    kpi("Remote Support", sums.remote, "ວຽກ") +
    kpi("Help bank fix", sums.help, "ວຽກ") +
    kpi("Delivery", sums.delivery, "ວຽກ") +
    kpi("Total", sums.total, "ວຽກລວມ");

  // Filter tasks by week if task has date
  let weekStart = currentWeek;
  let weekEnd = "";
  if (weekStart) {
    let d = new Date(weekStart + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 7);
    weekEnd = d.toISOString().slice(0, 10);
  }

  let filteredTasks = tasks.filter((t) => {
    if (!t.date || !weekStart) return true;
    return t.date >= weekStart && t.date < weekEnd;
  });

  if (!filteredTasks.length && tasks.length) {
    filteredTasks = tasks;
  }

  const tbody = document.getElementById("serviceDetailsTable");
  if (!tbody) return;

  tbody.innerHTML = filteredTasks
    .map(
      (t) => `<tr>
      <td><b>${esc(t.person || t.reworkName || "")}</b></td>
      <td>${t.onsite ? esc(t.onsite) : ""}</td>
      <td>${t.remote ? esc(t.remote) : ""}</td>
      <td>${t.help ? esc(t.help) : ""}</td>
      <td>${t.delivery ? esc(t.delivery) : ""}</td>
      <td><b>${t.total ? esc(t.total) : (t.type ? esc(t.type) : "")}</b></td>
      <td class="remark-cell">${esc(t.remark || "")}</td>
      <td>${fmtDate(t.date)}</td>
    </tr>`,
    )
    .join("") || '<tr><td colspan="8" class="empty">ບໍ່ມີຂໍ້ມູນໃນອາທິດນີ້</td></tr>';
}

// PART SHORT REQUEST - Spare Part
function renderLifecycle() {
  let body = document.getElementById("lifeRows");
  if (!body) return;

  let all = (typeof DEFAULT_PART_SHORT_REQUESTS !== "undefined" && DEFAULT_PART_SHORT_REQUESTS.length)
    ? JSON.parse(JSON.stringify(DEFAULT_PART_SHORT_REQUESTS))
    : JSON.parse(localStorage.getItem("weeklyPartsShortRequests") || "[]");

  // Also merge with any newly saved short requests
  try {
    let saved = JSON.parse(localStorage.getItem("weeklyPartsShortRequests") || "[]");
    if (saved.length) {
      all = saved;
    }
  } catch {}

  let week = sel.value,
    weekEnd = "";
  if (week) {
    let d = new Date(week + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 7);
    weekEnd = d.toISOString().slice(0, 10);
  }

  // Filter display week only
  let visible = all.filter((x) => {
    if (!week) return true;
    let dOut = x.dateOut ? x.dateOut.slice(0, 10) : "";
    let dIn = x.dateIn ? x.dateIn.slice(0, 10) : "";
    return (dOut && dOut >= week && dOut < weekEnd) || (dIn && dIn >= week && dIn < weekEnd) || !dOut;
  });

  // Sort Min to Max by MIC PART ID CODE
  visible.sort(comparePartCode);

  let q = (document.getElementById("lifeSearch")?.value || "").toLowerCase();
  let shown = visible.filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q),
  );

  document.getElementById("lifeTitle").textContent =
    "PART SHORT REQUEST - Spare Part this week";
  document.getElementById("lifeCount").textContent = shown.length + " ລາຍການ";

  let qty = shown.reduce((n, x) => n + (Number(x.qty) || 0), 0),
    banks = {};
  shown.forEach((x) => (banks[x.bank] = (banks[x.bank] || 0) + 1));

  document.getElementById("lifeKpis").innerHTML =
    kpi("ລາຍການ Part Short", shown.length, "ຄຳຮ້ອງຂໍໃນອາທິດ") +
    kpi("ຈຳນວນອາໄຫຼ່", qty, "ຊິ້ນ") +
    kpi("ທະນາຄານ", Object.keys(banks).length, "ແຫ່ງ");

  body.innerHTML =
    shown
      .map((x) => {
        let age = x.dateOut
          ? Math.max(
              0,
              Math.floor(
                ((x.dateIn ? new Date(x.dateIn + "T00:00:00Z") : new Date()) -
                  new Date(x.dateOut + "T00:00:00Z")) /
                  86400000,
              ),
            )
          : (x.age || 0);

        let typeBadge = classifyPartCode(x.code || x.micPartCode, x.part || x.name);

        return `<tr>
          <td>${esc(x.code || x.micPartCode || "")}</td>
          <td><b>${esc(x.part || x.name || "")}</b></td>
          <td><span class="tag-badge ${typeBadge.toLowerCase()}">${esc(typeBadge)}</span></td>
          <td>${esc(x.bank || "")}</td>
          <td>${fmtDate(x.dateOut)}</td>
          <td>${fmtDate(x.dateIn)}</td>
          <td>${age} ມື້</td>
          <td>${esc(x.qty || 1)}</td>
          <td>${esc(x.error || "")}</td>
          <td>${esc(x.serial || "")}</td>
          <td>${esc(x.location || "")}</td>
          <td>${esc(x.fixBy || "")}</td>
          <td>${esc(x.remarks || "")}</td>
        </tr>`;
      })
      .join("") ||
    '<tr><td colspan="13" class="empty">ບໍ່ມີຂໍ້ມູນໃນອາທິດນີ້</td></tr>';
}

function exportReportBackup() {
  let data = {};
  for (let i = 0; i < localStorage.length; i++) {
    let k = localStorage.key(i);
    if (k && (k.startsWith("weeklyParts") || k.startsWith("weeklyReport")))
      data[k] = localStorage.getItem(k);
  }
  let payload = {
    app: "Rework Weekly Report",
    version: 1,
    savedAt: new Date().toISOString(),
    data,
  };
  let blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download =
    "rework-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById("backupStatus").textContent = "ດາວໂຫຼດໄຟລ໌ສຳຮອງແລ້ວ";
}

function importReportBackup(file) {
  let status = document.getElementById("backupStatus"),
    reader = new FileReader();
  reader.onload = () => {
    try {
      let backup = JSON.parse(reader.result);
      if (
        !backup ||
        backup.app !== "Rework Weekly Report" ||
        !backup.data ||
        typeof backup.data !== "object"
      )
        throw Error("invalid");
      if (
        !confirm("ການໂຫຼດສຳຮອງຈະແທນທີ່ຂໍ້ມູນທີ່ມີໃນ browser ນີ້. ດຳເນີນຕໍ່ບໍ?")
      )
        return;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        let k = localStorage.key(i);
        if (k && (k.startsWith("weeklyParts") || k.startsWith("weeklyReport")))
          localStorage.removeItem(k);
      }
      for (let [k, v] of Object.entries(backup.data)) {
        if (
          (k.startsWith("weeklyParts") || k.startsWith("weeklyReport")) &&
          typeof v === "string"
        )
          localStorage.setItem(k, v);
      }
      location.reload();
    } catch (e) {
      status.textContent = "ໄຟລ໌ສຳຮອງບໍ່ຖືກຕ້ອງ";
    }
  };
  reader.readAsText(file);
}

function applySummaryColumnColor(header, colorId) {
  let table = document.querySelector("#weeklySummary table");
  if (!table) return;
  let heads = [...table.querySelectorAll("thead th")],
    index = heads.findIndex(
      (th) => th.textContent.trim().toLowerCase() === header.toLowerCase(),
    );
  if (index < 0) return;
  let color = document.getElementById(colorId)?.value || "#ffffff";
  heads[index].style.backgroundColor = color;
  table.querySelectorAll("tbody tr").forEach((row) => {
    if (row.children[index]) row.children[index].style.backgroundColor = color;
  });
}

function applyRwLaoColor() {
  applySummaryColumnColor("RW_LAO", "rwLaoColor");
  applySummaryColumnColor("Part In/Fix this week", "partInFixColor");
}

function saveSummaryCell(el) {
  let summary = WEEKLY_SUMMARY.find((x) => x.week === sel.value);
  if (!summary) return;
  let r = Number(el.dataset.row),
    c = Number(el.dataset.col);
  if (!summary.rows[r] || c < 1 || c >= summary.rows[r].length) return;
  summary.rows[r][c] = el.textContent.trim();
  try {
    localStorage.setItem(
      "weeklyPartsSummaryData",
      JSON.stringify(WEEKLY_SUMMARY),
    );
  } catch {}
}

function render() {
  let weeklySummary = document.getElementById("weeklySummary"),
    summaryNav = document.getElementById("summaryNav"),
    summary = WEEKLY_SUMMARY.find((x) => x.week === sel.value),
    showWeeklySummary = !!summary;
  if (weeklySummary) weeklySummary.hidden = !showWeeklySummary;
  if (summaryNav) summaryNav.hidden = !showWeeklySummary;
  if (summary) {
    document.getElementById("summaryTitle").textContent =
      "Rework weekly summary";
    document.getElementById("summaryHead").innerHTML =
      "<tr>" +
      summary.headers.map((x) => "<th>" + esc(x) + "</th>").join("") +
      "</tr>";
    document.getElementById("summaryRows").innerHTML = summary.rows
      .map(
        (row, ri) =>
          "<tr>" +
          row
            .map((v, ci) =>
              ci === 0
                ? "<td><b>" + esc(v) + "</b></td>"
                : '<td><span class="summary-edit" contenteditable="true" role="textbox" aria-label="Edit summary value" data-row="' +
                  ri +
                  '" data-col="' +
                  ci +
                  '">' +
                  esc(v) +
                  "</span></td>",
            )
            .join("") +
          "</tr>",
      )
      .join("");
    applyRwLaoColor();
  }

  let d = current(),
    items = d.in,
    fix = d.fix;

  document.getElementById("inLookup").innerHTML = partLookup(
    document.getElementById("insearch").value,
    d,
  );
  document.getElementById("fixLookup").innerHTML = partLookup(
    document.getElementById("fixsearch").value,
    d,
  );

  let hasManualCategoryTotals = manualInTotals && sel.value === "2026-11-02",
    hasManualFixTotals = manualFixTotals && sel.value === "2026-11-02";

  let inUnits = items.reduce((s, x) => s + x.qty, 0),
    names = new Set(items.map((x) => x.name)),
    banks = {};
  items.forEach((x) => {
    let b = x.from || x.bank || "ບໍ່ລະບຸ";
    banks[b] = (banks[b] || 0) + x.qty;
  });

  let typeUnits = {
    ELECTRONIC: { qty: 0, parts: new Set() },
    "Wear/Tear": { qty: 0, parts: new Set() },
    HCS: { qty: 0, parts: new Set() },
  };

  items.forEach((x) => {
    let t = getClass(x.code, x.name) || "ELECTRONIC";
    if (!typeUnits[t]) typeUnits[t] = { qty: 0, parts: new Set() };
    typeUnits[t].qty += x.qty;
    typeUnits[t].parts.add(x.name);
  });

  if (hasManualCategoryTotals) {
    typeUnits.ELECTRONIC = { qty: 48, parts: names };
    typeUnits["Wear/Tear"] = { qty: 61, parts: new Set() };
  }

  let cardReaderQty = items
    .filter((x) => /card reader/i.test(x.name))
    .reduce((s, x) => s + x.qty, 0);

  document.getElementById("inkpis").innerHTML =
    kpi(
      "ຈຳນວນຮັບເຂົ້າ",
      hasManualCategoryTotals ? 109 : inUnits,
      hasManualCategoryTotals ? "Electronic + Wear/Tear" : "ຊິ້ນທັງໝົດ",
    ) +
    kpi(
      "ELECTRONIC",
      hasManualCategoryTotals ? 48 : typeUnits.ELECTRONIC.qty,
      "ຊິ້ນ",
    ) +
    kpi(
      "Wear/Tear",
      hasManualCategoryTotals ? 61 : typeUnits["Wear/Tear"].qty,
      "ຊິ້ນ",
    ) +
    kpi("Card Reader", cardReaderQty, "ຊິ້ນໃນລາຍການ") +
    kpi("ລາຍການເຂົ້າ", items.length, "ແຖວຂໍ້ມູນ");

  document.getElementById("banks").innerHTML = barRows(banks);
  document.getElementById("types").innerHTML = typeSummary(
    typeUnits,
    hasManualCategoryTotals ? 109 : null,
  );

  // Render Part In Table:
  // Ticket, Date Time, From, MIC PART ID CODE, PART NAME, Store Name, Type, Quantity, Purpose, Remark
  let it = document.getElementById("intable"),
    q = document.getElementById("insearch").value.toLowerCase();

  let filteredIn = items
    .filter((x) =>
      (
        (x.name || "") +
        (x.code || "") +
        (x.from || "") +
        (x.bank || "") +
        (x.storeName || "") +
        (x.source || "") +
        (x.purpose || "") +
        (x.ticket || "")
      )
        .toLowerCase()
        .includes(q),
    );

  it.innerHTML =
    filteredIn
      .map(
        (x) =>
          `<tr>
            <td>${esc(x.ticket || "")}</td>
            <td>${fmtDate(x.date)}</td>
            <td>${esc(x.from || x.bank || "")}</td>
            <td><b>${esc(x.code || "")}</b></td>
            <td><b>${esc(x.name)}</b></td>
            <td>${esc(x.storeName || "Lao-Defective")}</td>
            <td>${clsSelect(x.code, x.name)}</td>
            <td><b>${x.qty}</b></td>
            <td>${esc(x.purpose || "")}</td>
            <td>${esc(x.remark || x.source || "")}</td>
          </tr>`,
      )
      .join("") || '<tr><td colspan="10" class="empty">ບໍ່ພົບລາຍການ</td></tr>';

  // Render Part Fix Table:
  // Date, MIC PART ID CODE, PART NAME, Type, Sender, From Store, To Store, Quantity, Status, Purpose, Remark, Ticket
  let fUnits = fix.reduce((s, x) => s + x.qty, 0),
    fNames = new Set(fix.map((x) => x.name)),
    tech = {},
    fc = {
      ELECTRONIC: { qty: 0, parts: new Set() },
      "Wear/Tear": { qty: 0, parts: new Set() },
      HCS: { qty: 0, parts: new Set() },
    };

  fix.forEach((x) => {
    let sender = x.sender || x.who || "ບໍ່ລະບຸ";
    tech[sender] = (tech[sender] || 0) + x.qty;
    let t = getClass(x.code, x.name) || "ELECTRONIC";
    if (!fc[t]) fc[t] = { qty: 0, parts: new Set() };
    fc[t].qty += x.qty;
    fc[t].parts.add(x.name);
  });

  document.getElementById("fixkpis").innerHTML =
    kpi("ສ້ອມ/ນຳໃຊ້ໄດ້", fUnits, "ຊິ້ນຍ້າຍເຂົ້າ Lao-usable") +
    kpi("ລາຍການສ້ອມ", fix.length, "ແຖວຢືນຢັນ") +
    kpi("ຊື່ອາໄຫຼ່", fNames.size, "ປະເພດບໍ່ຊ້ຳ") +
    kpi("ຜູ້ສ້ອມ", Object.keys(tech).length, "ຄົນ/ຊື່ທີ່ລະບຸ");

  document.getElementById("techs").innerHTML = barRows(tech, "teal");
  document.getElementById("fixtypes").innerHTML = fixTypeSummary(
    fc,
    hasManualFixTotals,
  );

  let ft = document.getElementById("fixtable"),
    fq = document.getElementById("fixsearch").value.toLowerCase();

  let filteredFix = fix
    .filter((x) =>
      (
        (x.name || "") +
        (x.code || "") +
        (x.sender || "") +
        (x.who || "") +
        (x.fromStore || "") +
        (x.toStore || "") +
        (x.purpose || "") +
        (x.remark || "") +
        (x.work || "") +
        (x.ticket || "")
      )
        .toLowerCase()
        .includes(fq),
    );

  ft.innerHTML =
    filteredFix
      .map(
        (x) =>
          `<tr>
            <td>${fmtDate(x.date)}</td>
            <td><b>${esc(x.code || "")}</b></td>
            <td><b>${esc(x.name)}</b></td>
            <td>${clsSelect(x.code, x.name)}</td>
            <td>${esc(x.sender || x.who || "")}</td>
            <td>${esc(x.fromStore || "Lao-Rework")}</td>
            <td>${esc(x.toStore || "Lao-Usable")}</td>
            <td><b>${x.qty}</b></td>
            <td><span class="status-confirmed">${esc(x.status || "Confirmed")}</span></td>
            <td>${esc(x.purpose || "")}</td>
            <td>${esc(x.remark || x.work || "")}</td>
            <td>${esc(x.ticket || "")}</td>
          </tr>`,
      )
      .join("") || '<tr><td colspan="12" class="empty">ບໍ່ພົບລາຍການ</td></tr>';
}

function switchTab(targetId) {
  if (!targetId) targetId = "in";
  targetId = targetId.replace(/^#/, "");

  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;

  // Toggle active class on sections
  document.querySelectorAll(".section").forEach((sec) => {
    if (sec.id === targetId) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  // Toggle active class on tab links in nav.tabs
  document.querySelectorAll("nav.tabs .tab").forEach((tab) => {
    const href = tab.getAttribute("href") || "";
    if (href === `#${targetId}`) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

// Bind click handlers for navigation tabs
document.querySelectorAll("nav.tabs .tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const href = tab.getAttribute("href");
    if (href && href.startsWith("#")) {
      switchTab(href.slice(1));
    }
  });
});

// Support URL hash changes and direct links with hash
window.addEventListener("hashchange", () => {
  if (location.hash) {
    switchTab(location.hash);
  }
});

// Initialize active tab from location hash if present
if (location.hash) {
  switchTab(location.hash);
}

sel.onchange = () => {
  render();
  renderLifecycle();
  renderService();
};

document.getElementById("insearch").oninput = render;
document.getElementById("fixsearch").oninput = render;

document
  .getElementById("uploadIn")
  .addEventListener("change", (e) => handleSectionUpload(e, "in"));
document
  .getElementById("uploadFix")
  .addEventListener("change", (e) => handleSectionUpload(e, "fix"));
document
  .getElementById("uploadSummary")
  .addEventListener("change", (e) => handleSectionUpload(e, "summary"));
document
  .getElementById("uploadService")
  .addEventListener("change", (e) => handleSectionUpload(e, "service"));

for (const [id, key] of [
  ["rwLaoColor", "weeklyReportRwLaoColor"],
  ["partInFixColor", "weeklyReportPartInFixColor"],
]) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", (e) => {
      try {
        localStorage.setItem(key, e.target.value);
      } catch {}
      applyRwLaoColor();
    });
  }
}

document
  .getElementById("saveBackup")
  ?.addEventListener("click", exportReportBackup);
document.getElementById("restoreBackup")?.addEventListener("change", (e) => {
  if (e.target.files && e.target.files[0])
    importReportBackup(e.target.files[0]);
  e.target.value = "";
});

document.getElementById("summaryRows")?.addEventListener("focusout", (e) => {
  let cell = e.target.closest(".summary-edit");
  if (cell) saveSummaryCell(cell);
});

document.getElementById("lifeSearch")?.addEventListener("input", () => {
  try {
    renderLifecycle();
  } catch {}
});

try {
  render();
} catch (e) {
  let f = document.getElementById("reportFoot");
  if (f) f.textContent = "Report display error: " + (e?.message || e);
  console.error(e);
}

try {
  renderLifecycle();
} catch (e) {
  console.error(e);
}

try {
  renderService();
} catch (e) {
  console.error(e);
}
