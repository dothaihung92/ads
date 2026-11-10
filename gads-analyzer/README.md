# Phân tích Google Ads bằng AI (ứng dụng web cục bộ)

Tải file CSV export từ Google Ads lên, nhận báo cáo phân tích từ Claude (tiền lãng phí,
điểm nên mở rộng, hành động ưu tiên). **Chỉ đọc và gợi ý, không sửa tài khoản.**
Ứng dụng chỉ lắng nghe trên `127.0.0.1` (máy của bạn).

## Cài đặt (Windows PowerShell)

```powershell
cd gads-analyzer
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:ANTHROPIC_API_KEY = "khóa-api-của-bạn"
python app.py
```

Mở http://127.0.0.1:5000. Lấy API key tại https://console.anthropic.com.
Không dán key vào chat hay commit lên Git.

## Xuất dữ liệu từ Google Ads

Google Ads → Reports (hoặc bảng Campaigns / Search terms) → Download → CSV.
Chọn khoảng thời gian rõ ràng (30 hoặc 90 ngày). Có thể tải nhiều file cùng lúc.

## Lấy dữ liệu tự động bằng API (làm sau khi có Developer Token)

`ads_api.py` có sẵn hàm `fetch_campaigns` và `fetch_search_terms` dùng Google Ads API
(chỉ đọc). Cần tài khoản quản lý (MCC), Developer Token mức Basic, OAuth credentials
và file `google-ads.yaml` (đã nằm trong `.gitignore`). Phần này **chưa được kiểm thử
với tài khoản thật** và chưa nối vào giao diện web.

## Quyền riêng tư và giới hạn

- Dữ liệu trong file được gửi tới Anthropic để phân tích.
- Mỗi file chỉ gửi tối đa 300 dòng chi phí cao nhất; tổng các cột vẫn tính trên toàn bộ file.
  Báo cáo ghi rõ khi có cắt dòng.
- Bật `fallbacks` phía server (`USE_FALLBACKS=0` để tắt) nếu Claude từ chối một yêu cầu.
- Gợi ý của AI cần bạn tự kiểm tra trước khi đổi chiến dịch.

## Kiểm thử

```powershell
python -m pytest -q tests
```
