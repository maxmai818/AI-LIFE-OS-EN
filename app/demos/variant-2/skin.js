/* AI Life OS · application-layer frontend
   Skin = variant 2 design mockup; interaction = frictionless capture v0.2 (Max's 2026-11-15 feedback):
   the user just speaks plainly + taps "Yes / No"; the Five Life Dimensions direction/degree are filled in by AI on feel,
   with hard metrics folded into the details; corrections are spoken (natural language), not dropdowns.
   INV: raw text must never be rewritten; candidates count only after confirmation; no total score across the five dimensions; no evidence means unknown. */
const API = (p, method = 'GET', body) => fetch(p, {
  method, headers: { 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined,
}).then(async r => { if (!r.ok) throw new Error((await r.json()).detail || r.status); return r.json(); });

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = id => document.getElementById(id);

/* ---------- data model → skin vocabulary ---------- */
const DIM_META = {
  time: { name: 'Time', en: 'TIME' },
  health: { name: 'Health', en: 'HEALTH' },
  wealth: { name: 'Wealth', en: 'WEALTH' },
  relationship: { name: 'Relationship', en: 'RELATIONSHIP' },
  purpose: { name: 'Purpose', en: 'PURPOSE' },
};
const DIR_LABEL = { positive: 'positive', negative: 'negative', mixed: 'mixed', neutral: 'neutral', unknown: 'unknown' };
const DIR_CLS = { positive: 'dir-pos', negative: 'dir-neg', mixed: 'dir-mix', neutral: 'dir-neu', unknown: 'dir-unk' };
const BADGE = {
  proposed: ['pending', 'Awaiting confirmation'],
  confirmed: ['confirmed', 'Confirmed · included in long-term analysis'],
  modified: ['edited', 'Revised as you said'],
  rejected: ['deleted', 'Deleted · excluded from analysis'],
  unresolved: ['later', 'Decide later'],
};

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- plain-language summary: AI concludes on feel; hard metrics stay in the details ---------- */
function humanSummary(items) {
  const parts = [];
  for (const it of items) {
    for (const imp of it.impacts) {
      if (imp.direction === 'unknown' || imp.direction === 'neutral') continue;
      const word = { positive: 'is a plus', negative: 'is a bit draining', mixed: 'cuts both ways' }[imp.direction];
      parts.push(`${DIM_META[imp.dimension_key].name} ${word}${imp.degree ? `, about ${imp.degree} points` : ''}`);
    }
  }
  const top = [...new Set(parts)].slice(0, 2).join('; ');
  const n = items.length === 1 ? '' : `${items.length} entries in total. `;
  return top
    ? `${n}Here's the gist: ${top}. I've broken down the details — just glance over them and tell me if this is right.`
    : `${n}Nothing here needs to be broken into metrics, so I'll just keep it as-is.`;
}

/* ---------- degree rows (only in details; isomorphic to the design mockup's degreesHtml) ---------- */
function degreesHtml(imp) {
  const d = imp.direction;
  if (d === 'unknown') return '<div class="degrees"><span class="deg-label" style="margin:0">No evidence — no guessing</span></div>';
  if (d === 'neutral') return '<div class="degrees"><span class="deg-label" style="margin:0">neutral · degree left blank</span></div>';
  if (d === 'mixed') {
    let h = '<div class="degrees">';
    h += '<span class="deg-label" style="margin:0 2px 0 0">Pos</span>';
    for (let i = 1; i <= 5; i++) h += `<i class="${i <= (imp.degree_positive || 0) ? 'on pos' : ''}"></i>`;
    h += `<span class="deg-label" style="margin:0 6px 0 3px">${imp.degree_positive ?? '—'}</span>`;
    h += '<span class="deg-label" style="margin:0 2px 0 0">Neg</span>';
    for (let i = 1; i <= 5; i++) h += `<i class="${i <= (imp.degree_negative || 0) ? 'on neg' : ''}"></i>`;
    h += `<span class="deg-label" style="margin-left:3px">${imp.degree_negative ?? '—'}</span></div>`;
    return h;
  }
  let h = '<div class="degrees">';
  const cls = d === 'positive' ? 'on pos' : d === 'negative' ? 'on neg' : 'on';
  for (let i = 1; i <= 5; i++) h += `<i class="${i <= (imp.degree || 0) ? cls : ''}"></i>`;
  h += `<span class="deg-label">${imp.degree ?? '—'} / 5</span></div>`;
  return h;
}

function aiMsg(inner, wide, cls) {
  return `<div class="msg ai ${cls || ''}"><div class="avatar">AI</div><div style="flex:1">
    <div class="bubble${wide ? ' wide' : ''}">${inner}</div></div></div>`;
}

/* ---------- skeleton screen (loading placeholder, no fake progress) ---------- */
function skeletonHtml(n) {
  return Array.from({ length: n }, () =>
    `<div class="sk-card"><div class="sk-bar w40"></div><div class="sk-bar w80"></div><div class="sk-bar w60"></div></div>`
  ).join('');
}

function scrollBottom() {
  requestAnimationFrame(() => window.scrollTo(0, document.body.scrollHeight));
}

/* ---------- one card = the organized result of one capture ---------- */
function captureCard(c, items) {
  const anyPending = items.some(it => ['proposed', 'unresolved'].includes(it.status));
  const mainAct = anyPending ? `
    <div class="actions big">
      <button class="btn btn-primary" onclick="confirmAll(${c.id})">Yes, that's right</button>
      <button class="btn btn-ghost" onclick="toggleDetails(${c.id})">Not quite</button>
    </div>` : `
    <div class="badge-row"><span class="badge confirmed">Confirmed · included in long-term analysis</span></div>
    <div class="actions"><button class="btn btn-line" onclick="toggleDetails(${c.id})">View / edit</button></div>`;
  const itemRows = items.map(it => {
    const [cls, label] = BADGE[it.status] || BADGE.proposed;
    return `<div class="mini-item">
      <div class="card-title"><b>${esc(it.text_value)}</b><span class="badge ${cls}">${label}</span></div>
      ${it.impacts.map(imp => `
        <div class="impact-row">
          <div class="dim">${DIM_META[imp.dimension_key]?.name || imp.dimension_key}<span>${DIM_META[imp.dimension_key]?.en || ''}</span></div>
          <span class="dir-chip ${DIR_CLS[imp.direction]}">${DIR_LABEL[imp.direction]}</span>
          ${degreesHtml(imp)}
        </div>`).join('')}
      ${it.status !== 'rejected' ? `<div class="actions">
        <button class="btn btn-line" onclick="itemAct(${it.id},'later')">Leave this one for later</button>
        <button class="btn btn-danger" data-del="${it.id}" onclick="askDelete(${it.id})">Delete</button>
      </div>` : ''}
    </div>`;
  }).join('');
  return `<div class="card" id="cap-${c.id}">
    <div class="human-summary">${esc(humanSummary(items))}</div>
    <div class="quote"><div class="tag">Your own words</div>"${esc(c.raw_text)}"</div>
    ${mainAct}
    <div class="details" id="details-${c.id}" style="display:none">
      <div class="edit-hint">Here's how AI broke it down (the hard metrics are just a reference — if it's off, just say so):</div>
      ${itemRows}
      <div class="correct-box">
        <input placeholder="What's not right? Say it plainly (e.g. the degree isn't that strong / actually I feel a bit tired)"
               onkeydown="if(event.key==='Enter')correctCapture(${c.id},this)">
        <button class="btn btn-primary" onclick="correctCapture(${c.id}, this.previousElementSibling)">Change it as I said</button>
      </div>
    </div>
  </div>`;
}

function toggleDetails(cid) {
  const e = $('details-' + cid);
  e.style.display = e.style.display === 'none' ? 'block' : 'none';
  if (e.style.display === 'block') e.querySelector('.correct-box input')?.focus();
}

async function confirmAll(cid) {
  const { items } = await API(`/demo-api/v2/captures/${cid}/items`);
  for (const it of items) {
    if (['proposed', 'unresolved'].includes(it.status)) {
      await API(`/demo-api/v2/items/${it.id}/confirm`, 'POST');
    }
  }
  toast('Done, confirmed. Your original words are always kept');
  loadChat();
}

async function correctCapture(cid, input) {
  const fb = input.value.trim();
  if (!fb) return;
  input.value = '';
  const { items } = await API(`/demo-api/v2/captures/${cid}/items`);
  let changed = 0;
  for (const it of items) {
    if (it.status === 'rejected') continue;
    const r = await API(`/demo-api/v2/items/${it.id}/correct`, 'POST', { feedback: fb });
    changed += (r.changed || []).length;
  }
  toast(changed ? `Done — changed ${changed} place(s) as you said (AI's original values kept for reference)` : 'Feedback noted; nothing could be safely changed — I don\'t guess');
  loadChat();
}

/* ================= chat ================= */
async function loadChat() {
  const stream = $('chat-stream');
  const first = !stream.dataset.loaded;
  if (first) stream.innerHTML = skeletonHtml(2); // skeleton on first load
  const { captures } = await API('/demo-api/v2/captures');
  if (!captures.length) {
    stream.dataset.loaded = '';
    stream.innerHTML = aiMsg(`<p>Hi, how was your day? <b>Just speak naturally — let AI handle the record-keeping.</b></p>
      <p class="soft">When you're done, just take a look and tap Yes — no need to worry about hard metrics like direction or degree.</p>`);
    return;
  }
  stream.dataset.loaded = '1';
  const parts = [];
  for (const c of captures) {
    const t = (c.captured_at || '').slice(11, 16) || '—';
    parts.push(`<div class="msg user"><div class="bubble">${esc(c.raw_text)}</div><div class="time-stamp">${t}</div></div>`);
    const { items } = await API(`/demo-api/v2/captures/${c.id}/items`);
    if (!items.length) {
      if (c.status === 'saved') {
        parts.push(aiMsg(`<p>Nothing here needs to be broken into metrics, so I'll just keep it as-is. <b>The original text is fully preserved.</b></p>
          <div class="actions"><button class="btn btn-line" onclick="runExtract(${c.id})">Let me try anyway</button></div>`));
      }
      continue;
    }
    parts.push(aiMsg(captureCard(c, items), true));
  }
  stream.innerHTML = parts.join('');
  const sg = $('suggestWrap');
  if (sg) sg.style.display = captures.length ? 'none' : '';
}

async function sendFree() {
  const box = $('captureInput');
  const text = box.value.trim();
  if (!text) return;
  box.value = '';
  box.style.height = 'auto';
  await sendText(text);
  box.focus(); // keep capturing after send; don't dismiss the keyboard
}
function sendPreset(text) { sendText(text); }

function setSendBusy(busy) {
  const btn = $('sendBtn');
  btn.disabled = busy;
  btn.classList.toggle('busy', busy);
}

async function sendText(text) {
  const stream = $('chat-stream');
  if (!stream.dataset.loaded) stream.innerHTML = '';
  stream.dataset.loaded = '1';
  const sg = $('suggestWrap'); if (sg) sg.style.display = 'none';
  const t = new Date().toTimeString().slice(0, 5);
  stream.insertAdjacentHTML('beforeend',
    `<div class="msg user enter"><div class="bubble">${esc(text)}</div><div class="time-stamp">${t}</div></div>`);
  stream.insertAdjacentHTML('beforeend',
    `<div class="msg ai enter" id="thinking"><div class="avatar">AI</div><div style="flex:1">
      <div class="bubble"><div class="typing"><i></i><i></i><i></i></div><p class="soft">Let me organize this…</p></div></div></div>`);
  setSendBusy(true); // disable while sending to prevent double sends
  scrollBottom();
  try {
    const { id } = await API('/demo-api/v2/captures', 'POST', { raw_text: text });
    await API(`/demo-api/v2/captures/${id}/extract`, 'POST');
    const { items } = await API(`/demo-api/v2/captures/${id}/items`);
    $('thinking')?.remove();
    const inner = items.length
      ? captureCard({ id, raw_text: text }, items)
      : `<p>Nothing here needs to be broken into metrics, so I'll just keep it as-is. <b>The original text is fully preserved.</b></p>`;
    stream.insertAdjacentHTML('beforeend', aiMsg(inner, true, 'enter'));
    scrollBottom();
  } catch (e) {
    $('thinking')?.remove();
    toast('Something went wrong: ' + e.message);
  } finally {
    setSendBusy(false);
  }
}

async function runExtract(id) {
  await API(`/demo-api/v2/captures/${id}/extract`, 'POST');
  loadChat();
}

async function itemAct(id, act) {
  await API(`/demo-api/v2/items/${id}/${act}`, 'POST');
  toast(act === 'later' ? 'OK, leaving this one for later' : 'Deleted');
  loadChat();
}

function askDelete(id) {
  const btn = document.querySelector(`[data-del="${id}"]`);
  if (btn.dataset.armed) { itemAct(id, 'reject'); return; }
  btn.dataset.armed = '1'; btn.textContent = 'Click again to delete';
  setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = 'Delete'; } }, 2000);
}

/* ================= five dimensions ================= */
const VERDICT = {
  'Mostly positive evidence': ['var(--green-soft)', 'var(--green)', 'leans supportive'],
  'Mostly negative evidence': ['#F2E2DE', 'var(--danger)', 'leans draining'],
  'Mixed': ['#EFEAE1', 'var(--ink-soft)', 'two-sided'],
  'Evidence without direction': ['#EFEAE1', 'var(--ink-soft)', 'unclear'],
  'Not enough data': ['#EFEAE1', 'var(--ink-soft)', 'too few entries'],
};
const DIM_IC = { time: ['◷', 'var(--blue-soft)'], health: ['🏃', 'var(--green-soft)'], wealth: ['¥', '#F3E7C9'], relationship: ['♥', '#F2E2DE'], purpose: ['✦', '#EDE6F6'] };

async function loadDims() {
  $('dims-list').innerHTML = skeletonHtml(3); // skeleton
  const { dimensions, note } = await API('/demo-api/v2/dimensions');
  $('dims-list').innerHTML = dimensions.map(d => {
    const m = DIM_META[d.key];
    const [bg, fg, label] = VERDICT[d.qualitative] || VERDICT['Not enough data'];
    const avg = d.avg_degree;
    return `<div class="dim-card" onclick="toggleDim(this,event)">
      <div class="head">
        <div class="dim-icon" style="background:${DIM_IC[d.key][1]}">${DIM_IC[d.key][0]}</div>
        <div class="dim-name"><b>${m.name}</b><span>${m.en} · ${d.evidence.length} confirmed entries this period</span></div>
        <div class="dim-verdict" style="background:${bg};color:${fg}">${label}</div>
        <div class="chev">▾</div>
      </div>
      <div class="dim-body">
        <div class="impact-row" style="margin-bottom:2px">
          <div class="dim">Positive<span>DEGREE</span></div>
          <div class="degrees">
            ${[1, 2, 3, 4, 5].map(i => `<i class="${avg && i <= Math.round(avg) ? 'on pos' : ''}"></i>`).join('')}
            <span class="deg-label">${avg ? 'avg ' + avg + ' / 5' : 'Not enough degree data'}</span>
          </div>
        </div>
        ${d.evidence.slice(0, 3).map(e => `
        <div class="evi" onclick="event.stopPropagation();toast('From the original text, unmodified')">
          "${esc(e.text)}" → ${DIR_LABEL[e.direction]}${e.degree ? ' ' + e.degree : ''}
          <div class="src"><span>Confirmed entry #${e.item_id}</span><span>AI judged by feel</span></div>
        </div>`).join('')}
        ${d.unknown ? `<div class="why-box">${d.unknown} more impact(s) are unknown (no guessing, no filling in).</div>` : ''}
      </div>
    </div>`;
  }).join('') + `<div class="quiet-end">${esc(note)}</div>`;
}

function toggleDim(card, ev) {
  card.classList.toggle('open');
}

/* ================= review ================= */
let periodDays = 7;
function pickPeriod(btn, days) {
  periodDays = days;
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

async function startReview(mode) {
  if (mode === 'none') {
    $('rev-step0').innerHTML = `<div class="quiet-end">OK. If you want this week's Five Life Dimensions summary, take your time on the Five Dimensions tab.</div>`;
    return;
  }
  $('rev-step0').classList.add('hidden');
  const stream = $('rev-stream');
  stream.classList.remove('hidden');
  stream.innerHTML = aiMsg(`<p class="soft">Putting together ${periodDays === 1 ? "the last day's" : "this week's"} entries…</p>`);
  try {
    const { review_id } = await API('/demo-api/v2/reviews/generate', 'POST', { review_type: 'weekly', period_days: periodDays });
    const data = await API(`/demo-api/v2/reviews/${review_id}`);
    renderReviewStream(stream, data, mode);
  } catch (e) {
    stream.innerHTML = aiMsg(`<p>Something went wrong: ${esc(e.message)}</p>`);
  }
}

const STMT_KIND = { fact: ['kind-fact', 'Confirmed fact'], calculation: ['kind-fact', 'Calculated'], inference: ['kind-guess', 'Speculation'], theory: ['kind-theory', 'Theory'], recommendation: ['kind-advice', 'Suggestion'], limitation: ['kind-guess', 'Limitation'] };

function renderReviewStream(stream, data, mode) {
  const stmts = data.statements.filter(s =>
    mode === 'facts' ? ['fact', 'calculation', 'limitation'].includes(s.statement_type) : true);
  let html = aiMsg(`<p>This is your ${periodDays === 1 ? "today" : "this week"} review, built from the entries you confirmed. I'll make clear what's fact and what's just my speculation.</p>`);
  html += stmts.map((s, i) => {
    const [kind, klabel] = STMT_KIND[s.statement_type] || STMT_KIND.fact;
    const title = { fact: 'What happened', calculation: 'Progress and deviations', inference: 'My guess (not a fact)', theory: 'A usable perspective', recommendation: 'Suggestion', limitation: 'Not enough data' }[s.statement_type] || 'Review';
    const uncertain = JSON.parse(s.uncertain_points || '[]');
    return `<div class="rev-section">
      <h3><span class="step">${i + 1}</span>${title}<span class="kind-tag ${kind}">${klabel}</span></h3>
      <p>${esc(s.text)}</p>
      ${s.statement_type === 'fact' ? `<div class="fact-line"><span class="dot"></span><span>From entries you confirmed</span><span class="cite" onclick="toast('The evidence comes from your original words, unmodified')">Evidence ↗</span></div>` : ''}
      ${uncertain.length ? `<ul class="limit-list">${uncertain.map(u => `<li>${esc(u)}</li>`).join('')}</ul>` : ''}
      ${s.theory && s.theory.length ? s.theory.map(t => `
        <div class="why-box">
          <b>Basis:</b> ${esc(t.author)}, "${esc(t.source_title)}"${t.year ? ` (${t.year})` : ''}
          ${t.citation ? `<br>${esc(t.citation)}` : ''}
          ${t.assumption_boundary ? `<br><b>Applicability:</b> ${esc(t.assumption_boundary)}` : ''}
          <span class="cite" onclick="toast('Citations can be checked at any time')">View source ↗</span>
        </div>`).join('') : ''}
    </div>`;
  }).join('');
  const rec = data.recommendations[0];
  if (mode === 'guided') {
    if (rec) {
      html += aiMsg(`<p>If you were to change just one small thing this ${periodDays === 1 ? "day" : "week"}, I'd suggest:</p>`);
      html += `<div class="obc">
        <h3>ONE BIG CHANGE</h3>
        <div class="sub">Zero or one · your call</div>
        <p><b>${esc(rec.text)}</b></p>
        ${rec.reason ? `<p class="soft">Reason in brief: ${esc(rec.reason)} This is just a suggestion, not a command.</p>` : ''}
        ${rec.unknowns ? `<div class="why-box"><b>Uncertainties:</b> ${esc(rec.unknowns)}</div>` : ''}
        <div class="actions">
          <button class="btn btn-primary" onclick="obcResolve(${rec.id},'accepted')">Accept</button>
          <button class="btn btn-ghost" onclick="obcEdit(${rec.id})">Edit it</button>
          <button class="btn btn-line" onclick="obcResolve(${rec.id},'rejected')">Not this one</button>
        </div>
      </div>`;
    } else {
      html += aiMsg(`<p>No suggestion this period — "no change needed this time" is a valid outcome, and won't turn into a hidden to-do.</p>`);
    }
    html += feedbackStepHtml(data.review.id);
  }
  stream.innerHTML = html;
}

function feedbackStepHtml(reviewId) {
  return `<div class="rev-section">
    <h3>A couple of words (optional)</h3>
    <div class="feedback-row">
      <button class="fb" onclick="markFb(this)">Accurate</button>
      <button class="fb" onclick="markFb(this)">Inaccurate</button>
      <button class="fb" onclick="markFb(this)">Helpful</button>
      <button class="fb" onclick="markFb(this)">Not helpful</button>
      <button class="fb" onclick="markFb(this)">Well-grounded</button>
      <button class="fb" onclick="markFb(this)">Not grounded</button>
    </div>
    <textarea class="fb-text" rows="2" placeholder="Add specifics (optional)"></textarea>
    <div class="actions">
      <button class="btn btn-primary" onclick="finishReview(${reviewId})">Done</button>
    </div>
  </div>`;
}

function markFb(btn) { btn.classList.toggle('sel'); }

async function obcResolve(recId, status) {
  await API(`/demo-api/v2/recommendations/${recId}/status`, 'POST', { status });
  toast(status === 'accepted' ? 'OK, just this one change' : 'OK, removed. Zero suggestions won\'t become hidden to-dos');
}
async function obcEdit(recId) {
  const t = prompt('Rewrite it your way:');
  if (!t) return;
  await API(`/demo-api/v2/recommendations/${recId}/status`, 'POST', { status: 'modified' });
  toast('OK, your version stands; my original suggestion is kept in the revision record');
}
async function finishReview(reviewId) {
  const marked = [...document.querySelectorAll('.fb.sel')].map(b => b.textContent.trim());
  const ta = document.querySelector('.fb-text');
  await API(`/demo-api/v2/reviews/${reviewId}/feedback`, 'POST', {
    changed: marked.some(x => ['Helpful', 'Accurate', 'Well-grounded'].includes(x)),
    feedback_text: [marked.join(' / '), ta ? ta.value.trim() : ''].filter(Boolean).join(' · '),
  }).catch(() => {});
  toast('Feedback recorded — it\'s yours');
}

/* ================= me ================= */
async function loadMe() {
  const { goals } = await API('/demo-api/v2/goals');
  $('goal-list').innerHTML = goals.length
    ? goals.map(g => `<div class="goal-row"><b>${esc(g.title)}</b><br>
        <span class="${g.status === 'active' ? 'aligned' : ''}">${g.status === 'active' ? '· In progress' : '· ' + esc(g.status)}</span>
        ${g.metric ? `<br><span style="color:var(--muted);font-size:11.5px">Metric: ${esc(g.metric)}</span>` : ''}</div>`).join('')
    : '<div class="why-box">No core goals yet. Suggestions you accept in reviews become candidate goals.</div>';
}

/* ================= navigation ================= */
const LOADERS = { chat: loadChat, dims: loadDims, review: null, me: loadMe };
function switchTab(tab, btn) {
  ['chat', 'dims', 'review', 'me'].forEach(t => $('screen-' + t).classList.toggle('hidden', t !== tab));
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b === btn));
  $('composer').style.display = tab === 'chat' ? '' : 'none';
  if (LOADERS[tab]) LOADERS[tab]();
  // focus the capture input when its tab opens
  if (tab === 'chat') $('captureInput').focus();
}

/* auto-grow input box */
const box = $('captureInput');
box.addEventListener('input', () => { box.style.height = 'auto'; box.style.height = Math.min(box.scrollHeight, 120) + 'px'; });
box.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFree(); } });

/* ================= keep the keyboard from covering the input (visualViewport) ================= */
function initViewport() {
  const vv = window.visualViewport;
  if (!vv) return;
  const sync = () => {
    const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty('--kb-h', kb + 'px');
    document.body.classList.toggle('kb-open', kb > 60);
    if (kb > 60) scrollBottom(); // make sure the input stays visible when the keyboard pops up
  };
  vv.addEventListener('resize', sync);
  vv.addEventListener('scroll', sync);
  sync();
}

/* ================= startup ================= */
initViewport();
loadChat();
$('captureInput').focus(); // focus the capture input as soon as it opens
scrollBottom();
