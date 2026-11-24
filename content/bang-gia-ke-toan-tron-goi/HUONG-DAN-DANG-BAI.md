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
6. Điền phần SEO theo mục **Rank Math** bên dưới (tóm tắt):
   - **Đường dẫn (slug):** `bang-gia-dich-vu-ke-toan-tron-goi` (tôi đã kiểm tra, chưa có trang nào dùng)
   - **Từ khóa chính:** `bảng giá dịch vụ kế toán trọn gói`
   - **Từ khóa phụ:** báo giá dịch vụ kế toán trọn gói, phí dịch vụ kế toán trọn gói, chi phí dịch vụ kế toán, giá dịch vụ kế toán TPHCM
   - **Tiêu đề SEO (55 ký tự, từ khóa đứng đầu, có số):** `Bảng giá dịch vụ kế toán trọn gói TPHCM từ 900.000đ/quý`
   - **Mô tả meta (151 ký tự):** `Xem bảng giá dịch vụ kế toán trọn gói tại TP.HCM theo số hóa đơn mỗi quý, từ 900.000đ/quý. Gọi hoặc nhắn Zalo để nhận báo giá cho doanh nghiệp của bạn.`
7. **Liên kết hai chiều (quan trọng):** trong trang `/dich-vu-ke-toan/`, thêm một liên kết "Xem bảng giá dịch vụ kế toán trọn gói" tới trang mới, và thêm trang mới vào menu "Kế Toán Trọn Gói".
8. Xuất bản, rồi:
   - Mở trên **điện thoại**, bấm thử nút Gọi và Zalo, kiểm tra bảng giá vuốt ngang được.
   - Kiểm tra tốc độ ở pagespeed.web.dev (bản di động).
   - Google Search Console: "Kiểm tra URL" → "Yêu cầu lập chỉ mục".
9. **Google Ads:** dùng URL này làm **URL cuối** cho nhóm quảng cáo "Bảng giá trọn gói". Chỉ bật nhóm sau khi trang đã xuất bản.


## Rank Math: điền đầy đủ từng tab
Mở trang → biểu tượng Rank Math (cột phải) và điền như sau. Tên tab có thể hơi khác tùy phiên bản (miễn phí hay Pro).

| Tab | Mục | Giá trị |
|---|---|---|
| **General** | Focus Keyword (tối đa 5, từ khóa đầu là chính) | 1) `bảng giá dịch vụ kế toán trọn gói` 2) `báo giá dịch vụ kế toán trọn gói` 3) `phí dịch vụ kế toán trọn gói` 4) `giá dịch vụ kế toán trọn gói` 5) `chi phí dịch vụ kế toán` |
| | Pillar Content | **Bật** (đây là trang giá chính) |
| | SEO Title (55 ký tự) | `Bảng giá dịch vụ kế toán trọn gói TPHCM từ 900.000đ/quý` |
| | Permalink | `bang-gia-dich-vu-ke-toan-tron-goi` |
| | Meta Description (151 ký tự) | `Xem bảng giá dịch vụ kế toán trọn gói tại TP.HCM theo số hóa đơn mỗi quý, từ 900.000đ/quý. Gọi hoặc nhắn Zalo để nhận báo giá cho doanh nghiệp của bạn.` |
| **Advanced** | Robots Meta | Index, Follow (không chọn noindex) |
| | Breadcrumb Title | `Bảng giá kế toán trọn gói` |
| | Canonical URL | để trống (tự động) |
| **Schema** | Loại schema | **Service** (nếu có, bản Pro) hoặc để mặc định. Name: `Dịch vụ kế toán trọn gói`, Area served: `TP. Hồ Chí Minh`. **Đừng thêm FAQ schema ở đây** vì bài đã có sẵn FAQPage (JSON-LD) ở cuối, thêm nữa sẽ bị trùng |
| **Social** | Facebook | Tiêu đề = SEO Title, mô tả = Meta, ảnh = `anh-dai-dien-bang-gia-ke-toan-tron-goi.png` |
| | Twitter | Card "Summary with Large Image" |

**Thiết lập một lần cho cả website** (Rank Math → Titles & Meta → Local SEO): loại doanh nghiệp "Accounting Service" (Dịch vụ kế toán), tên `Công ty TNHH Tư vấn và Dịch vụ Kế toán Hưng Phúc`, số điện thoại, địa chỉ trụ sở và chi nhánh Bình Thạnh (lấy từ chân trang web của bạn). Bật Breadcrumbs nếu theme hỗ trợ.

### Bài đáp ứng các bài kiểm tra Rank Math thế nào
| Bài kiểm tra | Kết quả mong đợi |
|---|---|
| Từ khóa chính trong tiêu đề SEO | Có, ở đầu tiêu đề |
| Trong mô tả meta / trong URL | Có / Có |
| Trong 10% đầu nội dung | Có (đoạn mở đầu) |
| Trong nội dung, độ dài nội dung | Có (khoảng 11 lần), khoảng 1.800 từ (>600) |
| Trong tiêu đề phụ (H2/H3) | Có (9 H2, 11 H3) |
| Trong alt của ảnh | Có (hình bảng giá, ảnh đại diện) |
| Mật độ từ khóa | Khoảng 0,6%. Rank Math gợi ý gần 1%. **Đừng nhồi thêm**, nếu muốn tăng, chỉ thêm 1-2 câu tự nhiên |
| URL ngắn | Có |
| Liên kết nội bộ | Có (5 trang dịch vụ) |
| Liên kết ra ngoài (dofollow) | Có (1 liên kết tới cổng thuế điện tử, **bạn bấm thử còn vào được không**, tôi không kiểm tra được từ môi trường của tôi) |
| Con số trong tiêu đề | Có (900.000đ) |
| Có hình ảnh | Có (5 ảnh) |
| Mục lục | Bài có mục lục tự viết. Nếu Rank Math vẫn báo thiếu, thêm khối **Table of Contents** của Rank Math ở đầu bài và xóa khối `<nav class="hp-toc">` |
| Từ khóa chưa dùng cho trang khác | Hãy kiểm tra ô cảnh báo của Rank Math nếu từ khóa chính đã dùng ở trang cũ |

Mục tiêu là điểm Rank Math màu xanh (80 trở lên). Nội dung phân tích của Rank Math có thể không đọc hết khối HTML tùy chỉnh, nên điểm chỉ để tham khảo. Các mục "power word" và "cảm xúc" của tiêu đề dựa trên từ điển tiếng Anh, nhiều khi không áp dụng cho tiếng Việt, có thể bỏ qua.

**Muốn dùng khối FAQ của Rank Math thay vì JSON-LD có sẵn:** chèn khối "FAQ by Rank Math", dán 7 câu hỏi và trả lời lấy từ phần Câu hỏi thường gặp, rồi **xóa thẻ `<script type="application/ld+json">`** ở cuối file để không bị trùng.

## Hình ảnh lấy từ web của bạn
Bài dùng 4 ảnh có sẵn trong thư viện media của bạn (mục "Đội ngũ thực hiện"), liên kết trực tiếp tới `dailythuehungphuc.com/wp-content/uploads/2021/05/`, nên **không cần tải lại**:
- `dịch-vụ-kế-toán-hưng-phúc-1-1024x750.jpg`, `dịch-vụ-kế-toán-hưng-phúc-01-1-1024x750.jpg` (văn phòng, đội ngũ làm việc)
- `dich-vu-ke-toan-tron-goi-2.jpg`, `dich-vu-ke-toan-tron-goi-1-1.jpg` (nhân viên tư vấn, làm việc trên máy tính)

Đã kiểm tra 4 đường dẫn này truy cập được. Mỗi ảnh có chữ thay thế (alt) và chú thích mô tả. **Tôi chỉ nhìn ảnh để mô tả, nên giả định đây là nhân viên và văn phòng của bạn**, hãy sửa alt nếu không đúng. Ảnh có người thật, hãy chắc là bạn có sự đồng ý của họ.

**Cố ý không dùng:** ảnh "Cam kết hoàn 100% phí nếu không mang lại giá trị" (`hoàn-lại-100-phần-trăm-phí-kế-toán-nếu-không-mang-lại-giá-trị.png`). Đây là cam kết mạnh, nằm ở trang cũ nhưng không có trong 5 cam kết bằng chữ. Chỉ thêm khi bạn xác nhận còn áp dụng và điều kiện rõ ràng, nếu không dễ gây hiểu lầm và bị phản ánh.

## Bài đã tối ưu thế nào
- Một H1 (tiêu đề trang), 9 H2 và 11 H3 theo thứ tự hợp lý. Từ khóa chính nằm ở đoạn mở đầu, tiêu đề H2, bảng, FAQ, khối liên hệ. Các biến thể "báo giá", "phí", "chi phí", "giá", "TP. Hồ Chí Minh" xuất hiện tự nhiên.
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
10. Liên kết ra ngoài tới `thuedientu.gdt.gov.vn` (cổng thuế điện tử): tôi chưa kiểm tra được, hãy bấm thử. Nếu địa chỉ đã đổi, sửa trong khối HTML.
11. Alt và chú thích của 4 ảnh đội ngũ (xem mục Hình ảnh ở trên).

## Hạn chế
- Tôi **chưa đăng thử trên WordPress thật**. Bản xem thử ở Chrome trên máy tính và điện thoại hiển thị đúng, nhưng giao diện (theme) của bạn có thể ghi đè một phần CSS.
- CSS nằm trong thẻ `<style>` của khối HTML. Nếu tài khoản không có quyền chèn HTML thô, CSS và JSON-LD có thể bị lược bỏ. Khi đó, đăng nhập bằng tài khoản Quản trị viên, hoặc chuyển phần CSS vào Giao diện → Tùy biến → CSS bổ sung.
- Plugin SEO có thể không phân tích hết nội dung trong khối HTML tùy chỉnh. Điểm xanh/đỏ của Yoast/Rank Math chỉ là tham khảo.
- Hình dùng phông Inter và màu xanh navy trung tính, không có logo vì tôi không có file logo của bạn. Muốn thêm logo hoặc đổi màu, sửa trong `hinh/nguon/*.html` rồi báo tôi xuất lại.
