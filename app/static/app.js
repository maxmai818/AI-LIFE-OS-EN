/* AI Life OS · 应用层前端（变体 2 对话式皮肤） */
const view = document.getElementById('view');
let currentTab = 'capture';

async function api(path, method = 'GET', body = null) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) throw new Error((await res.json()).detail || res.status);
  return res.json();
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dirChip = imp => {
  const cls = imp.direction === 'positive' ? 'pos' : imp.direction === 'negative' ? 'neg' : imp.direction === 'mixed' ? 'mix' : '';
  return `<span class="chip ${cls}"><span class="dot"></span>${imp.dimension_key} ${imp.direction}${imp.degree ? ' ' + imp.degree : ''}</span>`;
};

async function renderCapture() {
  view.innerHTML = `
    <div class="bubble">和我说说你今天做了什么、想了什么。原文永远保留，AI 只是帮你整理。</div>
    <textarea id="cap" placeholder="例如：今天跑了 30 分钟，晚上和妈妈通了电话，有点担心下周的项目…"></textarea>
    <button class="primary" onclick="submitCapture()">记录</button>
    <div id="caps"></div>`;
  const data = await api('/api/captures');
  document.getElementById('caps').innerHTML = data.captures.map(c => `
    <div class="bubble me">${esc(c.raw_text)}<small>${c.captured_at.slice(0, 16).replace('T', ' ')} · ${c.status}
      ${c.status === 'saved' ? `<button class="ghost" onclick="runExtract(${c.id})">AI 整理</button>` : ''}</small></div>`).join('')
    || '<div class="empty">还没有记录</div>';
}

async function submitCapture() {
  const t = document.getElementById('cap').value.trim();
  if (!t) return;
  await api('/api/captures', 'POST', { raw_text: t });
  renderCapture();
}

async function runExtract(id) {
  view.innerHTML = '<div class="bubble">正在整理…</div>';
  await api(`/api/captures/${id}/extract`, 'POST');
  currentTab = 'confirm';
  setActiveTab();
  renderConfirm();
}

async function renderConfirm() {
  const data = await api('/api/pending');
  if (!data.items.length) { view.innerHTML = '<div class="empty">没有待确认的条目，去「记录」写一条吧</div>'; return; }
  view.innerHTML = '<div class="bubble">AI 整理出这些内容，确认 / 修改 / 不要。你的话算数，AI 只是候选。</div>' +
    data.items.map(it => `
    <div class="dim-card" id="item-${it.id}">
      <h3>${esc(it.item_type)} <small style="color:var(--sub);font-weight:400">置信 ${it.confidence ?? '—'}</small></h3>
      <p style="color:var(--ink)">${esc(it.text_value)}</p>
      <div>${it.impacts.map(dirChip).join('')}</div>
      <div class="row">
        <button onclick="itemAct(${it.id},'confirm')">✓ 确认</button>
        <button class="ghost" onclick="showEdit(${it.id})">✎ 修改</button>
        <button class="danger" onclick="itemAct(${it.id},'reject')">✗ 不要</button>
        <button class="ghost" onclick="itemAct(${it.id},'later')">稍后</button>
      </div>
    </div>`).join('');
}

function showEdit(id) {
  const card = document.getElementById('item-' + id);
  if (card.querySelector('.edit-input')) return;
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.placeholder = '改成你认为对的描述，回车保存';
  input.onkeydown = e => {
    if (e.key === 'Enter' && input.value.trim()) {
      api(`/api/items/${id}/revise`, 'POST', { field_name: 'text_value', corrected_value: input.value.trim() })
        .then(renderConfirm);
    }
  };
  card.appendChild(input);
  input.focus();
}

async function itemAct(id, act) {
  await api(`/api/items/${id}/${act}`, 'POST');
  renderConfirm();
}

async function renderDims() {
  const [d, g] = await Promise.all([api('/api/dimensions'), api('/api/goals')]);
  const colors = { time: 'var(--time)', health: 'var(--health)', wealth: 'var(--wealth)', relationship: 'var(--rel)', purpose: 'var(--purpose)' };
  view.innerHTML = d.dimensions.map(dim => `
    <div class="dim-card">
      <h3><span class="dot" style="width:10px;height:10px;border-radius:50%;background:${colors[dim.key]};display:inline-block"></span>
        ${dim.name} · ${dim.qualitative}</h3>
      <div class="bar"><i style="width:${Math.min(100, (dim.positive + dim.mixed * 0.5) * 20 + (dim.avg_degree ? dim.avg_degree * 10 : 0))}%;background:${colors[dim.key]}"></i></div>
      <p>正向 ${dim.positive} · 负向 ${dim.negative} · 混合 ${dim.mixed}${dim.avg_degree ? ' · 平均程度 ' + dim.avg_degree : ''}（仅已确认记录）</p>
      ${dim.evidence.slice(0, 2).map(e => `<p>› ${esc(e.text)}</p>`).join('')}
    </div>`).join('') +
    `<div class="bubble">目标（最多 3 个，非零和、无总分）</div>` +
    (g.goals.map(x => `<div class="dim-card"><h3>${esc(x.title)}</h3><p>${x.status} · ${x.measurable ? esc(x.metric || '可量化') : '定性目标（无伪进度）'}</p></div>`).join('')
      || '<div class="empty">还没有目标</div>') +
    `<button class="primary" onclick="addGoal()">＋ 新目标</button>`;
}

async function addGoal() {
  const t = prompt('目标一句话（例如：建立稳定的运动习惯）');
  if (!t) return;
  try { await api('/api/goals', 'POST', { title: t }); renderDims(); }
  catch (e) { alert(e.message); }
}

async function renderReview() {
  const data = await api('/api/reviews');
  view.innerHTML = `
    <div class="bubble">复盘只写证据支持的内容。建议最多一条，「本次不需要改变」也是好答案。</div>
    <button class="primary" onclick="genReview()">生成本周复盘</button>
    <div id="revs">${data.reviews.map(r => `
      <div class="bubble" style="cursor:pointer" onclick="showReview(${r.id})">
        ${esc(r.title)}<small>${r.period_start.slice(0, 10)} ~ ${r.period_end.slice(0, 10)}</small></div>`).join('')}</div>`;
}

async function genReview() {
  view.innerHTML = '<div class="bubble">正在生成复盘…</div>';
  const r = await api('/api/reviews/generate', 'POST', { review_type: 'weekly', period_days: 7 });
  showReview(r.review_id);
}

const typeLabel = { fact: '事实', calculation: '计算', inference: '推断', theory: '理论', recommendation: '建议', limitation: '局限' };

async function showReview(id) {
  const data = await api(`/api/reviews/${id}`);
  const recs = data.recommendations;
  view.innerHTML = `
    <div class="bubble">复盘（${data.review.period_start.slice(0, 10)} 起）· 点击返回列表 <button class="ghost" onclick="renderReview()">←</button></div>
    ${data.statements.map(s => `
      <div class="stmt ${s.statement_type}">
        <div class="type">${typeLabel[s.statement_type] || s.statement_type}${s.confidence != null ? ' · 置信 ' + s.confidence : ''}</div>
        ${esc(s.text)}
        ${s.theory && s.theory.length ? `<small>📚 ${esc(s.theory[0].author)}《${esc(s.theory[0].source_title)}》· 边界：${esc(s.theory[0].assumption_boundary || '—')}</small>` : ''}
      </div>`).join('')}
    ${recs.length ? `<div class="big-change"><h3>ONE BIG CHANGE</h3><p>${esc(recs[0].text)}</p>
      <div class="row">
        <button onclick="recAct(${recs[0].id},'accepted')">采纳</button>
        <button class="ghost" onclick="recAct(${recs[0].id},'rejected')">这次不需要</button>
      </div></div>` : '<div class="empty">本次不需要改变（零建议）</div>'}
    <div class="bubble">这轮复盘对你有帮助吗？<div class="row">
      <button class="ghost" onclick="fb(${id},true)">有</button>
      <button class="ghost" onclick="fb(${id},false)">没有</button>
    </div></div>`;
}

async function recAct(id, status) { await api(`/api/recommendations/${id}/status`, 'POST', { status }); renderReview(); }
async function fb(id, changed) {
  const t = prompt('想补充一句吗？（可留空）') || '';
  await api(`/api/reviews/${id}/feedback`, 'POST', { changed, feedback_text: t });
  renderReview();
}

function setActiveTab() {
  document.querySelectorAll('.tabbar button').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === currentTab));
}
const renderers = { capture: renderCapture, confirm: renderConfirm, dims: renderDims, review: renderReview };
document.querySelectorAll('.tabbar button').forEach(b => b.addEventListener('click', () => {
  currentTab = b.dataset.tab; setActiveTab(); renderers[currentTab]();
}));
renderCapture();
