// Chạy toàn bộ luồng main() với Google Ads / Sheets / Claude GIẢ để kiểm tra nối ghép.
// Không kiểm chứng được tên trường GAQL hay API thật của Google Ads.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const C = '1.Dịch vụ kế toán trọn gói';
const G = 'Dịch vụ kế toán';

function iter(arr) { let i = 0; return { hasNext: () => i < arr.length, next: () => arr[i++] }; }

function makeWorld() {
  const world = { mutations: [], sheets: {}, mails: [], fetchBodies: [], claudeText: '' };

  const kwRows = [
    ['dịch vụ kế toán trọn gói', 'EXACT', 4, 'BELOW_AVERAGE', 'AVERAGE', 'AVERAGE', 'ENABLED', 120, 6, 300000, 0.5],
    ['dịch vụ kế toán q2', 'EXACT', 0, 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'RARELY_SERVED', 0, 0, 0, 0],
    ['phí dịch vụ kế toán', 'EXACT', 10, 'ABOVE_AVERAGE', 'ABOVE_AVERAGE', 'ABOVE_AVERAGE', 'ELIGIBLE', 30, 2, 80000, 1],
  ].map(([t, m, qs, lp, ctr, rel, serving, imp, clk, cost, conv]) => ({
    'campaign.name': C, 'ad_group.name': G, 'ad_group_criterion.keyword.text': t,
    'ad_group_criterion.keyword.match_type': m, 'ad_group_criterion.quality_info.quality_score': qs,
    'ad_group_criterion.quality_info.post_click_quality_score': lp,
    'ad_group_criterion.quality_info.search_predicted_ctr': ctr,
    'ad_group_criterion.quality_info.creative_quality_score': rel,
    'ad_group_criterion.system_serving_status': serving,
    'metrics.impressions': imp, 'metrics.clicks': clk, 'metrics.cost_micros': cost * 1e6,
    'metrics.conversions': conv, 'metrics.average_cpc': clk ? (cost / clk) * 1e6 : 0,
  }));

  const rowsFor = (q) => {
    if (q.includes('FROM campaign_criterion')) return [
      { 'campaign.name': C, 'campaign_criterion.keyword.text': 'misa', 'campaign_criterion.keyword.match_type': 'PHRASE' }];
    if (q.includes('FROM keyword_view')) return kwRows;
    if (q.includes('FROM search_term_view')) return [{ 'search_term_view.search_term': 'hóa đơn điện tử', 'campaign.name': C,
      'ad_group.name': G, 'metrics.impressions': 5, 'metrics.clicks': 1, 'metrics.cost_micros': 40000e6, 'metrics.conversions': 0 }];
    if (q.includes('FROM ad_group_ad')) return [{ 'campaign.name': C, 'ad_group.name': G, 'ad_group_ad.status': 'ENABLED',
      'ad_group_ad.ad_strength': 'AVERAGE', 'ad_group_ad.ad.type': 'RESPONSIVE_SEARCH_AD',
      'ad_group_ad.ad.final_urls': '["https://example.com/ke-toan"]',
      'ad_group_ad.policy_summary.approval_status': 'APPROVED', 'metrics.impressions': 100, 'metrics.clicks': 8,
      'metrics.cost_micros': 380000e6, 'metrics.conversions': 0.5 }];
    if (q.includes("campaign.status = 'ENABLED'")) return [{ 'campaign.id': 1 }];
    if (q.includes('DURING YESTERDAY') || q.includes('DURING TODAY')) return [{ 'metrics.impressions': 10 }];
    if (q.includes('FROM customer')) return [
      { 'segments.date': '2026-11-10', 'metrics.impressions': 120, 'metrics.clicks': 8, 'metrics.cost_micros': 380000e6, 'metrics.conversions': 0.5 },
      { 'segments.date': '2026-11-11', 'metrics.impressions': 0, 'metrics.clicks': 0, 'metrics.cost_micros': 0, 'metrics.conversions': 0 }];
    if (q.includes('FROM campaign WHERE')) return [{ 'campaign.name': C, 'campaign.status': 'ENABLED',
      'campaign.bidding_strategy_type': 'MAXIMIZE_CLICKS', 'campaign_budget.amount_micros': 500000e6,
      'metrics.impressions': 150, 'metrics.clicks': 8, 'metrics.cost_micros': 380000e6, 'metrics.conversions': 0.5,
      'metrics.search_impression_share': 0.1, 'metrics.search_budget_lost_impression_share': 0, 'metrics.search_rank_lost_impression_share': 0.8 }];
    throw new Error('Truy vấn không được mock: ' + q.slice(0, 80));
  };

  const mkKeyword = (text, match) => ({
    getAdGroup: () => ({ getName: () => G }), getText: () => text, getMatchType: () => match,
    getStatsFor: () => ({ getConversions: () => (text === 'phí dịch vụ kế toán' ? 1 : 0) }),
    pause: () => world.mutations.push(['pause', text]),
  });
  const adGroup = {
    newKeywordBuilder: () => ({ withText(t) { this.t = t; return this; },
      build() { world.mutations.push(['addKeyword', this.t]); return { isSuccessful: () => true, getErrors: () => [] }; } }),
    newAd: () => ({ responsiveSearchAdBuilder: () => ({
      withHeadlines(h) { this.h = h; return this; }, withDescriptions(d) { this.d = d; return this; },
      withFinalUrl(u) { this.u = u; return this; },
      build() { world.mutations.push(['addRsa', this.h, this.d, this.u]);
        return { isSuccessful: () => true, getErrors: () => [], getResult: () => ({ pause: () => world.mutations.push(['pauseNewAd']) }) }; } }) }),
  };
  const chain = (get) => ({ withCondition() { return this; }, get });

  const AdsApp = {
    report: (q) => ({ rows: () => iter(rowsFor(q)) }),
    currentAccount: () => ({ getTimeZone: () => 'Asia/Ho_Chi_Minh' }),
    campaigns: () => chain(() => iter([{ getName: () => C, createNegativeKeyword: (l) => world.mutations.push(['negative', l]) }])),
    adGroups: () => chain(() => iter([adGroup])),
    keywords: () => chain(() => iter([mkKeyword('dịch vụ kế toán trọn gói', 'EXACT'), mkKeyword('dịch vụ kế toán q2', 'EXACT'), mkKeyword('phí dịch vụ kế toán', 'EXACT')])),
    ads: () => ({ withCondition() { return this; }, get() { throw new Error('ads() không được hỗ trợ trong mock'); } }),
  };

  function makeSheet(name) {
    const data = [];
    const sheet = {
      data,
      getLastRow: () => data.length,
      appendRow: (r) => { data.push(r.slice()); },
      setFrozenRows() {},
      getDataRange: () => ({ getValues: () => { const w = Math.max(0, ...data.map((r) => r.length)); return data.map((r) => Array.from({ length: w }, (_, i) => (r[i] === undefined ? '' : r[i]))); } }),
      getRange(r, c, nr = 1, nc = 1) {
        const rng = { setValues(vals) { vals.forEach((row, i) => row.forEach((v, j) => { while (data.length < r + i) data.push([]); data[r - 1 + i][c - 1 + j] = v; })); return rng; },
          setFontWeight() { return rng; }, setDataValidation() { return rng; } };
        return rng;
      },
    };
    world.sheets[name] = sheet;
    return sheet;
  }
  const ss = { getSheetByName: (n) => world.sheets[n] || null, insertSheet: (n) => makeSheet(n) };

  const ctx = {
    AdsApp, Logger: { log() {} }, MailApp: { sendEmail: (...a) => world.mails.push(a) },
    SpreadsheetApp: { openByUrl: () => ss, newDataValidation: () => ({ requireValueInList() { return this; }, build() { return {}; } }) },
    Utilities: { formatDate: (d, tz, f) => (f === 'u' ? '1' : '261107') },
    UrlFetchApp: { fetch: (url, opts) => { world.fetchBodies.push({ url, opts });
      return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: world.claudeText }] }) }; } },
    console,
  };
  world.ctx = vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'autopilot.js'), 'utf8'), world.ctx);
  return world;
}

const PROPOSALS = [
  { type: 'ADD_NEGATIVE', campaign: C, text: 'hóa đơn điện tử', match_type: 'PHRASE', reason: '[Thành phần: expected_ctr] Truy vấn lạc đề', evidence: '5 hiển thị, 1 nhấp, 40.000 VND, 0 chuyển đổi', confidence: 'high' },
  { type: 'ADD_NEGATIVE', campaign: C, text: 'kế toán trọn gói', match_type: 'PHRASE', reason: 'sẽ chặn từ khóa của mình', evidence: '', confidence: 'low' },
  { type: 'PAUSE_KEYWORD', campaign: C, ad_group: G, text: 'dịch vụ kế toán q2', match_type: 'EXACT', reason: 'Hiếm khi phân phát', evidence: '0 hiển thị', confidence: 'high' },
  { type: 'ADD_KEYWORD', campaign: C, ad_group: G, text: 'báo cáo thuế doanh nghiệp', match_type: 'PHRASE', reason: '[Thành phần: ad_relevance] ...', evidence: '...', confidence: 'medium' },
  { type: 'ADD_KEYWORD', campaign: C, ad_group: G, text: 'dịch vụ kế toán trọn gói', match_type: 'EXACT', reason: 'đã có', evidence: '', confidence: 'low' },
  { type: 'ADD_RSA', campaign: C, ad_group: G, final_url: 'https://example.com/ke-toan',
    headlines: ['Dịch vụ kế toán trọn gói', 'Kế toán thuế TPHCM', 'Tư vấn qua Zalo'],
    descriptions: ['Làm báo cáo thuế, quyết toán cho doanh nghiệp.', 'Liên hệ để được tư vấn.'],
    reason: '[Thành phần: ad_relevance] Thêm từ khóa chính vào tiêu đề', evidence: 'ad_relevance trung bình', confidence: 'medium' },
  { type: 'ADD_RSA', campaign: C, ad_group: G, final_url: 'https://example.com/ke-toan',
    headlines: ['Kinh nghiệm 10 năm', 'Kế toán thuế TPHCM', 'Tư vấn qua Zalo'],
    descriptions: ['Làm báo cáo thuế.', 'Liên hệ ngay.'], reason: 'bịa số', evidence: '', confidence: 'low' },
  { type: 'SET_BUDGET', campaign: C, text: '1000000', reason: 'không được phép', evidence: '', confidence: 'low' },
  { type: 'NOTE', text: 'Trang đích của nhóm này nên có bảng giá và nút gọi ở đầu trang.', reason: '[Thành phần: landing_page]', evidence: '16/35 từ khóa dưới TB', confidence: 'medium' },
];

test('end to end: propose, approve, dry-run, then apply', () => {
  const w = makeWorld();
  Object.assign(w.ctx.CONFIG, { SPREADSHEET_URL: 'x', ANTHROPIC_API_KEY: 'k', NOTIFY_EMAIL: 'a@b.c', FORCE_ANALYZE: true, DRY_RUN: true });
  w.claudeText = 'Kết quả:\n```json\n' + JSON.stringify(PROPOSALS) + '\n```';

  // 1) phân tích -> chỉ ghi đề xuất, không sửa tài khoản
  vm.runInContext('main()', w.ctx);
  assert.deepStrictEqual(w.mutations, []);
  const body = JSON.parse(w.fetchBodies[0].opts.payload);
  assert.strictEqual(body.model, 'claude-opus-5-5');
  assert.ok(body.messages[0].content.includes('kpi_now'));
  const prop = w.sheets['Đề xuất'].data;
  const types = prop.slice(1).map((r) => r[2]);
  assert.deepStrictEqual(types, ['ADD_NEGATIVE', 'PAUSE_KEYWORD', 'ADD_KEYWORD', 'ADD_RSA', 'NOTE']);
  assert.strictEqual(w.sheets['Theo dõi KPI'].data.length, 2);   // header + 1 dòng KPI
  const logText = JSON.stringify(w.sheets['Nhật ký'].data);
  assert.ok(logText.includes('chặn nhầm') && logText.includes('không có trong BUSINESS_FACTS') && logText.includes('Loại không được phép'));
  assert.ok(w.mails.some((m) => m[1].includes('đề xuất mới')));

  // 2) duyệt tất cả
  prop.slice(1).forEach((r) => { r[10] = 'Duyệt'; });

  // 3) DRY_RUN: vẫn không sửa tài khoản
  vm.runInContext('main()', w.ctx);
  assert.deepStrictEqual(w.mutations, []);
  assert.deepStrictEqual(prop.slice(1, 5).map((r) => r[11]), ['Mô phỏng OK', 'Mô phỏng OK', 'Mô phỏng OK', 'Mô phỏng OK']);

  // 4) áp dụng thật
  w.ctx.CONFIG.DRY_RUN = false;
  vm.runInContext('main()', w.ctx);
  assert.deepStrictEqual(w.mutations.map((m) => m[0]), ['negative', 'pause', 'addKeyword', 'addRsa']);
  assert.strictEqual(w.mutations[0][1], '"hóa đơn điện tử"');
  assert.strictEqual(w.mutations[2][1], '"báo cáo thuế doanh nghiệp"');
  assert.deepStrictEqual(prop.slice(1, 5).map((r) => r[11]), ['Đã áp dụng', 'Đã áp dụng', 'Đã áp dụng', 'Đã áp dụng']);

  // 5) chạy lại: không áp dụng lần hai
  const n = w.mutations.length;
  vm.runInContext('main()', w.ctx);
  assert.strictEqual(w.mutations.length, n);
});

test('user edit of ad text is re-validated at apply time', () => {
  const w = makeWorld();
  Object.assign(w.ctx.CONFIG, { SPREADSHEET_URL: 'x', ANTHROPIC_API_KEY: 'k', FORCE_ANALYZE: true, DRY_RUN: false });
  w.claudeText = JSON.stringify([PROPOSALS[5]]);
  vm.runInContext('main()', w.ctx);
  const prop = w.sheets['Đề xuất'].data;
  prop[1][5] = prop[1][5] + '\nH: Giảm 50% phí tháng đầu';   // người dùng thêm tiêu đề có số bịa
  prop[1][10] = 'Duyệt';
  vm.runInContext('main()', w.ctx);
  assert.deepStrictEqual(w.mutations, []);
  assert.strictEqual(prop[1][11], 'Bị chặn');
});

test('rejected proposals are not proposed again, and approvals are required', () => {
  const w = makeWorld();
  Object.assign(w.ctx.CONFIG, { SPREADSHEET_URL: 'x', ANTHROPIC_API_KEY: 'k', FORCE_ANALYZE: true, DRY_RUN: false });
  w.claudeText = JSON.stringify([PROPOSALS[0]]);
  vm.runInContext('main()', w.ctx);
  const prop = w.sheets['Đề xuất'].data;
  vm.runInContext('main()', w.ctx);                       // chưa duyệt -> không làm gì
  assert.deepStrictEqual(w.mutations, []);
  prop[1][10] = 'Từ chối';
  vm.runInContext('main()', w.ctx);                       // đề xuất lại cùng nội dung -> bị bỏ qua
  assert.strictEqual(prop.length, 2);
  assert.deepStrictEqual(w.mutations, []);
});

test('no API key: skips analysis without crashing', () => {
  const w = makeWorld();
  Object.assign(w.ctx.CONFIG, { SPREADSHEET_URL: 'x', ANTHROPIC_API_KEY: '', FORCE_ANALYZE: true });
  vm.runInContext('main()', w.ctx);
  assert.strictEqual(w.fetchBodies.length, 0);
});
