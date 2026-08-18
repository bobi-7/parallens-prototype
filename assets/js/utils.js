/* ============================================================
   Parallens 用户运营后台 · 公共工具（纯函数，无副作用）
   命名空间：PL
   ============================================================ */
window.PL = {};

/** HTML 转义 */
PL.esc = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

/** 金额 */
PL.money = function (n) {
  if (n == null) return '—';
  return '$' + Number(n).toFixed(2).replace(/\.00$/, '');
};

/** 产品线标签 */
PL.plTag = function (pl) {
  var map = { bird: ['pl-tag bird', '🐦 观鸟线'], hunt: ['pl-tag hunt', '🦌 狩猎线'], both: ['pl-tag both', '双线'] };
  var m = map[pl] || map.both;
  return '<span class="' + m[0] + '">' + m[1] + '</span>';
};

/** 状态徽章（后台通用状态机） */
PL.badge = function (status) {
  var map = {
    '草稿': 'badge-gray', '审批中': 'badge-blue', '生效中': 'badge-green', '已上架': 'badge-green',
    '生效': 'badge-green', '已发布': 'badge-green', '已停用': 'badge-gray', '待生效': 'badge-orange',
    '下发中': 'badge-blue', '部分成功': 'badge-orange', '已完成': 'badge-green', '已终止': 'badge-red',
    '体验中（7天）': 'badge-blue', '体验中（第10天）': 'badge-orange',
  };
  return '<span class="badge ' + (map[status] || 'badge-gray') + '">' + PL.esc(status) + '</span>';
};

/** 布尔徽章（是/否） */
PL.boolBadge = function (v) {
  return v ? '<span class="badge badge-green">开</span>' : '<span class="badge badge-gray">关</span>';
};

/** 空态 */
PL.empty = function (text) {
  return '<div class="empty-state"><div class="es-icon">🪶</div><p>' + PL.esc(text || '暂无数据') + '</p></div>';
};

/** 简单表格渲染 */
PL.table = function (cols, rows, opts) {
  opts = opts || {};
  var th = '<tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
  var body;
  if (!rows || !rows.length) {
    body = '<tr><td colspan="' + cols.length + '">' + PL.empty(opts.emptyText || '暂无数据') + '</td></tr>';
  } else {
    body = rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('');
  }
  return '<div class="table-wrap"><table class="table"><thead>' + th + '</thead><tbody>' + body + '</tbody></table></div>';
};

/** 表单字段行（编辑器用） */
PL.field = function (label, inputHtml, opts) {
  opts = opts || {};
  return '<div class="form-field">' +
    '<label>' + PL.esc(label) + (opts.req ? '<span class="req">*</span>' : '') + '</label>' +
    inputHtml +
    (opts.help ? '<span class="help">' + opts.help + '</span>' : '') +
    '</div>';
};

/** 多语言 Tab（en/de/fr） */
PL.langTabs = function () {
  return '<div class="lang-tabs">' +
    ['en', 'de', 'fr'].map(function (l, i) {
      return '<span class="lang-tab' + (i === 0 ? ' on' : '') + '" data-lang="' + l + '">' + l.toUpperCase() + '</span>';
    }).join('') +
    '</div><span class="lang-fallback">未配置的语言回退英语（en）</span>';
};
