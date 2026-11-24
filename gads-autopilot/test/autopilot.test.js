const test = require('node:test');
const assert = require('node:assert');
const a = require('../autopilot.js');

const ctx = {
  campaigns: ['1.Dịch vụ kế toán trọn gói', '2.Bảng giá'],
  keywords: [
    { campaign: '1.Dịch vụ kế toán trọn gói', adGroup: 'Dịch vụ kế toán', text: 'dịch vụ kế toán trọn gói', matchType: 'EXACT' },
    { campaign: '1.Dịch vụ kế toán trọn gói', adGroup: 'Dịch vụ kế toán', text: 'Dịch vụ kế toán Q2', matchType: 'EXACT' },
  ],
  protectedTerms: ['kế toán', 'dịch vụ kế toán'],
  existingNegatives: [{ campaign: '1.Dịch vụ kế toán trọn gói', text: 'misa', matchType: 'PHRASE' }],
};
const C = '1.Dịch vụ kế toán trọn gói';

test('parseProposals handles code fences and extra text', () => {
  const raw = 'Đây là kết quả:\n```json\n[{"type":"NOTE","text":"x"}]\n```';
  assert.deepStrictEqual(a.parseProposals(raw), [{ type: 'NOTE', text: 'x' }]);
  assert.throws(() => a.parseProposals('không có json'));
});

test('negative: ok case', () => {
  assert.ok(a.validateProposal({ type: 'ADD_NEGATIVE', campaign: C, text: 'hóa đơn điện tử', match_type: 'PHRASE' }, ctx).ok);
});

test('negative: blocked when it would block own keyword', () => {
  const r = a.validateProposal({ type: 'ADD_NEGATIVE', campaign: C, text: 'kế toán trọn gói', match_type: 'PHRASE' }, ctx);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /chặn nhầm/);
});

test('negative: protected terms, duplicates, bad chars, bad campaign, bad match', () => {
  const base = { type: 'ADD_NEGATIVE', campaign: C, match_type: 'PHRASE' };
  assert.strictEqual(a.validateProposal({ ...base, text: 'Dịch vụ kế toán' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...base, text: 'MISA' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...base, text: 'a"b[c]' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...base, campaign: 'X', text: 'abc' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...base, match_type: 'BROAD', text: 'abc' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...base, text: 'a' }, ctx).ok, false);
});

test('only allowed types pass', () => {
  assert.strictEqual(a.validateProposal({ type: 'SET_BUDGET', campaign: C, text: 'abc' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ type: 'DELETE_KEYWORD', campaign: C, text: 'abc' }, ctx).ok, false);
  assert.ok(a.validateProposal({ type: 'NOTE', text: 'Kiểm tra trang đích' }, ctx).ok);
});

test('pause keyword requires exact existing keyword', () => {
  const p = { type: 'PAUSE_KEYWORD', campaign: C, ad_group: 'Dịch vụ kế toán', text: 'dịch vụ kế toán q2', match_type: 'EXACT' };
  assert.ok(a.validateProposal(p, ctx).ok);
  assert.strictEqual(a.validateProposal({ ...p, text: 'không tồn tại' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...p, match_type: 'PHRASE' }, ctx).ok, false);
  assert.strictEqual(a.validateProposal({ ...p, ad_group: '' }, ctx).ok, false);
});

test('canPause only with zero conversions', () => {
  assert.ok(a.canPause({ conversions: 0 }));
  assert.ok(!a.canPause({ conversions: 0.5 }));
});

test('proposalKey and helpers', () => {
  assert.strictEqual(a.proposalKey({ type: 'ADD_NEGATIVE', campaign: 'c', text: ' Misa ', match_type: 'PHRASE' }),
    a.proposalKey({ type: 'ADD_NEGATIVE', campaign: 'c', text: 'misa', match_type: 'PHRASE' }));
  assert.strictEqual(a.escapeCond("a'b"), "a\\'b");
  assert.strictEqual(a.microsToUnits(231467000000), 231467);
});

/* ---------- Quảng cáo, từ khóa mới, KPI ---------- */
const adCtx = {
  ...ctx,
  adGroups: [{ campaign: C, adGroup: 'Dịch vụ kế toán' }],
  ads: [{ campaign: C, adGroup: 'Dịch vụ kế toán', urls: ['https://example.com/ke-toan'] }],
  factsText: 'Dịch vụ kế toán thuế trọn gói tại TP. Hồ Chí Minh. Tư vấn qua Zalo. Nhận việc trong 24 giờ.',
  bannedWords: ['tốt nhất', 'số 1'],
};
const goodAd = {
  url: 'https://example.com/ke-toan',
  headlines: ['Dịch vụ kế toán trọn gói', 'Kế toán thuế TPHCM', 'Tư vấn qua Zalo'],
  descriptions: ['Làm báo cáo thuế, quyết toán cho doanh nghiệp.', 'Liên hệ để được tư vấn.'],
};

test('ad text round trip and parsing (user may edit the cell)', () => {
  const t = a.formatAdText(goodAd);
  assert.deepStrictEqual(a.parseAdText(t), goodAd);
  assert.deepStrictEqual(a.parseAdText('url: https://x.vn\nh: A\nH: B\nd: C'), { url: 'https://x.vn', headlines: ['A', 'B'], descriptions: ['C'] });
});

test('ad content rules', () => {
  assert.ok(a.validateAdContent(goodAd, adCtx).ok);
  const bad = (patch) => a.validateAdContent({ ...goodAd, ...patch }, adCtx);
  assert.strictEqual(bad({ headlines: ['a', 'b'] }).ok, false);                         // < 3 tiêu đề
  assert.strictEqual(bad({ headlines: ['x'.repeat(31), 'b', 'c'] }).ok, false);        // > 30 ký tự
  assert.strictEqual(bad({ headlines: ['Giảm giá!', 'b', 'c'] }).ok, false);            // dấu !
  assert.strictEqual(bad({ headlines: ['Kế toán tốt nhất', 'b', 'c'] }).ok, false);    // từ cấm
  assert.strictEqual(bad({ headlines: ['Kinh nghiệm 10 năm', 'b', 'c'] }).ok, false);  // số bịa
  assert.ok(bad({ headlines: ['Nhận việc trong 24 giờ', 'b', 'c'] }).ok);               // số có trong facts
  assert.strictEqual(bad({ descriptions: ['Gọi ngay www.abc.vn', 'ok'] }).ok, false);  // URL trong nội dung
  assert.strictEqual(bad({ headlines: ['a', 'A', 'c'] }).ok, false);                    // trùng
  assert.strictEqual(bad({ url: 'http://example.com' }).ok, false);
  assert.strictEqual(bad({ descriptions: ['x'.repeat(91), 'ok'] }).ok, false);
  assert.strictEqual(a.textLen('Kế toán'), 7);
});

test('ADD_RSA: url must already exist in that ad group', () => {
  const p = { type: 'ADD_RSA', campaign: C, ad_group: 'Dịch vụ kế toán', text: a.formatAdText(goodAd) };
  assert.ok(a.validateProposal(p, adCtx).ok);
  assert.strictEqual(a.validateProposal({ ...p, text: a.formatAdText({ ...goodAd, url: 'https://evil.com' }) }, adCtx).ok, false);
  assert.strictEqual(a.validateProposal({ ...p, ad_group: 'Không có' }, adCtx).ok, false);
});

test('ADD_KEYWORD rules', () => {
  const p = { type: 'ADD_KEYWORD', campaign: C, ad_group: 'Dịch vụ kế toán', text: 'báo cáo thuế cho doanh nghiệp', match_type: 'PHRASE' };
  assert.ok(a.validateProposal(p, adCtx).ok);
  assert.strictEqual(a.validateProposal({ ...p, match_type: 'BROAD' }, adCtx).ok, false);
  assert.strictEqual(a.validateProposal({ ...p, text: 'dịch vụ kế toán trọn gói', match_type: 'EXACT' }, adCtx).ok, false); // đã có
  assert.strictEqual(a.validateProposal({ ...p, text: 'misa kế toán' }, adCtx).ok, false);                                  // bị phủ định chặn
  assert.strictEqual(a.validateProposal({ ...p, ad_group: 'X' }, adCtx).ok, false);
  assert.strictEqual(a.validateProposal({ ...p, text: 'abc"def' }, adCtx).ok, false);
});

test('normalizeUrls and negatives helper', () => {
  assert.deepStrictEqual(a.normalizeUrls('["https://a.vn","https://b.vn"]'), ['https://a.vn', 'https://b.vn']);
  assert.deepStrictEqual(a.normalizeUrls('https://a.vn'), ['https://a.vn']);
  assert.deepStrictEqual(a.normalizeUrls(['https://a.vn']), ['https://a.vn']);
  assert.deepStrictEqual(a.normalizeUrls(''), []);
  assert.strictEqual(a.keywordBlockedByNegatives('báo giá misa', C, [{ campaign: C, text: 'misa', matchType: 'PHRASE' }]), 'misa');
  assert.strictEqual(a.keywordBlockedByNegatives('báo giá', C, [{ campaign: C, text: 'misa', matchType: 'PHRASE' }]), null);
});

test('computeKpi', () => {
  const k = a.computeKpi({
    keywords: [
      { qs: '3', impressions: 100, landing_page: 'BELOW_AVERAGE', expected_ctr: 'AVERAGE', ad_relevance: 'ABOVE_AVERAGE' },
      { qs: '9', impressions: 100, landing_page: 'ABOVE_AVERAGE', expected_ctr: 'BELOW_AVERAGE', ad_relevance: 'ABOVE_AVERAGE' },
      { qs: '0', impressions: 50, landing_page: 'UNKNOWN', expected_ctr: 'UNKNOWN', ad_relevance: 'UNKNOWN' },
    ],
    campaigns: [{ clicks: 10, cost: 500000, conversions: 2, impressions: 300 }],
  });
  assert.strictEqual(k.keywords_with_qs, 2);
  assert.strictEqual(k.avg_qs_weighted, 6);
  assert.strictEqual(k.pct_qs_7_plus, 50);
  assert.strictEqual(k.landing_below_avg, 1);
  assert.strictEqual(k.ctr_below_avg, 1);
  assert.strictEqual(k.avg_cpc, 50000);
  assert.strictEqual(k.cpa, 250000);
});
