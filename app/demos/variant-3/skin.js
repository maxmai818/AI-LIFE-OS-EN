/* ==========================================================================
   AI Life OS · Variant 3 "Card-Stack" live interview demo — skin.js
   Vanilla JS only. All user data flows through the pinned demo API base
   below and nowhere else. Product invariants kept visible in the UI:
   - raw capture text is always shown verbatim ("your own words, unmodified")
   - AI output is provisional until confirmed; "edited" marks every correction
   - unknown ≠ neutral, never inferred from silence
   - the five dimensions are non-zero-sum: no total, no overall score
   - zero-or-one big-change suggestion per review
   ========================================================================== */
'use strict';

const API_BASE = '/demo-api/v3';

/* ---------- tiny helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s === undefined || s === null ? '' : s)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, method, body) {
  const res = await fetch(API_BASE + path, {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data && data.detail ? String(data.detail) : ('Request failed (HTTP ' + res.status + ')'));
    err.status = res.status;
    throw err;
  }
  return data || {};
}

function parseList(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { const x = JSON.parse(v); return Array.isArray(x) ? x : (x ? [x] : []); }
    catch (e) { return v ? [v] : []; }
  }
  return v ? [v] : [];
}

let toastTimer = null;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2300);
}

function openSheet(title, html) {
  $('sheetTitle').textContent = title;
  $('sheetBody').innerHTML = html;
  $('mask').classList.add('show');
  $('sheet').classList.add('show');
}
function closeSheet() {
  $('mask').classList.remove('show');
  $('sheet').classList.remove('show');
}

function fmtTime(iso) {
  const s = String(iso || '');
  return s.length >= 16 ? s.slice(11, 16) : s;
}
function todayLabel() {
  try {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  } catch (e) { return ''; }
}

function stateCardHTML(icon, msg, actLabel, actName) {
  return '<div class="card state-card">' +
    '<div class="big">' + icon + '</div>' +
    '<p class="state-msg">' + esc(msg) + '</p>' +
    (actLabel ? '<button class="btn btn-soft" data-act="' + actName + '">' + esc(actLabel) + '</button>' : '') +
    '</div>';
}
function skeletonHTML(n) {
  let h = '';
  for (let i = 0; i < (n || 2); i++) {
    h += '<div class="card"><div class="skel" style="width:40%"></div><div class="skel" style="width:85%"></div><div class="skel" style="width:65%"></div></div>';
  }
  return h;
}

/* ---------- five dimensions meta + chips ---------- */
const DIMS = [
  { key: 'time', name: 'Time', en: 'TIME', color: '#4C8DFF', soft: '#EAF1FF', ico: '⏳' },
  { key: 'health', name: 'Health', en: 'HEALTH', color: '#2FBF7E', soft: '#E7F7EF', ico: '🌿' },
  { key: 'wealth', name: 'Wealth', en: 'WEALTH', color: '#F5A623', soft: '#FFF4E3', ico: '💰' },
  { key: 'relationship', name: 'Relationship', en: 'RELATIONSHIP', color: '#F2789F', soft: '#FDECF2', ico: '💬' },
  { key: 'purpose', name: 'Purpose', en: 'PURPOSE', color: '#9B6DFF', soft: '#F3F0FF', ico: '🌱' },
];
const DIM_BY_KEY = {};
DIMS.forEach(d => { DIM_BY_KEY[d.key] = d; });

function degDots(n) {
  let h = '<span class="deg">';
  for (let i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? 'f' : '') + '"></i>';
  return h + '</span>';
}

function impactChipHTML(imp, marks) {
  const m = DIM_BY_KEY[imp.dimension_key] || { name: imp.dimension_key };
  const edited = (marks || []).some(x => x.indexOf(String(imp.dimension_key) + '.') === 0)
    ? '<span class="edited-tag">edited</span>' : '';
  const d = imp.direction;
  if (d === 'unknown') return '<div class="imp imp-unk"><span class="imp-name">' + esc(m.name) + '</span>Unknown · no evidence</div>' + edited;
  if (d === 'neutral') return '<div class="imp imp-mid"><span class="imp-name">' + esc(m.name) + '</span>No clear effect</div>' + edited;
  if (d === 'mixed') {
    return '<div class="imp imp-mix"><span class="imp-name">' + esc(m.name) + '</span>Mixed +' +
      esc(imp.degree_positive) + '/−' + esc(imp.degree_negative) + '</div>' + edited;
  }
  const pos = d === 'positive';
  return '<div class="imp ' + (pos ? 'imp-pos' : 'imp-neg') + '"><span class="imp-name">' + esc(m.name) + '</span>' +
    (pos ? 'Positive' : 'Negative') + degDots(imp.degree || 0) + '</div>' + edited;
}

const STATUS_META = {
  proposed: ['chip-pending', 'Awaiting your confirmation'],
  confirmed: ['chip-ok', 'Confirmed'],
  modified: ['chip-info', 'Edited · as you said'],
  rejected: ['chip-gray', 'Deleted'],
  unresolved: ['chip-gray', 'Left for later'],
};
function statusChipHTML(status) {
  const m = STATUS_META[status] || STATUS_META.proposed;
  return '<span class="chip ' + m[0] + '">' + esc(m[1]) + '</span>';
}

function changedFields(changed) {
  return (changed || []).map(c => {
    if (typeof c === 'string') return c;
    if (c && typeof c === 'object') return String(c.field_name || '');
    return '';
  }).filter(Boolean);
}

/* ==========================================================================
   Screen 1 · Capture — conversation stream + AI result cards
   ========================================================================== */
const itemsCache = new Map();   // capture_id -> items
const rawTextCache = new Map(); // capture_id -> verbatim raw text
const marksCache = new Map();   // item_id -> changed field list
const expanded = new Set();     // capture ids whose AI result is open
let sending = false;

function itemCardHTML(it) {
  const marks = marksCache.get(it.id) || [];
  const titleEdited = marks.indexOf('text_value') >= 0 ? '<span class="edited-tag">edited</span>' : '';
  const chips = (it.impacts || []).map(imp => impactChipHTML(imp, marks)).join('');
  const raw = rawTextCache.get(it.capture_id) || '';
  return '' +
    '<div class="stack-item" id="item-' + it.id + '">' +
      '<div class="item-top">' +
        '<div>' +
          '<p class="item-title">' + esc(it.text_value) + titleEdited + '</p>' +
          '<p class="item-meta">' + esc(it.item_type) + (it.confidence !== null && it.confidence !== undefined ? ' · confidence ' + esc(it.confidence) : '') + '</p>' +
        '</div>' +
        '<div class="chip-row">' + statusChipHTML(it.status) + '</div>' +
      '</div>' +
      (it.ai_reason ? '<p class="item-meta" style="margin-top:7px">Why the AI thinks this: ' + esc(it.ai_reason) + '</p>' : '') +
      (raw ? '<div class="quote-snip"><span class="qs-label">Your own words · never rewritten</span>' + esc(raw) + '</div>' : '') +
      '<div class="imp-row">' + chips + '</div>' +
      '<div class="correct-panel hidden" id="corr-' + it.id + '">' +
        '<input type="text" id="corrinput-' + it.id + '" placeholder="Tell the AI plainly what is wrong — e.g. “this was negative, not positive”">' +
        '<div class="act-row">' +
          '<button class="btn btn-soft btn-sm" data-act="correct-item" data-item="' + it.id + '">Change it as I said</button>' +
        '</div>' +
        '<p class="edit-hint">The AI revises only this; the original raw text and the AI’s first values stay in the record.</p>' +
      '</div>' +
      '<div class="act-row">' +
        '<button class="btn btn-ghost btn-sm" data-act="later" data-item="' + it.id + '">Leave for later</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="delete" data-item="' + it.id + '">Delete item</button>' +
      '</div>' +
    '</div>';
}

function resultCardHTML(cap, items) {
  if (!items || !items.length) {
    return '<div class="result-card state-card">' +
      '<div class="big">🗂️</div>' +
      '<p class="state-msg">Nothing extractable here yet — your words are kept exactly as they are, untouched.</p>' +
      '<button class="btn btn-soft" data-act="retry-extract" data-cap="' + cap.id + '">Try extraction again</button>' +
      '</div>';
  }
  const pending = items.filter(it => it.status === 'proposed' || it.status === 'unresolved');
  const head =
    '<div class="result-head">' +
      '<span class="kicker">What the AI understood</span>' +
      '<span class="chip ' + (pending.length ? 'chip-pending' : 'chip-ok') + '">' +
        (pending.length ? 'provisional' : 'confirmed') + '</span>' +
    '</div>';
  const actions = pending.length
    ? '<div class="act-row">' +
        '<button class="btn btn-primary" data-act="confirm-all" data-cap="' + cap.id + '">Yes, that’s right</button>' +
        '<button class="btn btn-soft" data-act="notquite" data-cap="' + cap.id + '">Not quite</button>' +
      '</div>' +
      '<p class="edit-hint">Nothing joins long-term analysis until you confirm it.</p>'
    : '<div class="status-line">' + statusChipHTML('confirmed') +
        ' <span>Confirmed · included in long-term analysis.</span>' +
        '<button class="btn btn-ghost btn-sm" data-act="notquite" data-cap="' + cap.id + '">Something is off</button></div>';
  return '<div class="result-card">' + head + '</div>' +
    items.map(itemCardHTML).join('') +
    '<div class="result-card" style="margin-top:12px">' + actions + '</div>';
}

function convBlockHTML(cap) {
  const open = expanded.has(cap.id);
  const items = itemsCache.get(cap.id);
  let ai;
  if (open && items) ai = resultCardHTML(cap, items);
  else if (open) ai = '<div class="thinking"><span class="dots-anim"><i></i><i></i><i></i></span>Organizing this into structured cards…</div>';
  else ai = '<button class="btn btn-ghost btn-sm" data-act="expand" data-cap="' + cap.id + '">Show what the AI understood ▾</button>';
  return '' +
    '<div class="conv" id="conv-' + cap.id + '">' +
      '<div class="msg user">' +
        '<div class="bubble">' + esc(cap.raw_text) + '</div>' +
        '<div class="time-stamp">' + esc(fmtTime(cap.captured_at)) + '</div>' +
      '</div>' +
      '<div class="msg ai" id="capblock-' + cap.id + '">' + ai + '</div>' +
    '</div>';
}

function renderPending(items) {
  const wrap = $('pending-wrap');
  if (!items.length) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = '' +
    '<div class="pending-panel">' +
      '<span class="kicker">Awaiting confirmation</span>' +
      '<p class="card-sub">These are AI drafts. Confirm what matches, leave the rest for later — unknown stays unknown.</p>' +
      items.map(it => {
        const chips = (it.impacts || []).map(imp => impactChipHTML(imp, [])).join('');
        return '<div class="pending-row">' +
          '<p class="pending-title">' + esc(it.text_value) + '</p>' +
          '<p class="item-meta">' + esc(it.item_type) + (it.confidence !== null && it.confidence !== undefined ? ' · confidence ' + esc(it.confidence) : '') + '</p>' +
          '<div class="imp-row">' + chips + '</div>' +
          '<div class="act-row">' +
            '<button class="btn btn-primary btn-sm" data-act="confirm-one" data-item="' + it.id + '">Confirm</button>' +
            '<button class="btn btn-ghost btn-sm" data-act="reject-one" data-item="' + it.id + '">Reject</button>' +
            '<button class="btn btn-ghost btn-sm" data-act="later" data-item="' + it.id + '">Later</button>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
}

function renderStream(caps) {
  const stream = $('capture-stream');
  if (!caps.length) {
    stream.innerHTML = '<div class="empty-card"><div class="big">🗂️</div>Nothing yet — jot one sentence below.<br>Your own words are saved first; the AI only organizes.</div>';
    return;
  }
  stream.innerHTML = caps.slice().reverse().map(convBlockHTML).join('');
}

async function loadCaptureTab() {
  const stream = $('capture-stream');
  if (!stream.dataset.loaded) stream.innerHTML = skeletonHTML(2);
  try {
    const pend = await api('/pending');
    renderPending((pend && pend.items) || []);
  } catch (e) {
    $('pending-wrap').innerHTML = '';
  }
  try {
    const data = await api('/captures?limit=30');
    const caps = (data && data.captures) || [];
    caps.forEach(c => rawTextCache.set(c.id, c.raw_text));
    renderStream(caps);
    stream.dataset.loaded = '1';
  } catch (e) {
    stream.dataset.loaded = '1';
    stream.innerHTML = stateCardHTML('⚠️', 'Could not load your captures: ' + e.message, 'Try again', 'retry-capture-load');
  }
}

function setSendBusy(busy) {
  const btn = $('sendBtn');
  if (btn) btn.disabled = !!busy;
}

function thinkingHTML() {
  return '<div class="thinking" id="thinkingCard"><span class="dots-anim"><i></i><i></i><i></i></span>' +
    'The AI is organizing this into structured cards — your words are already saved as they are…</div>';
}

async function sendText(text) {
  if (sending || !text.trim()) return;
  sending = true;
  setSendBusy(true);
  const stream = $('capture-stream');
  const empty = stream.querySelector('.empty-card');
  if (empty) empty.remove();
  const t = fmtTime(new Date().toISOString());
  stream.insertAdjacentHTML('beforeend',
    '<div class="conv"><div class="msg user"><div class="bubble">' + esc(text) + '</div>' +
    '<div class="time-stamp">' + esc(t) + '</div></div>' +
    '<div class="msg ai">' + thinkingHTML() + '</div></div>');
  const th = $('thinkingCard');
  if (th) th.scrollIntoView({ block: 'nearest' });

  let capId = null;
  try {
    const created = await api('/captures', 'POST', { raw_text: text });
    capId = created.id;
    rawTextCache.set(capId, text);
    await api('/captures/' + capId + '/extract', 'POST');
    const data = await api('/captures/' + capId + '/items');
    const items = (data && data.items) || [];
    itemsCache.set(capId, items);
    expanded.add(capId);
    const cur = $('thinkingCard');
    if (cur) cur.parentElement.parentElement.remove();
    stream.insertAdjacentHTML('beforeend', convBlockHTML({ id: capId, raw_text: text, captured_at: new Date().toISOString() }));
  } catch (e) {
    const cur = $('thinkingCard');
    if (cur) cur.parentElement.parentElement.remove();
    const retryAct = capId
      ? '<button class="btn btn-soft" data-act="retry-extract" data-cap="' + capId + '">Try extraction again</button>'
      : '<button class="btn btn-soft" data-act="retry-send">Send it again</button>';
    stream.insertAdjacentHTML('beforeend',
      '<div class="conv"><div class="msg user"><div class="bubble">' + esc(text) + '</div></div>' +
      '<div class="msg ai"><div class="result-card state-card">' +
      '<div class="big">⚠️</div>' +
      '<p class="state-msg">The AI step failed: ' + esc(e.message) + '</p>' +
      '<p class="state-msg" style="margin-top:8px">Your words were kept exactly as you wrote them.</p>' +
      retryAct + '</div></div></div>');
  } finally {
    sending = false;
    setSendBusy(false);
    $('captureInput').value = '';
    autosize($('captureInput'));
  }
}

function autosize(ta) {
  if (!ta) return;
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
}

async function refreshCapture(capId) {
  try {
    const data = await api('/captures/' + capId + '/items');
    itemsCache.set(capId, (data && data.items) || []);
  } catch (e) { /* keep the previous cache */ }
  const block = $('capblock-' + capId);
  const cap = { id: capId, raw_text: rawTextCache.get(capId) || '' };
  if (block && expanded.has(capId)) block.innerHTML = resultCardHTML(cap, itemsCache.get(capId) || []);
  try {
    const pend = await api('/pending');
    renderPending((pend && pend.items) || []);
  } catch (e) { /* non-fatal */ }
}

async function actItem(act, itemId) {
  try {
    if (act === 'confirm-one' || act === 'confirm') {
      await api('/items/' + itemId + '/confirm', 'POST');
      toast('Confirmed · this now counts in your five-dimension evidence.');
    } else if (act === 'reject-one' || act === 'delete') {
      await api('/items/' + itemId + '/reject', 'POST');
      toast('Deleted. Your original capture text stays exactly as it is.');
    } else if (act === 'later') {
      await api('/items/' + itemId + '/later', 'POST');
      toast('Kept for later · stays provisional.');
    } else if (act === 'correct-item') {
      const input = $('corrinput-' + itemId);
      const feedback = input ? input.value.trim() : '';
      if (!feedback) { if (input) input.focus(); return; }
      const r = await api('/items/' + itemId + '/correct', 'POST', { feedback: feedback });
      marksCache.set(itemId, changedFields(r && r.changed));
      toast('Changed, as you said — the original values are kept as a revision.');
    }
    if (act !== 'correct-item') marksCache.delete(itemId);
    // find the owning capture via the pending/stream DOM is unreliable — refresh all open blocks
    for (const id of expanded) await refreshCapture(id);
    await loadCaptureTab();
  } catch (e) {
    toast('Could not update: ' + e.message);
  }
}

async function confirmAll(capId) {
  try {
    const items = itemsCache.get(capId) || [];
    const pending = items.filter(it => it.status === 'proposed' || it.status === 'unresolved');
    for (const it of pending) await api('/items/' + it.id + '/confirm', 'POST');
    toast('Confirmed — ' + pending.length + ' item(s) now count in your evidence.');
    await refreshCapture(capId);
    await loadCaptureTab();
  } catch (e) {
    toast('Could not confirm: ' + e.message);
  }
}

/* ==========================================================================
   Screen 2 · Five Dimensions
   ========================================================================== */
const VERDICT = {
  'Mostly positive evidence': ['chip-ok', 'Leans supportive'],
  'Mostly negative evidence': ['chip-neg', 'Leans draining'],
  'Mixed': ['chip-pending', 'Two-sided'],
  'Evidence without direction': ['chip-gray', 'No clear effect'],
  'Not enough data': ['chip-gray', 'Not enough data'],
};
const EVI_STORE = [];

async function loadDims() {
  const list = $('dims-list');
  list.innerHTML = skeletonHTML(3);
  try {
    const data = await api('/dimensions');
    renderDims(data);
  } catch (e) {
    list.innerHTML = stateCardHTML('⚠️', 'Could not load the five dimensions: ' + e.message, 'Try again', 'retry-dims');
    $('dims-foot').textContent = '';
  }
}

function renderDims(data) {
  // server shape: dimensions is a LIST of {key, name, counts, evidence, avg_degree, qualitative}
  const dims = {};
  ((data && data.dimensions) || []).forEach(d => { dims[d.key] = d; });
  const list = $('dims-list');
  EVI_STORE.length = 0;
  let html = '';
  DIMS.forEach(meta => {
    const d = dims[meta.key] || {};
    const v = VERDICT[d.qualitative] || ['chip-gray', 'Not enough evidence yet'];
    const evi = (d.evidence || []).slice(0, 3);
    html += '<div class="card dim-card" style="--dim:' + meta.color + '">' +
      '<div class="dim-head">' +
        '<div class="dim-ico" style="background:' + meta.soft + '">' + meta.ico + '</div>' +
        '<div><p class="dim-name">' + esc(meta.name) + '</p><p class="dim-en">' + esc(meta.en) + '</p></div>' +
        '<div class="chip-row"><span class="chip ' + v[0] + '">' + esc(v[1]) + '</span></div>' +
      '</div>' +
      '<div class="dim-avg">' +
        '<span>Impact degree (avg, your own 1–5)</span>' +
        (d.avg_degree === undefined || d.avg_degree === null
          ? '<span class="chip chip-gray">not enough degree data</span>'
          : degDots(Math.round(d.avg_degree)) + '<span>' + esc(String(d.avg_degree).slice(0, 4)) + ' / 5</span>') +
      '</div>';
    if (!evi.length) {
      html += '<p class="edit-hint" style="margin-top:11px">No confirmed evidence here yet — and that is not a zero.</p>';
    }
    evi.forEach(ev => {
      const idx = EVI_STORE.push(ev) - 1;
      const barColor = ev.direction === 'positive' ? 'var(--dim-' + (meta.key === 'relationship' ? 'rel' : meta.key === 'purpose' ? 'purp' : meta.key) + ')'
        : ev.direction === 'negative' ? 'var(--danger)' : '#CBD2DD';
      html += '<div class="evi-row"><div class="evi-top">' +
        '<div class="evi-bar" style="background:' + barColor + '"></div>' +
        '<p class="evi-text">' + esc(ev.text || ev.text_value) + '</p>' +
        '<button class="evi-btn" data-act="evidence" data-evi="' + idx + '">Evidence ↗</button>' +
        '</div></div>';
    });
    if (d.unknown) {
      html += '<div class="unknown-note">' + esc(String(d.unknown)) +
        ' behavior impact(s) here have no evidence yet — unknown, not neutral.</div>';
    }
    html += '</div>';
  });
  list.innerHTML = html;
  $('dims-foot').innerHTML = esc((data && data.note) || 'Each dimension is judged on its own evidence.') +
    '<br>The five dimensions are non-zero-sum; there is no overall score, no total, no ranking.';
}

/* ==========================================================================
   Screen 3 · Review — the swipeable card stack
   ========================================================================== */
const REVIEW_TYPE = { 1: 'daily', 7: 'weekly', 30: 'monthly' };
const STMT_META = {
  fact: { label: 'Confirmed fact', cls: 'lb-fact', title: 'What happened' },
  calculation: { label: 'Calculated', cls: 'lb-fact', title: 'Progress and deviations' },
  inference: { label: 'Speculation', cls: 'lb-guess', title: 'A guess, not a fact' },
  theory: { label: 'Theory', cls: 'lb-theory', title: 'One perspective worth considering' },
  recommendation: { label: 'Suggestion', cls: 'lb-advice', title: 'Suggestion' },
  limitation: { label: 'Limitation', cls: 'lb-limit', title: 'What I cannot judge' },
};
let periodDays = 7;
let stackIdx = 0;
let reviewState = null;

function stmtCardHTML(s, idx) {
  const m = STMT_META[s.statement_type] || STMT_META.fact;
  const uncertain = parseList(s.uncertain_points);
  let extra = '';
  if (s.statement_type === 'theory' && s.theory) {
    const ths = Array.isArray(s.theory) ? s.theory : [s.theory];
    ths.forEach(t => {
      if (!t) return;
      extra += '<div class="theory-box">' +
        '<b>' + esc(t.author || 'Unknown author') + '</b> · “' + esc(t.source_title || '') + '”' +
        (t.year ? ' (' + esc(t.year) + ')' : '') +
        (t.citation ? '<br>' + esc(t.citation) : '') +
        '<br><b>Applies when:</b> ' + esc(t.assumption_boundary || 'the boundary is not stated — treat with care') +
        (t.verifiability ? '<br><i>' + esc(t.verifiability) + '</i>' : '') +
        '</div>';
    });
  }
  if (uncertain.length) {
    extra += '<div class="uncertain-list"><p class="ul-h">~ Uncertain points</p><ul>' +
      uncertain.map(u => '<li>' + esc(typeof u === 'string' ? u : JSON.stringify(u)) + '</li>').join('') +
      '</ul></div>';
  }
  const evs = parseList(s.supporting_evidence).slice(0, 2);
  if (evs.length) {
    extra += '<div class="facts-strip"><b>From your confirmed captures:</b><br>' +
      evs.map(ev => '· “' + esc(ev && ev.text ? ev.text : String(ev)) + '”').join('<br>') +
      '</div>';
  }
  return '<div class="stack-card">' +
    '<p class="stack-kicker">Review · card ' + (idx + 1) + '</p>' +
    '<p style="margin-top:9px"><span class="lb ' + m.cls + '">' + esc(m.label) + '</span></p>' +
    '<p class="stack-title">' + esc(m.title) + '</p>' +
    '<p class="stack-text">' + esc(s.text) + '</p>' +
    extra +
    '</div>';
}

function obcCardHTML(rec) {
  return '<div class="stack-card"><div class="obc-card" id="obcCard">' +
    '<p class="stack-kicker">One big change · zero or one</p>' +
    '<p class="t">' + esc(rec.text) + '</p>' +
    '<p class="d"><b>Reason:</b> ' + esc(rec.reason) + '</p>' +
    (rec.expected_effect ? '<p class="d"><b>Expected effect:</b> ' + esc(rec.expected_effect) + '</p>' : '') +
    (rec.unknowns ? '<p class="d"><b>Uncertainties:</b> ' + esc(rec.unknowns) + '</p>' : '') +
    '<div id="obcActions">' +
      '<div class="obc-btns">' +
        '<button class="obc-btn" data-act="obc-accept" data-rec="' + rec.id + '">OK, try it</button>' +
        '<button class="obc-btn ghost" data-act="obc-edit" data-rec="' + rec.id + '">I want to adjust it</button>' +
        '<button class="obc-btn ghost" data-act="obc-decline" data-rec="' + rec.id + '">Not this one</button>' +
      '</div>' +
      '<div class="obc-edit hidden" id="obcEdit">' +
        '<input type="text" id="obcEditInput" placeholder="Your version of the one change…">' +
        '<div class="obc-btns">' +
          '<button class="obc-btn" data-act="obc-edit-save" data-rec="' + rec.id + '">Use my version</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>' +
    '<p class="zero-note">Whatever you choose is respected — no hidden to-dos, no repeated follow-ups.</p>' +
    '</div>';
}

function feedbackCardHTML(reviewId) {
  return '<div class="stack-card" id="fbCard">' +
    '<p class="stack-kicker">That is it for this review</p>' +
    '<p class="stack-title">Was this review for you?</p>' +
    '<div class="fb-chips">' +
      '<button class="fb-chip" data-act="fb-match" data-val="yes">This matches</button>' +
      '<button class="fb-chip" data-act="fb-match" data-val="no">This doesn’t match</button>' +
    '</div>' +
    '<textarea class="fb-note" id="fbNote" placeholder="Anything you want to say (optional)"></textarea>' +
    '<div class="act-row">' +
      '<button class="btn btn-primary" data-act="review-finish" data-review="' + reviewId + '">Finish this review</button>' +
    '</div>' +
    '<p class="edit-hint">No score, no streak, no judgment — this only feeds the review’s own notes.</p>' +
    '</div>';
}

function renderReviewStack(data, mode) {
  const stmts = (data.statements || []).filter(s =>
    mode === 'guided' || ['fact', 'calculation', 'limitation'].indexOf(s.statement_type) >= 0);
  // server shape: recommendations is a LIST (zero-or-one per review)
  const recs = data.recommendations || [];
  const rec = recs.length ? recs[0] : null;
  const reviewId = data.review.id;

  let cards = '';
  cards += '<div class="stack-card">' +
    '<p class="stack-kicker">Review · opened by you</p>' +
    '<p class="stack-title">' + (periodDays === 1 ? 'Your day in cards' : periodDays === 7 ? 'Your week in cards' : 'Your month in cards') + '</p>' +
    '<p class="stack-text">' + esc(reviewId ? 'Generated ' + fmtTime(data.review.generated_at) : '') +
    ' · ' + stmts.length + ' statement card(s), one card at a time. Confirmed facts, calculations, guesses and theory are kept strictly apart.</p>' +
    '</div>';
  stmts.forEach((s, i) => { cards += stmtCardHTML(s, i + 1); });
  if (mode === 'guided') {
    cards += rec ? obcCardHTML(rec) :
      '<div class="stack-card"><p class="stack-kicker">One big change · zero or one</p>' +
      '<p class="stack-title">No change needed this time</p>' +
      '<p class="stack-text">“No change needed” is a normal, valid outcome of a review. Nothing to do — and nothing will chase you about it.</p></div>';
  }
  cards += feedbackCardHTML(reviewId);

  $('review-area').innerHTML =
    '<div class="stack-wrap" id="stackWrap">' + cards + '</div>' +
    '<div class="stack-nav">' +
      '<button class="nav-btn" data-act="stack-prev" aria-label="Previous card">‹</button>' +
      '<div class="dots" id="stackDots"></div>' +
      '<button class="nav-btn" data-act="stack-next" aria-label="Next card">›</button>' +
    '</div>' +
    '<p class="swipe-tip">← swipe left / right or use the arrows to flip cards · <span id="stackPos"></span> →</p>';

  reviewState = { reviewId: reviewId, fbChoice: null, recId: rec ? rec.id : null, mode: mode };
  stackIdx = 0;
  updateStack();
  bindSwipe();
}

function stackCards() {
  const w = $('stackWrap');
  return w ? Array.prototype.slice.call(w.querySelectorAll('.stack-card')) : [];
}
function updateStack() {
  const cards = stackCards();
  if (!cards.length) return;
  stackIdx = Math.max(0, Math.min(stackIdx, cards.length - 1));
  cards.forEach((c, i) => c.classList.toggle('active', i === stackIdx));
  const dots = $('stackDots');
  if (dots) {
    dots.innerHTML = cards.map((c, i) => '<span class="d' + (i === stackIdx ? ' on' : '') + '"></span>').join('');
  }
  const pos = $('stackPos');
  if (pos) pos.textContent = (stackIdx + 1) + ' / ' + cards.length;
  const prev = document.querySelector('[data-act="stack-prev"]');
  const next = document.querySelector('[data-act="stack-next"]');
  if (prev) prev.disabled = stackIdx === 0;
  if (next) next.disabled = stackIdx === cards.length - 1;
}
function stackMove(dir) {
  stackIdx += dir;
  updateStack();
}
function bindSwipe() {
  const w = $('stackWrap');
  if (!w) return;
  let x0 = null;
  w.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  w.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) stackMove(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });
}

async function startReview(mode) {
  const area = $('review-area');
  if (mode === 'none') {
    area.innerHTML = '<div class="empty-card"><div class="big">🌙</div>No review for now.<br>No reminders, no notifications, no “you haven’t reviewed” nagging — the system will never open a review on its own.</div>';
    return;
  }
  area.innerHTML = '<div class="card"><div class="thinking"><span class="dots-anim"><i></i><i></i><i></i></span>' +
    'Putting this period’s review together — reading only the evidence you confirmed…</div></div>';
  try {
    const gen = await api('/reviews/generate', 'POST', {
      review_type: REVIEW_TYPE[periodDays] || 'weekly',
      period_days: periodDays,
    });
    const data = await api('/reviews/' + gen.review_id);
    renderReviewStack(data, mode);
  } catch (e) {
    area.innerHTML = stateCardHTML('⚠️', 'The review could not be generated: ' + e.message, 'Try again', 'retry-review');
  }
}

async function obcStatus(recId, status, userText) {
  try {
    await api('/recommendations/' + recId + '/status', 'POST', { status: status });
    const box = $('obcActions');
    if (box) {
      let note = 'Noted. No hidden to-dos and no repeated follow-ups.';
      if (status === 'accepted') note = 'Noted as accepted. It is a suggestion you chose — nothing will chase you about it.';
      if (status === 'modified') {
        note = 'Marked as modified. Your version stands here for this session; the original suggestion stays in the review record as an AI draft.' +
          (userText ? '<br><br><b>Your version:</b> ' + esc(userText) : '');
      }
      box.innerHTML = '<p class="obc-note">' + note + '</p>';
    }
    toast(status === 'accepted' ? 'OK — good luck with it.' : status === 'modified' ? 'Kept your version.' : 'Understood — not this one.');
  } catch (e) {
    toast('Could not save that: ' + e.message);
  }
}

async function finishReview() {
  if (!reviewState) return;
  const note = $('fbNote');
  try {
    await api('/reviews/' + reviewState.reviewId + '/feedback', 'POST', {
      changed: reviewState.fbChoice === 'yes',
      feedback_text: (reviewState.fbChoice ? (reviewState.fbChoice === 'yes' ? 'This matches. ' : 'This does not match. ') : '') + (note ? note.value.trim() : ''),
    });
    const fb = $('fbCard');
    if (fb) {
      fb.innerHTML = '<p class="stack-kicker">Thank you</p>' +
        '<p class="stack-title">Thank you for talking it through.</p>' +
        '<p class="stack-text">Your feedback is stored beside this review. Nothing else happens unless you ask — no follow-ups, no nags.</p>';
    }
    toast('Thank you for talking it through.');
  } catch (e) {
    toast('Could not send feedback: ' + e.message);
  }
}

/* ==========================================================================
   Screen 4 · Me — goals, privacy
   ========================================================================== */
async function loadMe() {
  const list = $('goal-list');
  if (!list.dataset.loaded) list.innerHTML = skeletonHTML(1);
  try {
    const data = await api('/goals');
    renderGoals(data.goals || []);
    list.dataset.loaded = '1';
  } catch (e) {
    list.dataset.loaded = '1';
    list.innerHTML = stateCardHTML('⚠️', 'Could not load your goals: ' + e.message, 'Try again', 'retry-me');
  }
}

const GOAL_STATUS = {
  active: ['chip-info', 'Active'],
  paused: ['chip-gray', 'Set aside'],
  completed: ['chip-ok', 'Completed'],
  draft: ['chip-gray', 'Draft'],
};

function renderGoals(goals) {
  const list = $('goal-list');
  if (!goals.length) {
    list.innerHTML = '<div class="empty-card"><div class="big">🎯</div>No goals yet. That is fine — goals are optional.</div>';
    updateGoalCap(goals);
    return;
  }
  list.innerHTML = goals.map(g => {
    const keys = parseList(g.dimension_keys);
    const chips = keys.map(k => {
      const m = DIM_BY_KEY[k];
      return m ? '<span class="tag on">' + m.ico + ' ' + esc(m.name) + '</span>' : '';
    }).join('');
    const st = GOAL_STATUS[g.status] || GOAL_STATUS.active;
    let acts = '';
    if (g.status === 'active') {
      acts = '<button class="btn btn-soft btn-sm" data-act="goal-status" data-goal="' + g.id + '" data-status="completed">Mark completed</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="goal-status" data-goal="' + g.id + '" data-status="paused">Set aside</button>';
    } else if (g.status === 'paused') {
      acts = '<button class="btn btn-soft btn-sm" data-act="goal-status" data-goal="' + g.id + '" data-status="active">Bring it back</button>';
    } else if (g.status === 'completed') {
      acts = '<button class="btn btn-ghost btn-sm" data-act="goal-status" data-goal="' + g.id + '" data-status="active">Reopen</button>';
    }
    return '<div class="card">' +
      '<div class="item-top">' +
        '<p class="goal-title">' + esc(g.title) + '</p>' +
        '<div class="chip-row"><span class="chip ' + st[0] + '">' + esc(st[1]) + '</span></div>' +
      '</div>' +
      '<div class="tag-row" style="margin-top:9px">' + chips + '</div>' +
      (g.metric ? '<p class="goal-meta">Metric: ' + esc(g.metric) + '</p>' : '') +
      (g.horizon ? '<p class="goal-meta">Horizon: ' + esc(g.horizon) + '</p>' : '') +
      (g.measurable ? '' : '<p class="edit-hint">Qualitative goal — no progress bar, no percentage.</p>') +
      '<div class="act-row">' + acts + '</div>' +
      '</div>';
  }).join('');
  updateGoalCap(goals);
}

function updateGoalCap(goals) {
  const open = (goals || []).filter(g => g.status !== 'completed').length;
  const note = $('goalCapNote');
  const btn = $('goalSave');
  if (note) note.textContent = open >= 3
    ? 'At most 3 core goals at a time (Inv-10) — complete or set one aside to add another.'
    : open + ' of 3 goals in use. Focus beats accumulation.';
  if (btn) btn.disabled = open >= 3;
}

async function goalSave() {
  const title = ($('goalTitle').value || '').trim();
  if (!title) { $('goalTitle').focus(); return; }
  const keys = Array.prototype.slice.call(document.querySelectorAll('#goalDims .tag.on')).map(b => b.dataset.key);
  const metric = ($('goalMetric').value || '').trim();
  const horizon = ($('goalHorizon').value || '').trim();
  try {
    await api('/goals', 'POST', {
      title: title,
      dimension_keys: keys,
      measurable: !!metric,
      metric: metric || null,
      horizon: horizon || null,
    });
    $('goalTitle').value = '';
    $('goalMetric').value = '';
    $('goalHorizon').value = '';
    Array.prototype.slice.call(document.querySelectorAll('#goalDims .tag.on')).forEach(b => b.classList.remove('on'));
    toast('Goal saved.');
    await loadMe();
  } catch (e) {
    toast('Could not save the goal: ' + e.message);
  }
}

async function goalStatus(goalId, status) {
  try {
    await api('/goals/' + goalId + '/status', 'POST', { status: status });
    toast('Goal updated.');
    await loadMe();
  } catch (e) {
    toast('Could not update: ' + e.message);
  }
}

/* ==========================================================================
   Navigation + global event wiring
   ========================================================================== */
const LOADER = {
  capture: loadCaptureTab,
  dims: loadDims,
  review: null,
  me: loadMe,
};
const SCREEN_ID = {
  capture: 'screen-capture',
  dims: 'screen-dims',
  review: 'screen-review',
  me: 'screen-me',
};

function switchTab(tab) {
  if (!SCREEN_ID[tab]) tab = 'capture';
  Object.keys(SCREEN_ID).forEach(k => {
    const s = $(SCREEN_ID[k]);
    if (s) s.classList.toggle('active', k === tab);
  });
  Array.prototype.slice.call(document.querySelectorAll('.tabbar .tab')).forEach(b => {
    const on = b.dataset.tab === tab;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  const composer = $('composer');
  if (composer) composer.style.display = tab === 'capture' ? '' : 'none';
  try { localStorage.setItem('lifeos-v3-tab', tab); } catch (e) { /* private mode */ }
  if (LOADER[tab]) LOADER[tab]();
  const s = $(SCREEN_ID[tab]);
  if (s) s.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

const ACTIONS = {
  'tab': (el) => switchTab(el.dataset.tab),
  'fill': (el) => {
    const ta = $('captureInput');
    ta.value = el.dataset.fill || '';
    autosize(ta);
    ta.focus();
  },
  'send': () => sendText(($('captureInput').value || '').trim()),
  'expand': async (el) => {
    const id = Number(el.dataset.cap);
    if (expanded.has(id)) {
      expanded.delete(id);
    } else {
      expanded.add(id);
      await refreshCapture(id);
    }
    await loadCaptureTab();
  },
  'confirm-all': (el) => confirmAll(Number(el.dataset.cap)),
  'notquite': (el) => {
    const id = el.dataset.cap;
    const block = $('capblock-' + id);
    if (!block) return;
    const panels = block.querySelectorAll('.correct-panel');
    Array.prototype.slice.call(panels).forEach(p => p.classList.remove('hidden'));
    const first = block.querySelector('.correct-panel input');
    if (first) first.focus();
  },
  'correct-item': (el) => actItem('correct-item', Number(el.dataset.item)),
  'confirm-one': (el) => actItem('confirm-one', Number(el.dataset.item)),
  'reject-one': (el) => armThen(el, 'reject-one'),
  'delete': (el) => armThen(el, 'delete'),
  'later': (el) => actItem('later', Number(el.dataset.item)),
  'retry-send': () => {
    const bubbles = document.querySelectorAll('#capture-stream .conv');
    const last = bubbles[bubbles.length - 1];
    const b = last && last.querySelector('.bubble');
    if (b) {
      last.remove();
      sendText(b.textContent);
    }
  },
  'retry-extract': async (el) => {
    const capId = Number(el.dataset.cap);
    try {
      await api('/captures/' + capId + '/extract', 'POST');
      const data = await api('/captures/' + capId + '/items');
      itemsCache.set(capId, (data && data.items) || []);
      expanded.add(capId);
      await loadCaptureTab();
      toast('Extraction succeeded this time.');
    } catch (e) {
      toast('Still failing: ' + e.message);
    }
  },
  'retry-capture-load': loadCaptureTab,
  'retry-dims': loadDims,
  'retry-me': loadMe,
  'retry-review': () => startReview(reviewState ? reviewState.mode : 'guided'),
  'evidence': (el) => {
    const ev = EVI_STORE[Number(el.dataset.evi)];
    if (!ev) return;
    openSheet('Evidence trail',
      '<div class="quote-snip"><span class="qs-label">From your capture · never rewritten</span>' +
      esc(ev.text || ev.text_value) + '</div>' +
      '<p style="margin-top:12px"><b>Direction:</b> ' + esc(ev.direction || 'unknown') +
      (ev.degree ? ' · degree ' + esc(ev.degree) + ' / 5' : '') + '</p>' +
      '<p style="margin-top:8px">This evidence only appears after you confirmed the AI’s item. The original text is kept exactly as you wrote it; only your confirmation made it count.</p>');
  },
  'close-sheet': closeSheet,
  'period': (el) => {
    periodDays = Number(el.dataset.days) || 7;
    Array.prototype.slice.call(document.querySelectorAll('#periodRow .seg-btn')).forEach(b =>
      b.classList.toggle('on', b === el));
  },
  'start-review': (el) => startReview(el.dataset.mode),
  'stack-prev': () => stackMove(-1),
  'stack-next': () => stackMove(1),
  'obc-accept': (el) => obcStatus(Number(el.dataset.rec), 'accepted'),
  'obc-edit': () => {
    const box = $('obcEdit');
    if (box) {
      box.classList.remove('hidden');
      const inp = $('obcEditInput');
      if (inp) inp.focus();
    }
  },
  'obc-edit-save': (el) => {
    const inp = $('obcEditInput');
    const v = inp ? inp.value.trim() : '';
    obcStatus(Number(el.dataset.rec), 'modified', v);
  },
  'obc-decline': (el) => obcStatus(Number(el.dataset.rec), 'rejected'),
  'fb-match': (el) => {
    const val = el.dataset.val;
    if (reviewState) reviewState.fbChoice = reviewState.fbChoice === val ? null : val;
    Array.prototype.slice.call(document.querySelectorAll('.fb-chip')).forEach(c =>
      c.classList.toggle('on', reviewState && c.dataset.val === reviewState.fbChoice));
  },
  'review-finish': finishReview,
  'goal-dim': (el) => el.classList.toggle('on'),
  'goal-save': goalSave,
  'goal-status': (el) => goalStatus(Number(el.dataset.goal), el.dataset.status),
};

/* two-tap arming for destructive item actions */
let armedEl = null;
let armedTimer = null;
function armThen(el, act) {
  if (armedEl === el) {
    clearTimeout(armedTimer);
    armedEl = null;
    actItem(act, Number(el.dataset.item));
    return;
  }
  if (armedEl) {
    armedEl.textContent = armedEl.dataset.label;
    armedEl = null;
    clearTimeout(armedTimer);
  }
  el.dataset.label = el.textContent;
  el.textContent = 'Sure? Tap again';
  el.classList.add('btn-danger');
  armedEl = el;
  armedTimer = setTimeout(() => {
    if (armedEl === el) {
      el.textContent = el.dataset.label;
      el.classList.remove('btn-danger');
      armedEl = null;
    }
  }, 3200);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) {
    e.preventDefault();
    fn(el);
  }
});

/* composer: Enter sends, Shift+Enter breaks the line */
document.addEventListener('DOMContentLoaded', () => {
  $('datePill').textContent = todayLabel();

  const ta = $('captureInput');
  ta.addEventListener('input', () => autosize(ta));
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText((ta.value || '').trim());
    }
  });

  let tab = 'capture';
  try { tab = localStorage.getItem('lifeos-v3-tab') || 'capture'; } catch (e) { /* private mode */ }
  switchTab(tab);
});
