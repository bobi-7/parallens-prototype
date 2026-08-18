/* ============================================================
   Parallens 用户运营后台 · 共享壳与全局交互
   - 侧边栏/顶栏注入（含产品线/区域/角色切换器）
   - 全局状态 PLState（内存态，刷新重置）
   - toast / modal / 演示说明
   ============================================================ */

/** 全局状态（演示态：内存，刷新重置） */
window.PLState = { pl: 'both', region: 'all', role: 'operator' };

/* ---------------- 侧边栏 ---------------- */

var NAV = [
  { group: '工作台', items: [ { icon: '🏠', label: '工作台', href: 'index.html', v2: false } ] },
  { group: '本期三大模块', items: [
    { icon: '👥', label: '用户管理', v2: false, children: [
      { label: '用户列表', href: 'users-list.html' },
      { label: '用户分组', href: 'audience-builder.html' },
    ] },
    { icon: '💰', label: '商业化', v2: false, children: [
      { label: '套餐配置', href: 'plans-list.html' },
      { label: '套餐编辑器', href: 'plan-editor.html' },
      { label: '权益下发', href: 'benefit-list.html' },
      { label: '权益下发向导', href: 'benefit-editor.html' },
      { label: '订单查询', href: 'order-list.html' },
    ] },
    { icon: '📢', label: '策略触达', v2: false, children: [
      { label: '策略配置', href: 'strategy-list.html' },
      { label: '策略编辑器', href: 'strategy-editor.html' },
      { label: '渠道适配', href: 'channels.html' },
      { label: '全局频控', href: 'frequency.html' },
    ] },
  ] },
  { group: '后续版本（v2）', items: [
    { icon: '📱', label: '设备管理', v2: true },
    { icon: '🌐', label: '探索社区', v2: true },
    { icon: '📊', label: '数据看板', v2: true },
    { icon: '🎯', label: '用户激励与裂变', v2: true },
    { icon: '⚙️', label: '系统设置（RBAC/日志）', v2: true },
  ] },
];

function renderSidebar(activePath) {
  var html = '';
  html += '<div class="sidebar-brand">' +
    '<div class="brand-mark">👁</div>' +
    '<div><div class="brand-name">Parallens</div><div class="brand-sub">用户运营后台 · Demo</div></div>' +
    '</div>';
  NAV.forEach(function (g) {
    html += '<div class="nav-group">' + g.group + '</div>';
    g.items.forEach(function (it) {
      if (it.v2) {
        html += '<div class="nav-item v2"><span class="nav-icon">' + it.icon + '</span>' + it.label + '<span class="badge-v2">v2</span></div>';
      } else if (it.children) {
        var open = it.children.some(function (c) { return c.href === activePath; });
        html += '<div class="nav-group" style="padding-top:2px;padding-bottom:2px;"></div>';
        it.children.forEach(function (c) {
          var cls = 'nav-item' + (c.href === activePath ? ' active' : '');
          html += '<a class="' + cls + '" href="' + c.href + '"><span class="nav-icon"></span>' + c.label + '</a>';
        });
      } else {
        var cls2 = 'nav-item' + (it.href === activePath ? ' active' : '');
        html += '<a class="' + cls2 + '" href="' + it.href + '"><span class="nav-icon">' + it.icon + '</span>' + it.label + '</a>';
      }
    });
  });
  html += '<div class="sidebar-foot">Demo v1.0 · 2026-08-07<br>状态存内存，刷新即重置</div>';
  return html;
}

/* ---------------- 顶栏 ---------------- */

function topbarSegs() {
  var pl = PLState.pl;
  var role = PLState.role;
  return '' +
    '<div class="topbar-seg"><span class="switch-label">产品线</span>' +
    '<div class="seg seg-pl" id="pl-switch">' +
    '<button data-pl="both" class="' + (pl === 'both' ? 'on' : '') + '">全部</button>' +
    '<button data-pl="bird" class="' + (pl === 'bird' ? 'on' : '') + '">🐦 观鸟</button>' +
    '<button data-pl="hunt" class="' + (pl === 'hunt' ? 'on' : '') + '">🦌 狩猎</button>' +
    '</div></div>' +
    '<div class="topbar-seg"><span class="switch-label">区域</span>' +
    '<div class="seg" id="region-switch">' +
    '<button data-region="all" class="' + (PLState.region === 'all' ? 'on' : '') + '">全部</button>' +
    '<button data-region="na" class="' + (PLState.region === 'na' ? 'on' : '') + '">北美</button>' +
    '<button data-region="eu" class="' + (PLState.region === 'eu' ? 'on' : '') + '">欧洲</button>' +
    '</div></div>' +
    '<div class="topbar-seg role-switch"><span class="switch-label">角色</span>' +
    '<div class="seg" id="role-switch">' +
    '<button data-role="operator" class="' + (role === 'operator' ? 'on' : '') + '">运营</button>' +
    '<button data-role="approver" class="' + (role === 'approver' ? 'on' : '') + '">审批人</button>' +
    '<button data-role="admin" class="' + (role === 'admin' ? 'on' : '') + '">管理员</button>' +
    '</div></div>';
}

/** 页面入口：注入壳。opts: {title, prd, demo:{points[], path[]}, noApproval} */
PL.shell = function (opts) {
  var path = location.pathname.split('/').pop() || 'index.html';
  var html = '<div class="layout">' +
    '<aside class="sidebar" id="sidebar">' + renderSidebar(path) + '</aside>' +
    '<div class="main">' +
    '<div class="topbar">' +
    '<div class="page-title">' + opts.title + (opts.prd ? '<span class="prd-ref">PRD §' + opts.prd + '</span>' : '') + '</div>' +
    topbarSegs() +
    '<button class="demo-btn" id="demo-btn">💡 演示说明</button>' +
    '</div>' +
    '<div class="content" id="content">' +
    '<div id="approval-anchor"></div>' +
    '</div>' +
    '</div></div>' +
    '<div id="toast-root"></div>';
  document.body.innerHTML = html;

  /* 切换器事件 */
  document.getElementById('pl-switch').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    PLState.pl = b.dataset.pl;
    document.querySelectorAll('#pl-switch button').forEach(function (x) { x.classList.toggle('on', x === b); });
    document.dispatchEvent(new CustomEvent('pl-change'));
    PL.toast('已切换产品线：' + (PLState.pl === 'both' ? '全部' : PLState.pl === 'bird' ? '观鸟线' : '狩猎线'), 'ok');
  });
  document.getElementById('region-switch').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    PLState.region = b.dataset.region;
    document.querySelectorAll('#region-switch button').forEach(function (x) { x.classList.toggle('on', x === b); });
    PL.toast('区域：' + (PLState.region === 'all' ? '全部' : PLState.region === 'na' ? '北美' : '欧洲'));
  });
  document.getElementById('role-switch').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    PLState.role = b.dataset.role;
    document.querySelectorAll('#role-switch button').forEach(function (x) { x.classList.toggle('on', x === b); });
    PL.toast(PLState.role === 'approver' ? '审批人视角：待办审批面板已出现' : PLState.role === 'admin' ? '管理员视角' : '运营视角', 'ok');
    var ev = new CustomEvent('role-change'); document.dispatchEvent(ev);
  });

  /* 演示说明 */
  document.getElementById('demo-btn').addEventListener('click', function () { PL.demoInfo(opts.demo); });
  if (opts.demo) PL.demoInfo(opts.demo, true);
  return document.getElementById('content');
};

/* ---------------- Toast ---------------- */

PL.toast = function (msg, type) {
  var root = document.getElementById('toast-root');
  if (!root) return;
  var el = document.createElement('div');
  el.className = 'toast ' + (type || '');
  el.innerHTML = (type === 'ok' ? '✓ ' : type === 'err' ? '✕ ' : type === 'warn' ? '⚠ ' : '· ') + PL.esc(msg);
  root.appendChild(el);
  setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function () { el.remove(); }, 320); }, 3200);
};

/* ---------------- Modal ---------------- */

PL.modal = function (opts) {
  var mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = '<div class="modal">' +
    '<div class="modal-head">' + PL.esc(opts.title || '') +
    '<button class="close" id="m-close">×</button></div>' +
    '<div class="modal-body">' + opts.body + '</div>' +
    (opts.footer ? '<div class="modal-foot">' + opts.footer + '</div>' : '') +
    '</div>';
  document.body.appendChild(mask);
  function close() { mask.remove(); }
  mask.querySelector('#m-close').addEventListener('click', close);
  mask.addEventListener('click', function (e) { if (e.target === mask && !opts.locked) close(); });
  return { close: close, el: mask };
};

/* ---------------- 演示说明 ---------------- */

PL.demoInfo = function (demo, auto) {
  if (!demo) return;
  var old = document.querySelector('.demo-pop');
  if (old) { old.remove(); return; }
  var el = document.createElement('div');
  el.className = 'demo-pop';
  el.innerHTML = '<button class="demo-close">×</button>' +
    '<span class="prd-tag">PRD §' + PL.esc(demo.prd) + '</span>' +
    '<h4>💡 本页演示</h4>' +
    demo.points.map(function (p) { return '<p>· ' + PL.esc(p) + '</p>'; }).join('') +
    (demo.path ? '<p style="margin-top:8px;color:#8fa89b">▶ 建议路径：' + PL.esc(demo.path) + '</p>' : '');
  el.querySelector('.demo-close').addEventListener('click', function () { el.remove(); });
  document.body.appendChild(el);
};

/* ---------------- 审批面板（审批人视角） ---------------- */

PL.approvalPanel = function (items) {
  var anchor = document.getElementById('approval-anchor');
  if (!anchor) return;
  if (PLState.role !== 'approver') { anchor.innerHTML = ''; return; }
  var html = '<div class="approval-panel">' +
    '<div class="ap-head">🛂 待办审批 <span style="font-weight:400;font-size:11px;opacity:.7">（审批人视角）</span></div>';
  items.forEach(function (it) {
    html += '<div class="ap-item">' +
      '<b>' + PL.esc(it.name) + '</b>' +
      '<span class="badge badge-blue">' + PL.esc(it.type) + '</span>' +
      '<span style="color:var(--ink-3)">' + PL.esc(it.submitter) + ' · ' + PL.esc(it.time) + '</span>' +
      '<span class="ap-action">' +
      '<button class="btn btn-sm btn-primary" data-approve="' + it.id + '">通过</button>' +
      '<button class="btn btn-sm btn-danger" data-reject="' + it.id + '">驳回</button>' +
      '</span></div>';
  });
  html += '</div>';
  anchor.innerHTML = html;

  anchor.querySelectorAll('[data-approve]').forEach(function (b) {
    b.addEventListener('click', function () {
      var it = items.find(function (x) { return x.id === b.dataset.approve; });
      if (it.onApprove) it.onApprove();
      PL.toast('已通过审批：' + it.name, 'ok');
      refreshApproval();
    });
  });
  anchor.querySelectorAll('[data-reject]').forEach(function (b) {
    b.addEventListener('click', function () {
      var it = items.find(function (x) { return x.id === b.dataset.reject; });
      if (it.onReject) it.onReject();
      PL.toast('已驳回：' + it.name + '（回草稿）', 'warn');
      refreshApproval();
    });
  });
  function refreshApproval() {
    document.dispatchEvent(new CustomEvent('approval-done'));
  }
};

/** 订阅审批面板刷新事件（页面自行处理剩余待办） */
PL.requestApprovalRefresh = function () { /* 占位：页面监听 approval-done 更新数据 */ };
