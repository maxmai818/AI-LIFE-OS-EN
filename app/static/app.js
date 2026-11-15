/* AI Life OS · 应用层前端
   皮肤 = 变体 2 设计稿（组件类名与 markup 与 prototypes/variant-2 一致）；此文件只把组件接到真 API。
   INV：原文不可改写；候选经确认才计入；五维无总分；复盘证据分层。 */
const API = (p, method = 'GET', body) => fetch(p, {
  method, headers: { 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined,
}).then(async r => { if (!r.ok) throw new Error((await r.json()).detail || r.status); return r.json(); });

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = id => document.getElementById(id);

/* ---------- 数据模型 → 皮肤词汇 ---------- */
const DIM_META = {
  time: { name: '时间', en: 'TIME' },
  health: { name: '健康', en: 'HEALTH' },
  wealth: { name: '财富', en: 'WEALTH' },
  relationship: { name: '关系', en: 'RELATIONSHIP' },
  purpose: { name: '目的', en: 'PURPOSE' },
};
const DIR_LABEL = { positive: '正向', negative: '负向', mixed: '混合', neutral: '中性', unknown: '未知' };
const DIR_CLS = { positive: 'dir-pos', negative: 'dir-neg', mixed: 'dir-mix', neutral: 'dir-neu', unknown: 'dir-unk' };
const BADGE = {
  proposed: ['pending', '待确认'],
  confirmed: ['confirmed', '已确认 · 参与长期分析'],
  modified: ['edited', '已修订 · 你的版本'],
  rejected: ['deleted', '已删除 · 不进入分析'],
  unresolved: ['later', '稍后再定'],
};

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- 度数行（与设计稿 degreesHtml 同构） ---------- */
function degreesHtml(imp) {
  const d = imp.direction;
  if (d === 'unknown') return '<div class="degrees"><span class="deg-label" style="margin:0">无证据，不做猜测</span></div>';
  if (d === 'neutral') return '<div class="degrees"><span class="deg-label" style="margin:0">中性 · 程度留空</span></div>';
  if (d === 'mixed') {
    let h = '<div class="degrees">';
    h += '<span class="deg-label" style="margin:0 2px 0 0">正</span>';
    for (let i = 1; i <= 5; i++) h += `<i class="${i <= (imp.degree_positive || 0) ? 'on pos' : ''}"></i>`;
    h += `<span class="deg-label" style="margin:0 6px 0 3px">${imp.degree_positive ?? '—'}</span>`;
    h += '<span class="deg-label" style="margin:0 2px 0 0">负</span>';
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

function epiLabel(it) {
  return it.status === 'confirmed' ? '用户认可的判断'
    : it.status === 'modified' ? '你的修订版本'
    : it.status === 'rejected' ? '—'
    : 'AI 推断';
}

/* ================= 对话 ================= */
function aiMsg(inner, wide) {
  return `<div class="msg ai"><div class="avatar">AI</div><div style="flex:1">
    <div class="bubble${wide ? ' wide' : ''}">${inner}</div></div></div>`;
}

function impactRowsHtml(it) {
  return it.impacts.map(imp => `
    <div class="impact-row">
      <div class="dim">${DIM_META[imp.dimension_key]?.name || imp.dimension_key}<span>${DIM_META[imp.dimension_key]?.en || ''}</span></div>
      <span class="dir-chip ${DIR_CLS[imp.direction]}">${DIR_LABEL[imp.direction]}</span>
      ${degreesHtml(imp)}
      <span class="epi">${epiLabel(it)}</span>
    </div>`).join('');
}

function cardHtml(it, rawText) {
  const [cls, label] = BADGE[it.status] || BADGE.proposed;
  if (it.status === 'rejected') {
    return `<div class="card deleted" id="item-${it.id}">
      <div class="card-title"><b>${esc(it.text_value)}</b><span class="badge ${cls}">${label}</span></div>
      <div class="why-box">你标记了「这不是事实 / 不想进入分析」，它已从分析中删除。</div>
    </div>`;
  }
  const editable = ['proposed', 'unresolved'].includes(it.status);
  const actions = editable ? `
    <div class="actions">
      <button class="btn btn-primary" onclick="itemAct(${it.id},'confirm')">确认</button>
      <button class="btn btn-ghost" onclick="toggleEdit(${it.id})">修改</button>
      <button class="btn btn-line" onclick="itemAct(${it.id},'later')">稍后</button>
      <button class="btn btn-danger" data-del="${it.id}" onclick="askDelete(${it.id})">删除</button>
    </div>` : `
    <div class="actions"><button class="btn btn-ghost" onclick="toggleEdit(${it.id})">修改</button></div>`;
  return `<div class="card" id="item-${it.id}">
    <div class="card-title"><b>${esc(it.text_value)}</b><span class="badge ${cls}">${label}</span></div>
    ${rawText ? `<div class="quote"><div class="tag">原文证据</div>「${esc(rawText)}」</div>` : ''}
    <div class="impact-list">
      ${it.impacts.length ? impactRowsHtml(it) : `<div class="why-box">这条记录未被映射到五维（AI 认为证据不足，不猜）。</div>`}
    </div>
    <div class="why-box"><b>为什么这样指导：</b>${it.impacts.some(x => x.note) ? esc(it.impacts.find(x => x.note)?.note || '') : '只根据你原话里的依据做映射；没依据的维度一律「未知」。AI 只是候选，你确认与否都不会变成客观事实。'}</div>
    ${actions}
    <div class="edit-panel" id="edit-${it.id}" style="display:none">
      ${it.impacts.map(imp => `
      <div class="edit-row">
        <span class="lab">${DIM_META[imp.dimension_key]?.name || imp.dimension_key}</span>
        <select onchange="reviseImpact(${imp.id},{direction:this.value})">
          ${Object.keys(DIR_LABEL).map(d => `<option value="${d}" ${imp.direction === d ? 'selected' : ''}>${DIR_LABEL[d]}</option>`).join('')}
        </select>
        <select onchange="reviseImpact(${imp.id},{degree:this.value?Number(this.value):null})">
          <option value="">程度 —</option>
          ${[1, 2, 3, 4, 5].map(n => `<option ${imp.degree === n ? 'selected' : ''}>${n}</option>`).join('')}
        </select>
      </div>`).join('')}
      <div class="edit-row"><span class="lab">原文描述</span>
        <input value="${esc(it.text_value)}" onchange="reviseText(${it.id}, this)"></div>
      <div class="edit-hint">改的是你的版本；AI 原始值保留在修订历史里，随时可对照。</div>
    </div>
  </div>`;
}

async function loadChat() {
  const { captures } = await API('/api/captures');
  const stream = $('chat-stream');
  if (!captures.length) {
    stream.dataset.loaded = '';
    stream.innerHTML = aiMsg(`<p>嗨，今天过得怎么样？随手记一句就好——<b>你的原话会原样保存</b>，AI 只帮你整理成待确认的条目。</p>
      <p class="soft">先写点什么试试？比如：<i>「今天跑了 30 分钟，感觉状态不错」</i></p>`);
    return;
  }
  stream.dataset.loaded = '1';
  const parts = [];
  for (const c of captures) {
    const t = (c.captured_at || '').slice(11, 16) || '—';
    parts.push(`<div class="msg user"><div class="bubble">${esc(c.raw_text)}</div><div class="time-stamp">${t}</div></div>`);
    const { items } = await API(`/api/captures/${c.id}/items`);
    if (!items.length) {
      if (c.status === 'saved') {
        parts.push(aiMsg(`<p>我试着整理，但没找到能安全拆解的内容。<b>原文已完整保存。</b></p>
          <div class="actions"><button class="btn btn-line" onclick="runExtract(${c.id})">还是让我试试</button></div>`));
      }
      continue;
    }
    parts.push(aiMsg(`<p>收到。下面是我从你的话里整理的，<b>AI 只是候选，你确认后才算数。</b></p>` +
      items.map(it => cardHtml(it, c.raw_text)).join(''), true));
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
  await sendText(text);
}
function sendPreset(text) { sendText(text); }

async function sendText(text) {
  const stream = $('chat-stream');
  if (!stream.dataset.loaded) stream.innerHTML = '';
  stream.dataset.loaded = '1';
  const sg = $('suggestWrap'); if (sg) sg.style.display = 'none';
  const t = new Date().toTimeString().slice(0, 5);
  stream.insertAdjacentHTML('beforeend',
    `<div class="msg user"><div class="bubble">${esc(text)}</div><div class="time-stamp">${t}</div></div>`);
  stream.insertAdjacentHTML('beforeend',
    `<div class="msg ai" id="thinking"><div class="avatar">AI</div><div style="flex:1">
      <div class="bubble"><p class="soft">正在整理你的原话…</p></div></div></div>`);
  try {
    const { id } = await API('/api/captures', 'POST', { raw_text: text });
    await API(`/api/captures/${id}/extract`, 'POST');
    const { items } = await API(`/api/captures/${id}/items`);
    $('thinking')?.remove();
    const inner = items.length
      ? `<p>下面是我从你的话里整理的，<b>AI 只是候选，你确认后才算数。</b></p>` + items.map(it => cardHtml(it, text)).join('')
      : `<p>我没有找到能安全整理的内容。<b>原文已完整保存。</b></p>`;
    stream.insertAdjacentHTML('beforeend', aiMsg(inner, true));
    window.scrollTo(0, document.body.scrollHeight);
  } catch (e) {
    $('thinking')?.remove();
    toast('出错了：' + e.message);
  }
}

async function runExtract(id) {
  await API(`/api/captures/${id}/extract`, 'POST');
  loadChat();
}

async function itemAct(id, act) {
  await API(`/api/items/${id}/${act}`, 'POST');
  toast(act === 'confirm' ? '已确认，进入长期分析' : act === 'later' ? '好，稍后再定' : '已删除');
  loadChat();
}

function askDelete(id) {
  const btn = document.querySelector(`[data-del="${id}"]`);
  if (btn.dataset.armed) { itemAct(id, 'reject'); return; }
  btn.dataset.armed = '1'; btn.textContent = '再点一下删除';
  setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = '删除'; } }, 2000);
}

function toggleEdit(id) {
  const e = $('edit-' + id);
  e.style.display = e.style.display === 'none' ? 'block' : 'none';
}

async function reviseText(id, input) {
  await API(`/api/items/${id}/revise`, 'POST', { field_name: 'text_value', corrected_value: input.value.trim() });
  toast('已按你的话修订（AI 原值保留可追溯）');
}
async function reviseImpact(impactId, patch) {
  await API(`/api/impacts/${impactId}/revise`, 'POST', patch);
  toast('已修订影响（原值保留可追溯）');
  loadChat();
}

/* ================= 五维 ================= */
const VERDICT = {
  '正向证据居多': ['var(--green-soft)', 'var(--green)', '偏支持'],
  '负向证据居多': ['#F2E2DE', 'var(--danger)', '偏消耗'],
  '混合': ['#EFEAE1', 'var(--ink-soft)', '两面'],
  '有证据无方向': ['#EFEAE1', 'var(--ink-soft)', '不明朗'],
  '数据不足': ['#EFEAE1', 'var(--ink-soft)', '记录太少'],
};
const DIM_IC = { time: ['◷', 'var(--blue-soft)'], health: ['🏃', 'var(--green-soft)'], wealth: ['¥', '#F3E7C9'], relationship: ['♥', '#F2E2DE'], purpose: ['✦', '#EDE6F6'] };

async function loadDims() {
  const { dimensions, note } = await API('/api/dimensions');
  $('dims-list').innerHTML = dimensions.map(d => {
    const m = DIM_META[d.key];
    const [bg, fg, label] = VERDICT[d.qualitative] || VERDICT['数据不足'];
    const avg = d.avg_degree;
    return `<div class="dim-card" onclick="toggleDim(this,event)">
      <div class="head">
        <div class="dim-icon" style="background:${DIM_IC[d.key][1]}">${DIM_IC[d.key][0]}</div>
        <div class="dim-name"><b>${m.name}</b><span>${m.en} · 本期 ${d.evidence.length} 条确认记录</span></div>
        <div class="dim-verdict" style="background:${bg};color:${fg}">${label}</div>
        <div class="chev">▾</div>
      </div>
      <div class="dim-body">
        <div class="impact-row" style="margin-bottom:2px">
          <div class="dim">正向<span>DEGREE</span></div>
          <div class="degrees">
            ${[1, 2, 3, 4, 5].map(i => `<i class="${avg && i <= Math.round(avg) ? 'on pos' : ''}"></i>`).join('')}
            <span class="deg-label">${avg ? '平均 ' + avg + ' / 5' : '程度数据不足'}</span>
          </div>
        </div>
        ${d.evidence.slice(0, 3).map(e => `
        <div class="evi" onclick="event.stopPropagation();toast('来自原文，未改写')">
          「${esc(e.text)}」→ ${DIR_LABEL[e.direction]}${e.degree ? ' ' + e.degree : ''}
          <div class="src"><span>已确认记录 #${e.item_id}</span><span>用户认可的判断</span></div>
        </div>`).join('')}
        ${d.unknown ? `<div class="why-box">另有 ${d.unknown} 条影响未知（不猜，不填充）。</div>` : ''}
      </div>
    </div>`;
  }).join('') + `<div class="quiet-end">${esc(note)}</div>`;
}

function toggleDim(card, ev) {
  card.classList.toggle('open');
}

/* ================= 复盘 ================= */
let periodDays = 7;
function pickPeriod(btn, days) {
  periodDays = days;
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

async function startReview(mode) {
  if (mode === 'none') {
    $('rev-step0').innerHTML = `<div class="quiet-end">好。想看这周的五维汇总，可以到「五维」页慢慢翻。</div>`;
    return;
  }
  $('rev-step0').classList.add('hidden');
  const stream = $('rev-stream');
  stream.classList.remove('hidden');
  stream.innerHTML = aiMsg(`<p class="soft">正在整理这${periodDays === 1 ? '一天' : '周'}的记录…</p>`);
  try {
    const { review_id } = await API('/api/reviews/generate', 'POST', { review_type: 'weekly', period_days: periodDays });
    const data = await API(`/api/reviews/${review_id}`);
    renderReviewStream(stream, data, mode);
  } catch (e) {
    stream.innerHTML = aiMsg(`<p>出错了：${esc(e.message)}</p>`);
  }
}

const STMT_KIND = { fact: ['kind-fact', '已确认事实'], calculation: ['kind-fact', '可计算'], inference: ['kind-guess', '推测'], theory: ['kind-theory', '理论'], recommendation: ['kind-advice', '建议'], limitation: ['kind-guess', '限制'] };

function renderReviewStream(stream, data, mode) {
  const stmts = data.statements.filter(s =>
    mode === 'facts' ? ['fact', 'calculation', 'limitation'].includes(s.statement_type) : true);
  let html = aiMsg(`<p>这是基于你确认过的记录整理的${periodDays === 1 ? '今天' : '本周'}复盘。我会说清楚哪些是事实、哪些只是我的推测。</p>`);
  html += stmts.map((s, i) => {
    const [kind, klabel] = STMT_KIND[s.statement_type] || STMT_KIND.fact;
    const title = { fact: '发生了什么', calculation: '进展与偏离', inference: '我猜的（不是事实）', theory: '一个可用的视角', recommendation: '建议', limitation: '数据不足' }[s.statement_type] || '复盘';
    const uncertain = JSON.parse(s.uncertain_points || '[]');
    return `<div class="rev-section">
      <h3><span class="step">${i + 1}</span>${title}<span class="kind-tag ${kind}">${klabel}</span></h3>
      <p>${esc(s.text)}</p>
      ${s.statement_type === 'fact' ? `<div class="fact-line"><span class="dot"></span><span>来自你确认的记录</span><span class="cite" onclick="toast('证据来自你的原文，未改写')">证据 ↗</span></div>` : ''}
      ${uncertain.length ? `<ul class="limit-list">${uncertain.map(u => `<li>${esc(u)}</li>`).join('')}</ul>` : ''}
      ${s.theory && s.theory.length ? s.theory.map(t => `
        <div class="why-box">
          <b>依据：</b>${esc(t.author)}《${esc(t.source_title)}》${t.year ? `（${t.year}）` : ''}
          ${t.citation ? `<br>${esc(t.citation)}` : ''}
          ${t.assumption_boundary ? `<br><b>适用边界：</b>${esc(t.assumption_boundary)}` : ''}
          <span class="cite" onclick="toast('引用可随时核对')">查看来源 ↗</span>
        </div>`).join('') : ''}
    </div>`;
  }).join('');
  const rec = data.recommendations[0];
  if (mode === 'guided') {
    if (rec) {
      html += aiMsg(`<p>如果这${periodDays === 1 ? '天' : '周'}只改一件小事，我会建议：</p>`);
      html += `<div class="obc">
        <h3>ONE BIG CHANGE</h3>
        <div class="sub">零个或一个 · 由你决定</div>
        <p><b>${esc(rec.text)}</b></p>
        ${rec.reason ? `<p class="soft">理由摘要：${esc(rec.reason)} 这只是候选，不是命令。</p>` : ''}
        ${rec.unknowns ? `<div class="why-box"><b>不确定处：</b>${esc(rec.unknowns)}</div>` : ''}
        <div class="actions">
          <button class="btn btn-primary" onclick="obcResolve(${rec.id},'accepted')">接受</button>
          <button class="btn btn-ghost" onclick="obcEdit(${rec.id})">改一改</button>
          <button class="btn btn-line" onclick="obcResolve(${rec.id},'rejected')">不要这个</button>
        </div>
      </div>`;
    } else {
      html += aiMsg(`<p>本期没有建议——「本次不需要改变」也是有效结论，不会变成隐形待办。</p>`);
    }
    html += feedbackStepHtml(data.review.id);
  }
  stream.innerHTML = html;
}

function feedbackStepHtml(reviewId) {
  return `<div class="rev-section">
    <h3>随口说两句（可跳过）</h3>
    <div class="feedback-row">
      <button class="fb" onclick="markFb(this)">准确</button>
      <button class="fb" onclick="markFb(this)">不准确</button>
      <button class="fb" onclick="markFb(this)">有帮助</button>
      <button class="fb" onclick="markFb(this)">没帮助</button>
      <button class="fb" onclick="markFb(this)">有依据</button>
      <button class="fb" onclick="markFb(this)">无依据</button>
    </div>
    <textarea class="fb-text" rows="2" placeholder="写点具体的（可留空）"></textarea>
    <div class="actions">
      <button class="btn btn-primary" onclick="finishReview(${reviewId})">完成</button>
    </div>
  </div>`;
}

function markFb(btn) { btn.classList.toggle('sel'); }

async function obcResolve(recId, status) {
  await API(`/api/recommendations/${recId}/status`, 'POST', { status });
  toast(status === 'accepted' ? '好，就改这一件' : '好，删掉。零建议不会变成隐形待办');
}
async function obcEdit(recId) {
  const t = prompt('改成你的版本：');
  if (!t) return;
  await API(`/api/recommendations/${recId}/status`, 'POST', { status: 'modified' });
  toast('好，以你的版本为准；我的原建议保留在修订记录里');
}
async function finishReview(reviewId) {
  const marked = [...document.querySelectorAll('.fb.sel')].map(b => b.textContent.trim());
  const ta = document.querySelector('.fb-text');
  await API(`/api/reviews/${reviewId}/feedback`, 'POST', {
    changed: marked.some(x => ['有帮助', '准确', '有依据'].includes(x)),
    feedback_text: [marked.join(' / '), ta ? ta.value.trim() : ''].filter(Boolean).join(' · '),
  }).catch(() => {});
  toast('反馈已记录，归你所有');
}

/* ================= 我的 ================= */
async function loadMe() {
  const { goals } = await API('/api/goals');
  $('goal-list').innerHTML = goals.length
    ? goals.map(g => `<div class="goal-row"><b>${esc(g.title)}</b><br>
        <span class="${g.status === 'active' ? 'aligned' : ''}">${g.status === 'active' ? '· 进行中' : '· ' + esc(g.status)}</span>
        ${g.metric ? `<br><span style="color:var(--muted);font-size:11.5px">指标：${esc(g.metric)}</span>` : ''}</div>`).join('')
    : '<div class="why-box">还没有核心目标。复盘中的建议被采纳后会成为候选目标。</div>';
}

/* ================= 导航 ================= */
const LOADERS = { chat: loadChat, dims: loadDims, review: null, me: loadMe };
function switchTab(tab, btn) {
  ['chat', 'dims', 'review', 'me'].forEach(t => $('screen-' + t).classList.toggle('hidden', t !== tab));
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b === btn));
  $('composer').style.display = tab === 'chat' ? '' : 'none';
  if (LOADERS[tab]) LOADERS[tab]();
}

/* 自动伸缩输入框 */
const box = $('captureInput');
box.addEventListener('input', () => { box.style.height = 'auto'; box.style.height = Math.min(box.scrollHeight, 120) + 'px'; });
box.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFree(); } });

loadChat();
