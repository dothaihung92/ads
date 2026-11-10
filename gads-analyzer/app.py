"""Ứng dụng web cục bộ: tải CSV Google Ads lên, nhận báo cáo phân tích từ Claude.

Chạy:  python app.py   ->  mở http://127.0.0.1:5000
Chỉ lắng nghe trên 127.0.0.1 (máy của bạn), không mở ra mạng ngoài.
"""
import html
import os

import markdown
from flask import Flask, render_template, request

import analyzer

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20 MB


def render_report(text: str) -> str:
    # Escape HTML trước khi render markdown để nội dung từ file/model không chèn được script.
    return markdown.markdown(html.escape(text, quote=False), extensions=["tables", "fenced_code"])


@app.get("/")
def index():
    return render_template("index.html", error=None)


@app.post("/analyze")
def analyze_view():
    files = [f for f in request.files.getlist("files") if f and f.filename]
    if not files:
        return render_template("index.html", error="Hãy chọn ít nhất một file CSV."), 400
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return render_template("index.html", error="Chưa đặt ANTHROPIC_API_KEY (xem README)."), 500

    try:
        tables = [analyzer.parse_report(f.read(), name=f.filename) for f in files]
    except ValueError as e:
        return render_template("index.html", error=str(e)), 400

    context = {
        "Ngành/sản phẩm": request.form.get("business", ""),
        "Mục tiêu": request.form.get("goal", ""),
        "CPA/ROAS mục tiêu": request.form.get("target", ""),
        "Đơn vị tiền tệ": request.form.get("currency", ""),
        "Khoảng thời gian của dữ liệu": request.form.get("period", ""),
        "Ghi chú thêm": request.form.get("notes", ""),
    }
    try:
        result = analyzer.analyze(tables, context)
    except Exception as e:  # lỗi mạng/khóa API: báo gọn, không lộ chi tiết nhạy cảm
        return render_template("index.html", error=f"Lỗi khi gọi Claude: {type(e).__name__}"), 502

    meta = [f"{t.name}: {t.total_rows} dòng" + (" (đã cắt còn %d)" % analyzer.MAX_ROWS_PER_FILE if t.total_rows > analyzer.MAX_ROWS_PER_FILE else "") for t in tables]
    return render_template("result.html", report=render_report(result["text"]), meta=meta, result=result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
