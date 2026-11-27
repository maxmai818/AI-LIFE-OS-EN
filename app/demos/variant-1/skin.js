/* =========================================================
   AI Life OS · Variant 1 "Information Dense" — skin.js
   Vanilla JS. All data flows through the demo API base only.
   Dynamic text is escaped via esc() before any innerHTML use.
   ========================================================= */
'use strict';

/* ---------------- API (demo base only) ---------------- */
var API_BASE = '/demo-api/v1';

function api(path, method, body) {
  return fetch(API_BASE + path, {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  }).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (j) {
      if (!r.ok) throw new Error(j.detail || ('HTTP ' + r.status));
      return j;
    });
  });
}

/* ---------------- tiny helpers ---------------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
function $(id) { return document.getElementById(id); }
function pad2(n) { return String(n); }

var DIMS = {
  time: { name: 'Time', color: 'var(--time)' },
  health: { name: 'Health', color: 'var(--health)' },
  wealth: { name: 'Wealth', color: 'var(--wealth)' },
  relationship: { name: 'Relationship', color: 'var(--rel)' },
  purpose: { name: 'Purpose', color: 'var(--purpose)' }
};
var DIR_LABEL = {
  positive: 'Support', negative: 'Drain', mixed: 'Mixed',
  neutral: 'No clear effect', unknown: 'No evidence / unknown'
};
var DIR_CLS = {
  positive: 'd-pos', negative: 'd-neg', mixed: 'd-mix',
  neutral: 'd-neu', unknown: 'd-unk'
};
var ITEM_BADGE = {
  proposed: ['b-pending', 'Awaiting confirmation'],
  unresolved: ['b-pending', 'Left for later'],
  confirmed: ['b-ok', 'Confirmed'],
  modified: ['b-mod', 'Edited'],
  rejected: ['b-rej', 'Deleted']
};

var state = {
  captures: [], pending: [], goals: [],
  items: {},        // captureId -> items[]
  expanded: {},     // captureId -> bool
  edits: {},        // itemId -> { 'text_value'|'dim.field': oldVal }
  correcting: {},   // itemId -> bool
  periodDays: 7
};
var retryStore = {};  // transient send retries
var toastTimer = null;

function isPending(it) { return it.status === 'proposed' || it.status === 'unresolved'; }

function fmtClock(d) {
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function fmtDay(d) {
  var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + wd;
}
function dayKey(d) {
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
function mmdd(d) {
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return p(d.getMonth() + 1) + '.' + p(d.getDate());
}
function fmtStamp(iso) {
  var d = new Date(iso);
  return isNaN(d) ? '' : fmtClock(d);
}

function toast(msg) {
  var el = $('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('on'); }, 3200);
}
function scrollBottom() {
  requestAnimationFrame(function () { window.scrollTo(0, document.body.scrollHeight); });
}
function syncDock() {
  var dock = $('dock');
  if (dock) document.documentElement.style.setProperty('--dock-h', dock.offsetHeight + 'px');
}

/* ---------------- reusable fragments ---------------- */
function pips(n, tone) {
  var h = '<span class="pips" aria-hidden="true">';
  for (var i = 1; i <= 5; i++) {
    h += '<span class="pip' + (n && i <= n ? ' on' + (tone ? ' ' + tone : '') : '') + '"></span>';
  }
  return h + '</span>';
}
function editedMark(edits, key) {
  if (!Object.prototype.hasOwnProperty.call(edits, key)) return '';
  return '<span class="badge b-mod">edited</span>' +
    '<span class="ai-orig">AI original kept: &ldquo;' + esc(edits[key] == null ? 'blank' : edits[key]) + '&rdquo;</span>';
}
function impactLine(imp, itemId) {
  var dim = DIMS[imp.dimension_key] || { name: imp.dimension_key, color: 'var(--ink-3)' };
  var dir = imp.direction || 'unknown';
  var edits = state.edits[itemId] || {};
  var val = '<span class="dir ' + (DIR_CLS[dir] || 'd-unk') + '">' + esc(DIR_LABEL[dir] || dir) + '</span>';
  if (dir === 'mixed') {
    val += pips(imp.degree_positive, 'pos') +
      '<span class="mono xs muted">Pos ' + (imp.degree_positive == null ? '—' : imp.degree_positive) + '</span>' +
      pips(imp.degree_negative, 'neg') +
      '<span class="mono xs muted">Neg ' + (imp.degree_negative == null ? '—' : imp.degree_negative) + '</span>' +
      editedMark(edits, imp.dimension_key + '.direction') +
      editedMark(edits, imp.dimension_key + '.degree_positive') +
      editedMark(edits, imp.dimension_key + '.degree_negative');
  } else if (dir === 'unknown' || dir === 'neutral') {
    val += '<span class="mono xs muted">Degree: blank</span>' + editedMark(edits, imp.dimension_key + '.direction');
  } else {
    val += pips(imp.degree, dir === 'positive' ? 'pos' : 'neg') +
      '<span class="mono xs muted">' + (imp.degree == null ? 'degree pending' : imp.degree + ' / 5') + '</span>' +
      editedMark(edits, imp.dimension_key + '.degree') +
      editedMark(edits, imp.dimension_key + '.direction');
  }
  if (imp.note) {
    val += '<span class="ev"><q>' + esc(imp.note) + '</q></span>' + editedMark(edits, imp.dimension_key + '.note');
  }
  return '<div class="imp">' +
    '<span class="dot" style="background:' + dim.color + '"></span>' +
    '<span class="dn">' + esc(dim.name) + '</span>' +
    '<span class="val">' + val + '</span></div>';
}
function smallChip(im) {
  var dim = DIMS[im.dimension_key] || { name: im.dimension_key, color: 'var(--ink-3)' };
  return '<span class="chip-static"><span class="dot" style="background:' + dim.color + '"></span>' +
    esc(dim.name) + ' <span class="dir ' + (DIR_CLS[im.direction] || 'd-unk') + '">' +
    esc(DIR_LABEL[im.direction] || im.direction) + '</span></span>';
}
function skeleton(n) {
  var h = '';
  for (var i = 0; i < n; i++) {
    h += '<div class="sk-card"><div class="sk-bar w40"></div><div class="sk-bar w80"></div><div class="sk-bar w60"></div></div>';
  }
  return h;
}
function emptyState(msg) {
  return '<div class="card empty">' + esc(msg) + '</div>';
}
function errorState(title, msg, retryFn) {
  return '<div class="card errcard">' +
    '<div class="row" style="gap:8px"><span class="badge b-rej">Error</span><b class="small">' + esc(title) + '</b></div>' +
    '<div class="small muted" style="margin-top:6px">' + esc(msg) + '</div>' +
    '<button class="btn sm" style="margin-top:8px" onclick="' + retryFn + '">Try again</button></div>';
}

/* ---------------- top bar / stats ---------------- */
function refreshMeta() {
  var now = new Date();
  var today = dayKey(now);
  var weekAgo = now.getTime() - 7 * 86400000;
  var todayN = 0, weekN = 0;
  state.captures.forEach(function (c) {
    var d = new Date(c.captured_at);
    if (isNaN(d)) return;
    if (dayKey(d) === today) todayN++;
    if (d.getTime() >= weekAgo) weekN++;
  });
  var openGoals = state.goals.filter(function (g) {
    return g.status !== 'completed' && g.status !== 'deleted';
  }).length;
  $('stToday').textContent = todayN;
  $('stPending').textContent = state.pending.length;
  $('stWeek').textContent = weekN;
  $('stGoals').textContent = openGoals + ' / 3';
  $('tbDate').textContent = fmtDay(now);
  $('tbWeek').textContent = 'This week ' + mmdd(new Date(weekAgo)) + '–' + mmdd(now);
  $('tbPending').textContent = 'Pending ' + state.pending.length;
}

/* ---------------- capture tab: pending queue ---------------- */
function pendingRow(it) {
  var chips = (it.impacts || [])
    .filter(function (im) { return im.direction && im.direction !== 'unknown'; })
    .map(smallChip).join('');
  return '<div class="entry">' +
    '<div class="t">' + esc(fmtStamp(it.created_at)) + '</div>' +
    '<div><div class="txt">' + esc(it.text_value) + '</div>' +
    '<div class="sub">' + chips +
    '<span class="badge b-pending">Awaiting confirmation</span>' +
    '<span class="xs mono muted">item #' + it.id + ' · ' + esc(it.item_type || 'behavior') + '</span></div>' +
    '<div class="row" style="gap:8px;margin-top:7px;flex-wrap:wrap">' +
    '<button class="btn sm primary" onclick="itemAct(' + it.id + ',\'confirm\')">Confirm</button>' +
    '<button class="btn sm danger" onclick="askDelete(' + it.id + ',0,this,\'Reject\')">Reject</button>' +
    '</div></div></div>';
}
function renderPending() {
  var el = $('pendingList');
  if (!state.pending.length) {
    el.innerHTML = '<div class="empty">Nothing awaiting confirmation — every candidate has a decision.</div>';
    return;
  }
  el.innerHTML = state.pending.map(pendingRow).join('');
}

/* ---------------- capture tab: conversation stream ---------------- */
function itemCard(it, capId) {
  var st = ITEM_BADGE[it.status] || ITEM_BADGE.proposed;
  var edits = state.edits[it.id] || {};
  var meta = [];
  if (it.item_type) meta.push(esc(it.item_type));
  if (it.quantity != null) meta.push(esc(String(it.quantity)) + (it.unit ? ' ' + esc(it.unit) : ''));
  if (it.item_date) meta.push(esc(it.item_date));
  if (it.confidence != null) meta.push('confidence ' + Math.round(it.confidence * 100) + '%');

  var h = '<div class="mini-item">' +
    '<div class="mi-title"><b>' + esc(it.text_value) + '</b>' +
    '<span class="badge ' + st[0] + '">' + st[1] + '</span>' +
    editedMark(edits, 'text_value') + '</div>' +
    (it.ai_reason ? '<div class="mi-reason">AI thinks this because: ' + esc(it.ai_reason) + '</div>' : '') +
    (meta.length ? '<div class="mi-meta">' + meta.join(' · ') + '</div>' : '') +
    '<div class="imptable" style="margin-top:6px">' +
    (it.impacts || []).map(function (im) { return impactLine(im, it.id); }).join('') + '</div>';

  if (it.status !== 'rejected') {
    h += '<div class="mi-actions">' +
      '<button class="btn sm" onclick="itemAct(' + it.id + ',\'later\')">Leave for later</button>' +
      '<button class="btn sm danger" onclick="askDelete(' + it.id + ',' + capId + ',this,\'Delete item\')">Delete item</button>' +
      '</div>';
  }
  if (state.correcting[it.id]) {
    h += '<div class="editbox">' +
      '<div class="lab">What&rsquo;s not right? Say it plainly</div>' +
      '<div class="row"><input class="inp" id="corr-' + it.id + '" ' +
      'placeholder="e.g. the degree is too strong / I actually felt tired afterwards" aria-label="Correction">' +
      '<button class="btn primary sm" onclick="correctItem(' + it.id + ',' + capId + ')">Change it as I said</button></div>' +
      '<div class="xs muted" style="margin-top:6px">Plain language is fine. The AI&rsquo;s original values are kept as a revision beside yours.</div>' +
      '</div>';
  }
  return h + '</div>';
}

function captureGroup(c) {
  var h = '<div class="msg user"><div class="bubble">' + esc(c.raw_text) + '</div>' +
    '<div class="time-stamp mono xs">' + esc(fmtStamp(c.captured_at)) + ' · your own words, kept verbatim</div></div>';

  var items = state.items[c.id];
  var open = items && state.expanded[c.id] !== false;

  if (!open) {
    var action;
    if (c.status === 'saved' || c.status === 'failed') {
      action = '<button class="btn sm primary" onclick="runExtract(' + c.id + ')">' +
        (c.status === 'failed' ? 'Try the analysis again' : 'Analyze with AI') + '</button>';
    } else if (c.status === 'processing') {
      action = '<span class="small muted">AI is still working on this one…</span>';
    } else {
      action = '<button class="btn sm" onclick="expandCapture(' + c.id + ')">Show AI breakdown</button>';
    }
    return h + '<div class="xcard collapsed">' +
      '<div class="xhead"><div class="xtitle small-title">AI breakdown</div>' +
      '<div class="xmeta"><span class="badge b-ai">AI thinks this</span></div></div>' +
      '<div class="xfoot">' + action + '</div></div>';
  }

  if (!items.length) {
    return h + '<div class="xcard">' +
      '<div class="xhead"><div class="xtitle">AI breakdown</div>' +
      '<div class="xmeta"><span class="badge b-ai">AI thinks this</span></div></div>' +
      '<div class="small muted" style="margin-top:8px">AI found nothing here that needs structuring — and that is fine. ' +
      '<b>The original text is fully preserved.</b></div>' +
      '<div class="xfoot"><button class="btn sm" onclick="runExtract(' + c.id + ')">Let AI try again</button>' +
      '<div class="note">Your own words are never rewritten.</div></div></div>';
  }

  var pend = items.filter(isPending);
  var foot;
  if (pend.length) {
    foot = '<button class="btn primary sm" onclick="confirmAll(' + c.id + ')">Yes, that&rsquo;s right</button>' +
      '<button class="btn sm" onclick="toggleCorrectAll(' + c.id + ')">Not quite</button>';
  } else {
    foot = '<span class="badge b-ok">Confirmed · included in long-term analysis</span>' +
      '<button class="btn sm" onclick="toggleCorrectAll(' + c.id + ')">Not quite</button>';
  }

  return h + '<div class="xcard">' +
    '<div class="xhead"><div class="xtitle">AI breakdown · ' + items.length + ' item' + (items.length === 1 ? '' : 's') + '</div>' +
    '<div class="xmeta"><span class="badge b-ai">AI thinks this — provisional</span></div></div>' +
    '<div class="quote"><span class="tag">Your own words</span><q>' + esc(c.raw_text) + '</q></div>' +
    '<div class="imptable">' + items.map(function (it) { return itemCard(it, c.id); }).join('') + '</div>' +
    '<div class="xfoot">' + foot +
    '<button class="btn sm ghost" onclick="collapseCapture(' + c.id + ')">Hide breakdown</button>' +
    '<div class="note">Confirming only changes the confirmation state — it does not turn AI inference into objective fact. ' +
    'Your original words are never rewritten.</div></div></div>';
}

function renderStream() {
  var el = $('stream');
  if (!state.captures.length) {
    el.innerHTML = '<div class="empty">Nothing yet — jot one sentence below.</div>';
    return;
  }
  el.innerHTML = state.captures.slice().reverse().map(captureGroup).join('');
}

/* ---------------- capture tab: data loading ---------------- */
function loadCaptureTab() {
  $('pendingList').innerHTML = skeleton(1);
  $('stream').innerHTML = skeleton(2);
  refreshAll(false);
}

function refreshAll(scrollToEnd) {
  return Promise.all([
    api('/captures?limit=30'),
    api('/pending'),
    api('/goals')
  ]).then(function (res) {
    state.captures = res[0].captures || [];
    state.pending = res[1].items || [];
    state.goals = res[2].goals || [];
    // keep already-open result cards in sync with post-mutation item state
    var refetch = Object.keys(state.items).map(function (id) {
      return api('/captures/' + id + '/items').then(function (d) {
        state.items[id] = d.items || [];
      }).catch(function () { /* keep stale copy on transient failure */ });
    });
    return Promise.all(refetch);
  }).then(function () {
    renderPending();
    renderStream();
    refreshMeta();
    if (scrollToEnd) scrollBottom();
  }).catch(function (e) {
    $('stream').innerHTML = errorState('Could not load your captures', e.message, 'loadCaptureTab()');
  });
}

function expandCapture(id) {
  return api('/captures/' + id + '/items').then(function (data) {
    state.items[id] = data.items || [];
    state.expanded[id] = true;
    renderStream();
  }).catch(function (e) {
    toast('Could not load the breakdown: ' + e.message);
  });
}
function collapseCapture(id) {
  state.expanded[id] = false;
  renderStream();
}
function runExtract(id) {
  var btns = document.querySelectorAll('button[onclick="runExtract(' + id + ')"]');
  for (var i = 0; i < btns.length; i++) btns[i].textContent = 'Working…';
  return api('/captures/' + id + '/extract', 'POST').then(function () {
    return api('/captures/' + id + '/items');
  }).then(function (data) {
    state.items[id] = data.items || [];
    state.expanded[id] = true;
    return refreshAll(false);
  }).then(function () {
    toast('Analyzed — nothing counts until you confirm it');
  }).catch(function (e) {
    toast('AI analysis failed: ' + e.message + ' — the raw text is safe');
    refreshAll(false);
  });
}

/* ---------------- capture tab: send flow ---------------- */
function sendFree() {
  var box = $('capInput');
  var text = box.value.trim();
  if (!text) { box.focus(); return; }
  box.value = '';
  box.style.height = 'auto';
  sendFlow(text);
}

function sendFlow(text) {
  var stream = $('stream');
  var empty = stream.querySelector('.empty');
  if (empty) empty.parentNode.removeChild(empty);

  var uid = String(Date.now());
  retryStore[uid] = text;
  var t = fmtClock(new Date());
  stream.insertAdjacentHTML('beforeend',
    '<div class="msg user" id="msg-' + uid + '"><div class="bubble">' + esc(text) + '</div>' +
    '<div class="time-stamp mono xs">' + esc(t) + '</div></div>' +
    '<div class="xcard loading" id="think-' + uid + '">' +
    '<div class="typing"><i></i><i></i><i></i></div>' +
    '<div class="small muted">Raw text saved exactly as you wrote it · AI is organizing it… ' +
    '(the model call can take a few seconds)</div></div>');
  scrollBottom();

  return api('/captures', 'POST', { raw_text: text }).then(function (r) {
    var capId = r.id;
    return api('/captures/' + capId + '/extract', 'POST').then(function () {
      return api('/captures/' + capId + '/items');
    }).then(function (data) {
      state.items[capId] = data.items || [];
      state.expanded[capId] = true;
      return refreshAll(true);
    }).catch(function (e) {
      var think = $('think-' + uid);
      if (think) {
        think.className = 'xcard errcard';
        think.innerHTML =
          '<div class="row" style="gap:8px"><span class="badge b-rej">Not analyzed</span>' +
          '<b class="small">AI couldn&rsquo;t analyze this one</b></div>' +
          '<div class="quote"><span class="tag">Your own words</span><q>' + esc(text) + '</q></div>' +
          '<div class="small muted" style="margin-top:6px">' + esc(e.message) +
          ' — your words are saved exactly as written.</div>' +
          '<button class="btn sm" style="margin-top:8px" onclick="runExtract(' + capId + ')">' +
          'Try the analysis again</button>';
      }
      refreshAll(false);
    });
  }).catch(function (e) {
    var think = $('think-' + uid);
    if (think) {
      think.className = 'xcard errcard';
      think.innerHTML =
        '<div class="row" style="gap:8px"><span class="badge b-rej">Not saved</span>' +
        '<b class="small">Couldn&rsquo;t save that just now</b></div>' +
        '<div class="small muted" style="margin-top:6px">' + esc(e.message) + '</div>' +
        '<button class="btn sm" style="margin-top:8px" onclick="sendFlow(retryStore[\'' + uid + '\'])">Try again</button>';
    }
    toast('Could not save: ' + e.message);
  });
}

/* ---------------- capture tab: actions ---------------- */
function confirmAll(capId) {
  var items = state.items[capId] || [];
  var chain = Promise.resolve();
  items.forEach(function (it) {
    if (isPending(it)) {
      chain = chain.then(function () { return api('/items/' + it.id + '/confirm', 'POST'); });
    }
  });
  return chain.then(function () {
    toast('Confirmed — these now count in long-term analysis. Your original words stay as they are.');
    return refreshAll(false);
  }).catch(function (e) {
    toast('Could not confirm: ' + e.message);
    return refreshAll(false);
  });
}

function itemAct(id, act) {
  return api('/items/' + id + '/' + act, 'POST').then(function () {
    if (act === 'confirm') toast('Confirmed — it now counts in long-term analysis. Your original words stay as they are.');
    else if (act === 'later') toast('Left for later — no pressure, it stays in the queue.');
    else toast('Deleted — it won\u2019t enter Review or analysis.');
    return refreshAll(false);
  }).catch(function (e) {
    toast('Could not update: ' + e.message);
    return refreshAll(false);
  });
}

function askDelete(id, capId, btn, verb) {
  if (btn.dataset.armed) { return itemAct(id, 'reject'); }
  btn.dataset.armed = '1';
  btn.textContent = 'Tap again to ' + verb.toLowerCase();
  setTimeout(function () {
    if (btn.isConnected) {
      delete btn.dataset.armed;
      btn.textContent = verb;
    }
  }, 2400);
}

function toggleCorrectAll(capId) {
  var items = state.items[capId] || [];
  var any = items.some(function (it) { return state.correcting[it.id]; });
  items.forEach(function (it) { state.correcting[it.id] = !any && it.status !== 'rejected'; });
  renderStream();
  if (!any) {
    var first = $('stream').querySelector('.editbox .inp');
    if (first) first.focus();
  }
}

function snapshotItem(it) {
  var s = { text_value: it.text_value, impacts: {} };
  (it.impacts || []).forEach(function (im) {
    s.impacts[im.dimension_key] = {
      direction: im.direction, degree: im.degree,
      degree_positive: im.degree_positive, degree_negative: im.degree_negative, note: im.note
    };
  });
  return s;
}
function diffItem(before, after) {
  var edits = {};
  if (String(before.text_value) !== String(after.text_value)) edits['text_value'] = before.text_value;
  Object.keys(before.impacts).forEach(function (k) {
    var b = before.impacts[k];
    var a = (after.impacts || []).filter(function (x) { return x.dimension_key === k; })[0];
    if (!a) return;
    ['direction', 'degree', 'degree_positive', 'degree_negative', 'note'].forEach(function (f) {
      if (String(b[f]) !== String(a[f])) edits[k + '.' + f] = b[f];
    });
  });
  return edits;
}

function correctItem(itemId, capId) {
  var input = $('corr-' + itemId);
  var fb = input ? input.value.trim() : '';
  if (!fb) { if (input) input.focus(); return; }
  var before = (state.items[capId] || []).filter(function (it) { return it.id === itemId; })[0];
  if (!before) return;
  var snap = snapshotItem(before);

  return api('/items/' + itemId + '/correct', 'POST', { feedback: fb }).then(function (resp) {
    return api('/captures/' + capId + '/items').then(function (data) {
      return { resp: resp, data: data };
    });
  }).then(function (r) {
    state.items[capId] = r.data.items || [];
    var after = (state.items[capId] || []).filter(function (it) { return it.id === itemId; })[0];
    state.edits[itemId] = after ? diffItem(snap, after) : {};
    state.correcting[itemId] = false;
    renderStream();
    refreshMeta();
    var editsN = Object.keys(state.edits[itemId]).length;
    var changedN = (r.resp && r.resp.changed) ? r.resp.changed.length : 0;
    if (!editsN && !changedN) {
      toast((r.resp && r.resp.note) ? r.resp.note : 'Feedback recorded — nothing was changed (no guessing)');
    } else {
      toast('Updated as you said — the AI\u2019s original values are kept as a revision beside yours');
    }
  }).catch(function (e) {
    toast('Could not apply the correction: ' + e.message);
  });
}

/* ---------------- five dimensions ---------------- */
function dimCard(d) {
  var m = DIMS[d.key] || { name: d.key, color: 'var(--ink-3)' };
  var vcls = {
    'Mostly positive evidence': 'b-ok', 'Mostly negative evidence': 'b-rej', 'Mixed': 'b-mod',
    'Evidence without direction': 'b-ai', 'Not enough data': 'b-unk'
  }[d.qualitative] || 'b-unk';
  var avg = d.avg_degree;
  var tone = d.positive > d.negative ? 'pos' : (d.negative > d.positive ? 'neg' : '');
  var ev = d.evidence || [];
  var shown = ev.slice(0, 3);

  var h = '<div class="dimrow">' +
    '<div class="row between" style="gap:8px">' +
    '<div class="row" style="gap:7px"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:' + m.color + '"></span>' +
    '<b style="font-size:13px">' + esc(m.name) + '</b></div>' +
    '<div class="mono xs muted">' + d.positive + ' support · ' + d.negative + ' drain · ' + d.mixed +
    ' mixed · ' + d.neutral + ' no clear effect</div></div>' +
    '<div class="row between" style="gap:8px;margin-top:7px">' +
    '<span class="badge ' + vcls + '">' + esc(d.qualitative) + '</span>' +
    '<span class="row" style="gap:6px">' + pips(avg == null ? 0 : Math.round(avg), tone) +
    '<span class="mono xs muted">' + (avg == null ? 'no degree data' : 'avg ' + avg + ' / 5') + '</span></span></div>';

  if (shown.length) {
    h += shown.map(function (e) {
      return '<div class="evrow"><q>' + esc(e.text) + '</q> &rarr; ' +
        '<span class="dir ' + (DIR_CLS[e.direction] || 'd-unk') + '">' + esc(DIR_LABEL[e.direction] || e.direction) + '</span>' +
        (e.degree == null ? '' : ' <span class="mono xs">' + esc(String(e.degree)) + ' / 5</span>') +
        '<div class="xs muted mono">confirmed entry #' + e.item_id + '</div></div>';
    }).join('');
    if (ev.length > 3) {
      h += '<div class="xs muted mono" style="margin-top:5px">+ ' + (ev.length - 3) + ' more evidence entries</div>';
    }
  } else {
    h += '<div class="xs muted mono" style="margin-top:6px">No confirmed evidence in this dimension yet.</div>';
  }

  h += '<div class="unk-line">' + d.unknown + ' behavior' + (d.unknown === 1 ? '' : 's') +
    ' have no evidence yet — unknown, not neutral</div></div>';
  return h;
}

function loadDims() {
  var el = $('dimsList');
  el.innerHTML = '<div class="grid-full">' + skeleton(3) + '</div>';
  return api('/dimensions').then(function (data) {
    var dims = data.dimensions || [];
    if (!dims.length) {
      el.innerHTML = '<div class="grid-full">' +
        emptyState('Nothing yet — jot one sentence below in Capture, then confirm it.') + '</div>';
      return;
    }
    el.innerHTML = dims.map(dimCard).join('') +
      (data.note ? '<div class="footnote grid-full">' + esc(data.note) + '</div>' : '');
  }).catch(function (e) {
    el.innerHTML = '<div class="grid-full">' +
      errorState('Could not load the five dimensions', e.message, 'loadDims()') + '</div>';
  });
}

/* ---------------- review ---------------- */
var KINDS = {
  fact: ['tag-fact', 'Confirmed fact', 'What happened'],
  calculation: ['tag-calc', 'Calculated', 'Progress & deviations'],
  inference: ['tag-spec', 'Speculation', 'Possible patterns'],
  theory: ['tag-theory', 'Theory', 'Theory perspective'],
  recommendation: ['tag-advice', 'Suggestion', 'Suggestion'],
  limitation: ['tag-gap', 'Limitation', 'Insufficient data']
};
function parseJson(s, fallback) {
  if (s == null) return fallback;
  if (typeof s !== 'string') return s;
  try { return JSON.parse(s); } catch (e) { return fallback; }
}

function pickPeriod(btn, days) {
  state.periodDays = days;
  var els = document.querySelectorAll('#periods .period');
  for (var i = 0; i < els.length; i++) els[i].classList.toggle('on', els[i] === btn);
}

function startReview(mode) {
  var stream = $('revStream');
  if (mode === 'none') {
    stream.innerHTML = '<div class="card quiet">OK — no review for now. Nothing will remind you later; ' +
      'a review happens only when you open it. If you want the current picture, the Five Dimensions tab ' +
      'is there whenever you like.</div>';
    return;
  }
  var d = state.periodDays;
  var type = d === 1 ? 'daily' : (d === 30 ? 'monthly' : 'weekly');
  var label = d === 1 ? "today's" : (d === 30 ? "this month's" : "this week's");
  stream.innerHTML = '<div class="card loading"><div class="typing"><i></i><i></i><i></i></div>' +
    '<div class="small muted">Building ' + label + ' review from your confirmed entries… ' +
    '(the model call can take a few seconds)</div></div>';
  window.scrollTo(0, 0);

  return api('/reviews/generate', 'POST', { review_type: type, period_days: d }).then(function (gen) {
    return api('/reviews/' + gen.review_id);
  }).then(function (data) {
    renderReview(stream, data, mode);
  }).catch(function (e) {
    stream.innerHTML = errorState('Could not generate the review', e.message, "startReview('" + mode + "')");
  });
}

function renderReview(stream, data, mode) {
  var stmts = data.statements || [];
  if (mode === 'facts') {
    stmts = stmts.filter(function (s) {
      return s.statement_type === 'fact' || s.statement_type === 'calculation' || s.statement_type === 'limitation';
    });
  }

  var h = '<div class="card quiet">' +
    (mode === 'facts'
      ? 'Facts only this round — speculations and suggestions are hidden. Everything here comes from entries you confirmed.'
      : 'This is your review, built from the entries you confirmed. Every block is labeled: what is fact, what is calculation, what is only my speculation.') +
    '</div>';

  if (!stmts.length) {
    h += emptyState('Nothing yet — jot one sentence below in Capture and confirm it, and the next review will have something to work with.');
  }

  stmts.forEach(function (s, i) {
    var k = KINDS[s.statement_type] || KINDS.fact;
    h += '<div class="rv-sec">' +
      '<div class="rv-h"><span class="n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
      '<span class="t">' + esc(k[2]) + '</span>' +
      '<span class="type-tag ' + k[0] + '">' + esc(k[1]) + '</span></div>' +
      '<div class="fact">' + esc(s.text) + '</div>';

    var unc = parseJson(s.uncertain_points, []);
    if (unc && unc.length) {
      h += '<ul class="limit-list">' + unc.map(function (u) {
        return '<li>' + esc(typeof u === 'string' ? u : JSON.stringify(u)) + '</li>';
      }).join('') + '</ul>';
    }

    (s.theory || []).forEach(function (t) {
      h += '<div class="why-box theory"><b>' + esc(t.author) + '</b> · ' + esc(t.source_title) +
        (t.year ? ' · ' + esc(String(t.year)) : '') +
        (t.citation ? '<br><span class="xs muted">' + esc(t.citation) + '</span>' : '') +
        (t.assumption_boundary
          ? '<br><b>Applies when:</b> ' + esc(t.assumption_boundary)
          : '<br><span class="xs muted">Applicability boundary not stated.</span>') +
        '<div class="xs muted" style="margin-top:4px">Theory point — not your personal fact, not a diagnosis or causal proof.</div></div>';
    });

    var ev = parseJson(s.supporting_evidence, []);
    if (ev && ev.length) {
      h += '<details class="ev-details"><summary>Evidence from your own captures</summary><div class="body">' +
        ev.map(function (x) {
          return '<div class="evrow"><q>' + esc(x.text || '') + '</q>' +
            '<div class="xs muted mono">capture #' + esc(String(x.capture_id)) + ' · item #' + esc(String(x.item_id)) + '</div></div>';
        }).join('') + '</div></details>';
    }
    h += '</div>';
  });

  if (mode === 'guided') {
    var rec = (data.recommendations || [])[0];
    if (rec) {
      h += '<div class="obc" id="obcCard">' +
        '<div class="kicker">One Big Change · zero or one</div>' +
        '<h3 id="obcTitle">' + esc(rec.text) + '</h3>' +
        (rec.reason ? '<div class="why"><b>Basis:</b> ' + esc(rec.reason) + '</div>' : '') +
        (rec.expected_effect ? '<div class="why" style="margin-top:5px"><b>Expected effect:</b> ' + esc(rec.expected_effect) + '</div>' : '') +
        (rec.unknowns ? '<div class="why-box"><b>Uncertainties:</b> ' + esc(rec.unknowns) + '</div>' : '') +
        '<div class="row" style="gap:8px;margin-top:11px;flex-wrap:wrap" id="obcBtns">' +
        '<button class="btn primary sm" onclick="obcResolve(' + rec.id + ',\'accepted\')">Accept</button>' +
        '<button class="btn sm" onclick="obcEdit()">Edit</button>' +
        '<button class="btn sm" onclick="obcResolve(' + rec.id + ',\'rejected\')">Not this one</button></div>' +
        '<div class="editbox" id="obcEditBox" style="display:none">' +
        '<div class="lab">Rewrite it your way</div>' +
        '<textarea class="obc-input" id="obcInput" rows="3">' + esc(rec.text) + '</textarea>' +
        '<button class="btn primary sm" style="margin-top:8px" onclick="obcSave(' + rec.id + ')">Save my version</button>' +
        '<div class="xs muted" style="margin-top:6px">Your version stands; the AI&rsquo;s original suggestion stays above, traceable.</div></div>' +
        '<div class="xs muted" id="obcState" style="margin-top:9px">Declinable — if declined, this review keeps zero suggestions and creates no hidden to-dos.</div>' +
        '</div>';
    } else {
      h += '<div class="card quiet"><b>No big change suggested</b> — &ldquo;no change needed this time&rdquo; is a valid outcome and won&rsquo;t turn into a hidden to-do.</div>';
    }
  }

  h += '<div class="rv-sec" id="fbSec">' +
    '<div class="rv-h"><span class="n">' + (stmts.length + 1 < 10 ? '0' : '') + (stmts.length + 1) + '</span>' +
    '<span class="t">Does this match your sense of things?</span></div>' +
    '<div class="fbrow" id="fbRow">' +
    '<button class="fb" data-fb="match" onclick="toggleFb(this)">This matches</button>' +
    '<button class="fb" data-fb="nomatch" onclick="toggleFb(this)">This doesn&rsquo;t match</button></div>' +
    '<textarea class="obc-input" id="fbNote" rows="2" placeholder="Optional note — a correction or disagreement (or write nothing at all)"></textarea>' +
    '<button class="btn primary sm" style="margin-top:8px" onclick="submitReviewFeedback(' + data.review.id + ')">Send feedback</button>' +
    '<div class="xs muted" style="margin-top:6px">Optional — you can finish without rating anything.</div></div>';

  stream.innerHTML = h;
}

function toggleFb(btn) {
  var els = document.querySelectorAll('#fbRow .fb');
  for (var i = 0; i < els.length; i++) {
    if (els[i] === btn) els[i].classList.toggle('on');
    else els[i].classList.remove('on');
  }
}

function submitReviewFeedback(reviewId) {
  var sel = document.querySelector('#fbRow .fb.on');
  var note = $('fbNote').value.trim();
  var matches = sel && sel.dataset.fb === 'match';
  var text = [(sel ? sel.textContent.trim() : ''), note].filter(Boolean).join(' · ');
  return api('/reviews/' + reviewId + '/feedback', 'POST', {
    changed: !!matches,
    feedback_text: text || (matches ? 'This matches' : '')
  }).then(function () {
    $('fbSec').innerHTML = '<div class="row" style="gap:8px;align-items:flex-start">' +
      '<span class="badge b-ok">Saved</span>' +
      '<div class="small">Thank you — your feedback is recorded and it is yours. Nothing else happens with it.</div></div>';
  }).catch(function (e) {
    toast('Could not save feedback: ' + e.message);
  });
}

function obcEdit() {
  var box = $('obcEditBox');
  if (box) {
    box.style.display = box.style.display === 'none' ? '' : 'none';
    if (box.style.display !== 'none') $('obcInput').focus();
  }
}
function obcSave(recId) {
  var mine = $('obcInput').value.trim();
  return api('/recommendations/' + recId + '/status', 'POST', { status: 'modified' }).then(function () {
    var st = $('obcState');
    st.innerHTML = '<span class="badge b-mod">Edited &amp; accepted</span><br>' +
      '<b>Your version stands:</b> &ldquo;' + esc(mine) + '&rdquo;<br>' +
      '<span class="ai-orig">AI original kept: see above</span>';
    var btns = $('obcBtns');
    if (btns) btns.style.display = 'none';
    $('obcEditBox').style.display = 'none';
    toast('Saved your version — the AI\u2019s original suggestion is kept above');
  }).catch(function (e) {
    toast('Could not save: ' + e.message);
  });
}
function obcResolve(recId, status) {
  return api('/recommendations/' + recId + '/status', 'POST', { status: status }).then(function () {
    var st = $('obcState');
    var btns = $('obcBtns');
    if (btns) btns.style.display = 'none';
    var box = $('obcEditBox');
    if (box) box.style.display = 'none';
    if (status === 'accepted') {
      st.innerHTML = '<span class="badge b-ok">Accepted</span> — kept as one big change; the suggestion above stays traceable.';
      toast('Accepted — the suggestion stays, nothing else is created behind your back');
    } else {
      st.innerHTML = '<span class="badge b-ai">Not this one</span> — zero suggestions this period is a valid outcome. No hidden to-dos are created.';
      toast('Noted. Zero suggestions this period is a valid outcome.');
    }
  }).catch(function (e) {
    toast('Could not update: ' + e.message);
  });
}

/* ---------------- me tab ---------------- */
var GOAL_BADGE = {
  active: ['b-ok', 'Active'], paused: ['b-ai', 'Paused'],
  completed: ['b-mod', 'Completed'], draft: ['b-unk', 'Draft']
};
function renderGoals() {
  var el = $('goalList');
  if (!state.goals.length) {
    el.innerHTML = emptyState('Nothing yet — add one below, or jot one sentence in Capture.');
  } else {
    el.innerHTML = state.goals.map(function (g) {
      var dims = parseJson(g.dimension_keys, []);
      var st = GOAL_BADGE[g.status] || GOAL_BADGE.draft;
      var acts = [];
      if (g.status === 'active') {
        acts.push(['completed', 'Mark completed'], ['paused', 'Pause']);
      } else if (g.status === 'paused') {
        acts.push(['active', 'Resume'], ['completed', 'Mark completed']);
      } else {
        acts.push(['active', g.status === 'completed' ? 'Reopen' : 'Activate']);
      }
      return '<div class="goal">' +
        '<div class="row between" style="gap:8px"><div class="g-title">' + esc(g.title) + '</div>' +
        '<span class="badge ' + st[0] + '">' + st[1] + '</span></div>' +
        '<div class="g-meta">' +
        (g.metric ? 'Metric: ' + esc(g.metric) : 'No metric — qualitative goal') +
        (g.horizon ? ' · Horizon: ' + esc(g.horizon) : '') +
        (g.measurable ? '' : ' · not quantified on purpose') + '</div>' +
        '<div class="chips" style="margin:7px 0 0">' +
        dims.map(function (k) {
          var m = DIMS[k] || { name: k, color: 'var(--ink-3)' };
          return '<span class="chip-static"><span class="dot" style="background:' + m.color + '"></span>' + esc(m.name) + '</span>';
        }).join('') + '</div>' +
        '<div class="g-actions">' +
        acts.map(function (a) {
          return '<button class="btn sm" onclick="goalStatus(' + g.id + ',\'' + a[0] + '\')">' + a[1] + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }
  var open = state.goals.filter(function (g) {
    return g.status !== 'completed' && g.status !== 'deleted';
  }).length;
  $('goalCap').textContent = open + ' / 3 in use';
  var addBtn = $('btnAddGoal');
  if (open >= 3) {
    addBtn.disabled = true;
    addBtn.textContent = 'Max 3 — finish or pause one first';
  } else {
    addBtn.disabled = false;
    addBtn.textContent = 'Add a goal';
  }
}

function loadMe() {
  $('goalList').innerHTML = skeleton(2);
  return api('/goals').then(function (data) {
    state.goals = data.goals || [];
    renderGoals();
    refreshMeta();
  }).catch(function (e) {
    $('goalList').innerHTML = errorState('Could not load goals', e.message, 'loadMe()');
  });
}

function toggleDimSel(btn) { btn.classList.toggle('on'); }

function addGoal() {
  var title = $('goalTitle').value.trim();
  if (!title) {
    toast('A goal needs a title — one line is enough');
    $('goalTitle').focus();
    return;
  }
  var dims = [];
  var sel = document.querySelectorAll('#goalDims .chip.on');
  for (var i = 0; i < sel.length; i++) dims.push(sel[i].dataset.dim);
  var metric = $('goalMetric').value.trim();
  var horizon = $('goalHorizon').value.trim();
  return api('/goals', 'POST', {
    title: title,
    dimension_keys: dims,
    measurable: !!metric,
    metric: metric || null,
    horizon: horizon || null
  }).then(function () {
    toast('Goal added — three at most keeps things honest');
    $('goalTitle').value = '';
    $('goalMetric').value = '';
    $('goalHorizon').value = '';
    var chips = document.querySelectorAll('#goalDims .chip.on');
    for (var j = 0; j < chips.length; j++) chips[j].classList.remove('on');
    return loadMe();
  }).catch(function (e) {
    toast(e.message);
  });
}

function goalStatus(id, status) {
  return api('/goals/' + id + '/status', 'POST', { status: status }).then(function () {
    return loadMe();
  }).then(function () {
    toast('Goal updated — status only, nothing else changed');
  }).catch(function (e) {
    toast('Could not update: ' + e.message);
  });
}

/* ---------------- tabs ---------------- */
function switchTab(tab, btn) {
  ['capture', 'dims', 'review', 'me'].forEach(function (t) {
    $('s-' + t).classList.toggle('active', t === tab);
  });
  var els = document.querySelectorAll('.tabbar .tab');
  for (var i = 0; i < els.length; i++) els[i].classList.toggle('on', els[i] === btn);
  $('composer').style.display = tab === 'capture' ? '' : 'none';
  try { localStorage.setItem('v1demo_tab', tab); } catch (e) { /* UI state only */ }
  window.scrollTo(0, 0);
  syncDock();
  if (tab === 'capture') { if (!state.captures.length) loadCaptureTab(); }
  else if (tab === 'dims') loadDims();
  else if (tab === 'me') loadMe();
}

/* ---------------- init ---------------- */
(function init() {
  // example chips fill the input
  var chips = document.querySelectorAll('#exampleChips .chip');
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener('click', function () {
      var box = $('capInput');
      box.value = this.dataset.fill || '';
      box.focus();
      box.dispatchEvent(new Event('input'));
    });
  }

  $('sendBtn').addEventListener('click', sendFree);
  var box = $('capInput');
  box.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendFree();
    }
  });

  $('btnAddGoal').addEventListener('click', addGoal);

  window.addEventListener('resize', syncDock);
  syncDock();

  // restore last active tab (UI state only) — capture is the default landing tab
  var saved = 'capture';
  try {
    var s = localStorage.getItem('v1demo_tab');
    if (s === 'capture' || s === 'dims' || s === 'review' || s === 'me') saved = s;
  } catch (e) { /* ignore */ }
  var tabBtn = document.querySelector('.tabbar .tab[data-tab="' + saved + '"]');
  switchTab(saved, tabBtn); // capture view loads itself on first switch
})();
