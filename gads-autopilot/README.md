# Google Ads Autopilot: AI đề xuất, bạn duyệt, script mới áp dụng

Một Google Ads Script chạy ngay trong tài khoản của bạn. **Không cần Developer Token.**

## Cách hoạt động
1. **Cảnh báo:** nếu hôm qua hoặc hôm nay (tới giờ chạy) quảng cáo 0 lượt hiển thị, script gửi email.
2. **Phân tích (mặc định thứ Hai):** gửi dữ liệu 30 ngày cho Claude. Claude trả về danh sách ĐỀ XUẤT, script ghi vào Google Sheet (tab `Đề xuất`).
3. **Bạn duyệt:** ở cột `DUYỆT?` chọn `Duyệt` hoặc `Từ chối`.
4. **Áp dụng:** lần chạy sau, script chỉ làm những dòng bạn đã chọn `Duyệt`, rồi ghi kết quả vào Sheet và tab `Nhật ký`.

## Script có thể và không thể làm
| Làm được (sau khi bạn duyệt) | Không bao giờ làm |
|---|---|
| `ADD_NEGATIVE`: thêm từ phủ định cấp chiến dịch | Đổi ngân sách, giá thầu |
| `PAUSE_KEYWORD`: tạm dừng từ khóa (không xóa) | Bật chiến dịch, xóa bất cứ thứ gì |
| | Sửa quảng cáo, trang đích, thanh toán |

Các lời khuyên khác (trang đích, nội dung quảng cáo, chiến lược giá thầu, nghi vấn ngừng phân phối) xuất hiện dưới dạng dòng `NOTE` để bạn tự làm.

## Lớp bảo vệ trong code
- `DRY_RUN = true` mặc định: chỉ mô phỏng, không sửa tài khoản.
- Phủ định bị chặn nếu: trùng cụm từ được bảo vệ (`PROTECTED_TERMS`), sẽ chặn nhầm từ khóa đang chạy trong chiến dịch, đã tồn tại, hoặc có ký tự lạ.
- Tạm dừng từ khóa bị chặn nếu từ khóa có chuyển đổi trong 30 ngày (kiểm tra lại ở thời điểm áp dụng).
- Mọi đề xuất được kiểm tra hai lần: lúc Claude đề xuất và lúc áp dụng.
- Tối đa `MAX_APPLY_PER_RUN` thay đổi mỗi lần chạy. Mọi việc được ghi vào tab `Nhật ký`.
- Đề xuất bạn đã `Từ chối` sẽ không được đề xuất lại.

## Cài đặt (khoảng 15 phút)
1. Tạo một Google Sheet trống, copy URL.
2. Tạo API key riêng tại https://console.anthropic.com. Đặt giới hạn chi tiêu cho key nếu có thể. **Không dán key vào chat.**
3. Google Ads → **Công cụ** → **Hành động hàng loạt** → **Tập lệnh** → **+** → Tập lệnh mới. Dán toàn bộ `autopilot.js`.
4. Điền `CONFIG`: `SPREADSHEET_URL`, `ANTHROPIC_API_KEY`, `NOTIFY_EMAIL`. Sửa `BUSINESS_CONTEXT` cho đúng doanh nghiệp.
5. Bấm **Cấp quyền** (Sheets, gọi dịch vụ bên ngoài, gửi mail).
6. Đặt `FORCE_ANALYZE: true`, bấm **Xem trước** (Preview). Xem tab `Nhật ký` và `Đề xuất`. Nếu có lỗi truy vấn hay tên trường, gửi lại nội dung lỗi cho người hỗ trợ.
7. Duyệt vài đề xuất, chạy lại ở chế độ Xem trước. Dòng sẽ báo `Mô phỏng OK`.
8. Hài lòng thì đặt `DRY_RUN: false`, `FORCE_ANALYZE: false`, **Chạy** một lần, rồi **Lên lịch** hàng ngày (khoảng 10:00).

## Lưu ý quan trọng
- **Chưa được kiểm thử trên tài khoản thật.** Chỉ các hàm kiểm tra logic được test bằng Node (`node --test test/autopilot.test.js`). Các truy vấn GAQL, tên trường và lệnh áp dụng chưa chạy thử. Xem trước kỹ trước khi tắt `DRY_RUN`.
- Chế độ Xem trước của Google Ads không áp dụng thay đổi vào tài khoản, nhưng có thể vẫn ghi vào Sheet, gửi email và gọi API Claude (có tính phí).
- API key nằm trong mã script, người có quyền xem script trong tài khoản đều thấy. Dùng key riêng, có giới hạn chi tiêu, và thu hồi khi cần.
- Dữ liệu tài khoản (chiến dịch, từ khóa, cụm từ tìm kiếm) được gửi tới Anthropic để phân tích.
- Lệnh gọi API có thể bị timeout nếu phân tích quá lâu. Khi đó hạ `EFFORT` xuống `low`.
- Khi tài khoản quá ít dữ liệu (như hiện tại: 4 chuyển đổi/tháng), Claude sẽ ghi `NOTE` thay vì đề xuất chắc chắn.
- Việc này không thay thế khắc phục nguyên nhân quảng cáo ngừng chạy (thanh toán, trạng thái chiến dịch, chính sách).
