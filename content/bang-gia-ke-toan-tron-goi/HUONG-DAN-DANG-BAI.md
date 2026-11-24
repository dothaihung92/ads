# Bài "Bảng giá dịch vụ kế toán trọn gói": hướng dẫn đăng lên WordPress

## Các file
| File | Dùng làm gì |
|---|---|
| `bai-viet-wordpress.html` | Nội dung bài viết (đã có CSS, bảng giá, FAQ, dữ liệu có cấu trúc) |
| `hinh/bang-gia-dich-vu-ke-toan-tron-goi-tphcm.png` | Hình bảng giá (1200 px, dùng trong bài) |
| `hinh/bang-gia-dich-vu-ke-toan-tron-goi-tphcm@2x.png` | Bản nét gấp đôi (in ấn, gửi Zalo/Facebook) |
| `hinh/anh-dai-dien-bang-gia-ke-toan-tron-goi.png` | Ảnh đại diện 1200x630 (featured image, chia sẻ mạng xã hội) |
| `hinh/nguon/*.html` | File nguồn của hình, để sửa chữ hoặc số rồi xuất lại |

## Cách đăng (khoảng 15 phút)
1. **Tạo Trang (Pages), không phải Bài viết (Posts)**, vì đây là trang dịch vụ để chạy quảng cáo.
2. Tiêu đề trang (sẽ thành H1): `Bảng giá dịch vụ kế toán trọn gói tại TP.HCM`
3. Thêm khối **"HTML tùy chỉnh" (Custom HTML)**, mở file `bai-viet-wordpress.html`, copy toàn bộ và dán vào khối.
4. **Tải 2 ảnh lên Thư viện media** (`bang-gia-dich-vu-ke-toan-tron-goi-tphcm.png` và ảnh đại diện). Trong bài, thẻ ảnh đang trỏ tới
   `https://dailythuehungphuc.com/wp-content/uploads/bang-gia-dich-vu-ke-toan-tron-goi-tphcm.png`.
   Nếu WordPress lưu ảnh ở đường dẫn khác (ví dụ thư mục theo tháng) hoặc đổi tên, hãy **sửa đường dẫn `src` trong khối HTML** cho đúng.
5. Đặt **Ảnh đại diện** = `anh-dai-dien-bang-gia-ke-toan-tron-goi.png`. Alt: `Bảng giá dịch vụ kế toán trọn gói TP.HCM - Hưng Phúc`
6. Điền phần SEO (Yoast/Rank Math):
   - **Đường dẫn (slug):** `bang-gia-dich-vu-ke-toan-tron-goi` (tôi đã kiểm tra, chưa có trang nào dùng)
   - **Từ khóa chính:** `bảng giá dịch vụ kế toán trọn gói`
   - **Từ khóa phụ:** báo giá dịch vụ kế toán trọn gói, phí dịch vụ kế toán trọn gói, chi phí dịch vụ kế toán, giá dịch vụ kế toán TPHCM
   - **Tiêu đề SEO (51 ký tự):** `Bảng giá dịch vụ kế toán trọn gói TPHCM | Hưng Phúc`
   - **Mô tả meta (151 ký tự):** `Xem bảng giá dịch vụ kế toán trọn gói tại TP.HCM theo số hóa đơn mỗi quý, từ 900.000đ/quý. Gọi hoặc nhắn Zalo để nhận báo giá cho doanh nghiệp của bạn.`
7. **Liên kết hai chiều (quan trọng):** trong trang `/dich-vu-ke-toan/`, thêm một liên kết "Xem bảng giá dịch vụ kế toán trọn gói" tới trang mới, và thêm trang mới vào menu "Kế Toán Trọn Gói".
8. Xuất bản, rồi:
   - Mở trên **điện thoại**, bấm thử nút Gọi và Zalo, kiểm tra bảng giá vuốt ngang được.
   - Kiểm tra tốc độ ở pagespeed.web.dev (bản di động).
   - Google Search Console: "Kiểm tra URL" → "Yêu cầu lập chỉ mục".
9. **Google Ads:** dùng URL này làm **URL cuối** cho nhóm quảng cáo "Bảng giá trọn gói". Chỉ bật nhóm sau khi trang đã xuất bản.

## Bài đã tối ưu thế nào
- Một H1 (tiêu đề trang), 7 H2 và 11 H3 theo thứ tự hợp lý. Từ khóa chính nằm ở đoạn mở đầu, tiêu đề H2, bảng, FAQ, khối liên hệ. Các biến thể "báo giá", "phí", "chi phí", "giá", "TP. Hồ Chí Minh" xuất hiện tự nhiên.
- **Bảng giá là chữ thật** (bảng HTML), không phải ảnh, nên Google đọc được. Hình bảng giá chỉ để chia sẻ.
- Nút gọi và Zalo nằm ở đầu trang (hiện ngay trên màn hình điện thoại) và cuối trang.
- Liên kết nội bộ tới 5 trang dịch vụ có thật trên web của bạn (đã kiểm tra truy cập được).
- FAQ có dữ liệu có cấu trúc (JSON-LD). Lưu ý: Google hiện chỉ hiện giao diện FAQ nổi bật cho một số loại trang, nên lợi ích chủ yếu là nội dung, không phải kết quả hiển thị đặc biệt.

## Điều tôi đã sửa hoặc cố ý không dùng, cần bạn xác nhận
1. **Bảng giá lấy nguyên từ trang `/dich-vu-ke-toan/`** và đã đối chiếu tự động, khớp 100%. Bản gốc ghi dòng cuối là **"Từ 188 tờ"** trong khi dòng trước là "154-185", thiếu 186-187. Tôi ghi **"Từ 186 tờ hóa đơn trở lên: phí thỏa thuận"**. Hãy xác nhận.
2. **Không dùng "Chỉ từ 500.000đ"** (nằm trong tiêu đề trang cũ). Bảng giá hiện thấp nhất 900.000đ/quý. Nếu 500.000đ là mức có thật ở dịch vụ khác, hãy sửa tiêu đề trang cũ cho khớp.
3. **Không dùng** các khẳng định tuyệt đối trên trang cũ ("rẻ nhất", "tiết kiệm chi phí nhất", "giá rẻ").
4. Câu gốc "Cân đối doanh thu chi phí để Doanh Nghiệp **đóng thuế thấp nhất**" tôi viết lại thành **"Tư vấn cân đối doanh thu, chi phí theo quy định hiện hành"**.
5. **5 cam kết** (gồm "làm sai bị phạt thuế thì Hưng Phúc chịu trách nhiệm hoàn toàn") lấy nguyên ý từ trang cũ. Chỉ giữ nếu bạn vẫn thực hiện đúng.
6. Dòng **"Bảng giá cập nhật tháng 11/2026"** đúng tại thời điểm tôi đọc. Hãy cập nhật dòng này (và hình) mỗi khi bạn đổi giá.
7. Câu trả lời FAQ "Chi phí có tăng không?" được viết lại dựa trên bảng giá (phí đổi theo bậc số hóa đơn). Bạn xem lại cho đúng ý.
8. Bài **chưa nêu phí đã gồm/chưa gồm VAT** và các khoản ngoài bảng, vì trang cũ không nói. Nếu có, hãy thêm một dòng dưới bảng giá, người xem hay hỏi điều này.
9. Địa chỉ, email, hotline lấy từ chân trang web hiện tại của bạn.

## Hạn chế
- Tôi **chưa đăng thử trên WordPress thật**. Bản xem thử ở Chrome trên máy tính và điện thoại hiển thị đúng, nhưng giao diện (theme) của bạn có thể ghi đè một phần CSS.
- CSS nằm trong thẻ `<style>` của khối HTML. Nếu tài khoản không có quyền chèn HTML thô, CSS và JSON-LD có thể bị lược bỏ. Khi đó, đăng nhập bằng tài khoản Quản trị viên, hoặc chuyển phần CSS vào Giao diện → Tùy biến → CSS bổ sung.
- Plugin SEO có thể không phân tích hết nội dung trong khối HTML tùy chỉnh. Điểm xanh/đỏ của Yoast/Rank Math chỉ là tham khảo.
- Hình dùng phông Inter và màu xanh navy trung tính, không có logo vì tôi không có file logo của bạn. Muốn thêm logo hoặc đổi màu, sửa trong `hinh/nguon/*.html` rồi báo tôi xuất lại.
