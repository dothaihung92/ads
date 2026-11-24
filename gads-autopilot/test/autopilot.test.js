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
