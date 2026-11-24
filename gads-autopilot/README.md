# Google Ads Autopilot: nâng Điểm Chất lượng, giảm CPC (AI đề xuất, bạn duyệt)

Một Google Ads Script chạy ngay trong tài khoản của bạn. **Không cần Developer Token.**
Mục tiêu: nâng Điểm Chất lượng (ĐCL) để giảm CPC thực tế mà vẫn giữ vị trí hiển thị.

## Cách hoạt động
1. **Phân tích (mặc định thứ Hai):** script lấy dữ liệu 30 ngày (chiến dịch, từ khóa kèm 3 thành phần ĐCL, quảng cáo, cụm từ tìm kiếm, từ phủ định) và gửi cho Claude.
2. **Đề xuất:** Claude chẩn đoán thành phần ĐCL nào yếu (tỷ lệ nhấp dự kiến, liên quan của quảng cáo, trang đích) rồi ghi đề xuất vào Google Sheet, tab `Đề xuất`, kèm lý do và bằng chứng.
3. **Bạn duyệt:** cột `DUYỆT?` chọn `Duyệt` hoặc `Từ chối`. Với quảng cáo mới bạn có thể sửa thẳng các dòng `H:` / `D:` trong ô nội dung.
4. **Áp dụng:** lần chạy sau, script chỉ làm các dòng đã `Duyệt`, ghi kết quả vào Sheet và tab `Nhật ký`.
5. **Theo dõi mục tiêu:** mỗi lần phân tích ghi một dòng vào tab `Theo dõi KPI` (ĐCL trung bình theo lượt hiển thị, % từ khóa ĐCL từ 7, số từ khóa dưới trung bình ở từng thành phần, CPC trung bình, CPA). Bạn nhìn xu hướng để biết có đạt mục tiêu không.
6. **Cảnh báo:** nếu hôm qua hoặc hôm nay quảng cáo 0 lượt hiển thị, script gửi email.

## Các loại thay đổi (chỉ sau khi bạn duyệt)
| Loại | Làm gì | Giúp thành phần ĐCL nào |
|---|---|---|
| `ADD_NEGATIVE` | thêm từ phủ định cấp chiến dịch | tỷ lệ nhấp dự kiến |
| `PAUSE_KEYWORD` | tạm dừng từ khóa (không xóa) | dọn từ khóa chết/trùng |
| `ADD_KEYWORD` | thêm từ khóa EXACT/PHRASE vào nhóm có sẵn | liên quan, CTR |
| `ADD_RSA` | thêm MỘT quảng cáo thích ứng mới vào nhóm có sẵn (không thay hay xóa quảng cáo cũ) | liên quan của quảng cáo, CTR |
| `NOTE` | lời khuyên để bạn tự làm (sửa trang đích, tái cấu trúc nhóm, giá thầu...) | trải nghiệm trang đích |

**Script không bao giờ** đổi ngân sách, giá thầu, trang đích, thanh toán, bật chiến dịch hay xóa thứ gì. CPC giảm nhờ ĐCL cải thiện qua vài tuần, không phải nhờ script đổi giá thầu. Trang đích (thường là điểm yếu lớn nhất) phải do bạn sửa trên website, Claude chỉ nói cần sửa gì.

## Lớp bảo vệ trong code
- `DRY_RUN = true` mặc định: chỉ mô phỏng.
- Mỗi đề xuất được kiểm tra hai lần, lúc Claude đề xuất và lúc áp dụng (kể cả khi bạn sửa nội dung trong Sheet).
- **Quảng cáo:** tiêu đề ≤ 30 ký tự (3-15 cái), mô tả ≤ 90 ký tự (2-4 cái), không dấu `!` trong tiêu đề, không URL/email trong nội dung, không từ cấm (`BANNED_WORDS`). **Mọi con số trong quảng cáo phải có trong `BUSINESS_FACTS`**, nên Claude không bịa được số năm, giá, số khách. URL cuối chỉ được dùng URL có sẵn trong quảng cáo của chính nhóm đó.
- **Từ phủ định:** chặn nếu trùng cụm từ bảo vệ, sẽ chặn nhầm từ khóa đang chạy, hoặc đã tồn tại.
- **Từ khóa mới:** chặn nếu đã có trong nhóm, bị từ phủ định của chiến dịch chặn, hoặc nhóm không tồn tại. Tối đa `MAX_NEW_KEYWORDS` mỗi lần.
- **Tạm dừng:** chặn nếu từ khóa có chuyển đổi trong 30 ngày.
- Tối đa `MAX_APPLY_PER_RUN` thay đổi mỗi lần chạy. Đề xuất đã `Từ chối` không bị đề xuất lại. Mọi việc được ghi vào `Nhật ký`.

## Cài đặt (khoảng 20 phút)
1. Tạo một Google Sheet trống, copy URL.
2. Tạo API key riêng tại https://console.anthropic.com, đặt giới hạn chi tiêu nếu có thể. **Không dán key vào chat.**
3. Google Ads → **Công cụ** → **Hành động hàng loạt** → **Tập lệnh** → **+** → tập lệnh mới. Dán toàn bộ `autopilot.js`.
4. Điền `CONFIG`:
   - `SPREADSHEET_URL`, `ANTHROPIC_API_KEY`, `NOTIFY_EMAIL`.
   - **`BUSINESS_FACTS`: sửa cho đúng sự thật về doanh nghiệp của bạn** (khu vực, dịch vụ, cách liên hệ, và chỉ những con số bạn thật sự muốn đưa vào quảng cáo). Đây là nguồn duy nhất Claude được phép dùng khi viết quảng cáo.
   - `BUSINESS_CONTEXT`, `PROTECTED_TERMS` cho đúng ngành.
5. Bấm **Cấp quyền** (Sheets, gọi dịch vụ bên ngoài, gửi mail).
6. Đặt `FORCE_ANALYZE: true`, bấm **Xem trước**. Đọc tab `Nhật ký`, `Đề xuất`, `Theo dõi KPI`. Lỗi truy vấn hay tên trường sẽ hiện trong nhật ký.
7. Duyệt vài đề xuất, chạy Xem trước lần nữa. Dòng sẽ báo `Mô phỏng OK`.
8. Hài lòng thì đặt `DRY_RUN: false`, `FORCE_ANALYZE: false`, chạy một lần, rồi **Lên lịch** hàng ngày (khoảng 10:00). Quảng cáo mới nên đặt `NEW_ADS_PAUSED: true` ở vài lần đầu nếu bạn muốn tự bật trong giao diện.

## Kiểm thử đã làm và chưa làm
- **Đã làm:** `node --test test/autopilot.test.js test/e2e.test.js` (18 test pass). Gồm kiểm tra logic từng quy tắc và chạy trọn luồng đề xuất, duyệt, mô phỏng, áp dụng với Google Ads, Google Sheets và Claude GIẢ.
- **Chưa làm, đây là rủi ro thật:** chưa chạy trên Google Ads, Sheets và API Claude thật. Mock không kiểm chứng được: tên trường GAQL, cách Google Ads Scripts trả về trường lặp (`final_urls`), các lệnh `responsiveSearchAdBuilder`, `newKeywordBuilder`, `createNegativeKeyword`, đọc tiêu đề quảng cáo cũ, tham số `fallbacks` và độ trễ gọi Claude (có thể timeout, khi đó hạ `EFFORT` xuống `low`). Hãy chạy **Xem trước** và gửi lại nhật ký nếu có lỗi.
- Chế độ Xem trước của Google Ads không áp dụng thay đổi vào tài khoản nhưng có thể vẫn ghi Sheet, gửi email và gọi API Claude (có tính phí).

## Lưu ý
- API key nằm trong mã script, người có quyền xem script đều thấy. Dùng key riêng có giới hạn chi tiêu.
- Dữ liệu tài khoản (chiến dịch, từ khóa, cụm từ tìm kiếm, quảng cáo) được gửi tới Anthropic để phân tích.
- Quảng cáo mới vẫn phải qua duyệt chính sách của Google. Bạn chịu trách nhiệm về nội dung đã duyệt, hãy đọc kỹ trước khi chọn `Duyệt`.
- Dữ liệu ít (như 4 chuyển đổi/tháng) thì Claude sẽ ghi `NOTE` nhiều hơn là đề xuất chắc chắn, và ĐCL chỉ có với từ khóa đủ lượt hiển thị.
- Không thay thế việc sửa nguyên nhân quảng cáo ngừng chạy (thanh toán, trạng thái chiến dịch, chính sách).
