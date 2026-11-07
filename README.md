# ads

Repo này khai báo plugin [claude-ads](https://github.com/AgriciDaniel/claude-ads)
(v2.1.0) cho Claude Code qua `.claude/settings.json`. Khi mở repo trong Claude Code
và chọn tin cậy thư mục, Claude Code sẽ đề nghị thêm marketplace
`ai-marketing-hub-claude-ads` và bật plugin `claude-ads`.

## Cài thủ công (nếu cần)

Trong Claude Code:

```text
/plugin marketplace add agricidaniel/claude-ads
/plugin install claude-ads@ai-marketing-hub-claude-ads
```

## Bắt đầu

- `/claude-ads:ads setup` — khai báo doanh nghiệp, mục tiêu, nền tảng quảng cáo
- `/claude-ads:ads audit google` (hoặc `all`) — audit dựa trên dữ liệu export (CSV/JSON)
- `/claude-ads:ads report`, `/claude-ads:ads next`

Không dán API key hay token vào chat. Plugin cần Python 3.11 hoặc 3.12 cho các công cụ đi kèm.
