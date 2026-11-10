import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import analyzer  # noqa: E402

SAMPLE = (
    "Campaign report\n"
    "October 1, 2026 - October 30, 2026\n"
    "Campaign,Clicks,Impr.,Cost,Conversions,CTR\n"
    'Brand,"1,200","20,000","1,500.50",30,6.00%\n'
    "Generic,800,50000,3000.00,2, 1.60%\n"
    "Total: Account,2000,70000,4500.50,32,2.86%\n"
).encode("utf-8-sig")


def test_parse_skips_preamble_and_total():
    t = analyzer.parse_report(SAMPLE, "c.csv")
    assert t.columns[0] == "Campaign"
    assert [r["Campaign"] for r in t.rows] == ["Brand", "Generic"]
    assert any("October" in n for n in t.notes)


def test_parse_utf16_tsv():
    raw = SAMPLE.decode("utf-8-sig").replace(",", "\t").encode("utf-16")
    # dấu phẩy nghìn bị đổi thành tab trong mẫu này nên chỉ kiểm tra việc nhận ra header
    assert analyzer.parse_report(raw, "x").columns[0] == "Campaign"


def test_parse_number():
    assert analyzer.parse_number("1,500.50") == 1500.5
    assert analyzer.parse_number("6.00%") == 6.0
    assert analyzer.parse_number(" --") is None


def test_totals_and_truncation_note():
    t = analyzer.parse_report(SAMPLE, "c.csv")
    assert analyzer.totals(t)["Cost"] == 4500.5
    big = analyzer.Table("b", ["Campaign", "Cost"], [{"Campaign": str(i), "Cost": str(i)} for i in range(500)], 500)
    cut = analyzer.top_rows(big, 300)
    assert len(cut.rows) == 300 and cut.rows[0]["Cost"] == "499" and "300/500" in cut.notes[-1]


def test_bad_file_rejected():
    try:
        analyzer.parse_report(b"hello\nworld\n", "bad")
    except ValueError:
        return
    raise AssertionError("expected ValueError")


class FakeBeta:
    def create(self, **kw):
        self.kw = kw
        return SimpleNamespace(content=[SimpleNamespace(type="text", text="## OK")], stop_reason="end_turn",
                               model="claude-opus-5-5", usage=SimpleNamespace(input_tokens=1, output_tokens=2))


def test_analyze_with_fake_client():
    fake = SimpleNamespace(beta=SimpleNamespace(messages=FakeBeta()))
    t = analyzer.parse_report(SAMPLE, "c.csv")
    out = analyzer.analyze([t], {"Mục tiêu": "test"}, client=fake)
    assert out["text"] == "## OK"
    sent = fake.beta.messages.kw
    assert sent["model"] == "claude-opus-5-5" and "<data>" in sent["messages"][0]["content"]
