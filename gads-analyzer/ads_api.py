"""Lấy dữ liệu trực tiếp bằng Google Ads API (CHỈ ĐỌC).

Cần: Developer Token (đã được duyệt Basic), OAuth credentials và file google-ads.yaml.
Hướng dẫn: https://developers.google.com/google-ads/api/docs/get-started/introduction
CHƯA được kiểm thử với tài khoản thật - hãy chạy thử trên tài khoản nhỏ trước.
"""
from __future__ import annotations

CAMPAIGN_QUERY = """
SELECT campaign.name, campaign.status, campaign.advertising_channel_type,
       metrics.impressions, metrics.clicks, metrics.cost_micros,
       metrics.conversions, metrics.conversions_value
FROM campaign
WHERE segments.date DURING LAST_{days}_DAYS AND campaign.status != 'REMOVED'
"""

SEARCH_TERM_QUERY = """
SELECT search_term_view.search_term, campaign.name,
       metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
FROM search_term_view
WHERE segments.date DURING LAST_{days}_DAYS
"""


def _client(config_path: str = "google-ads.yaml"):
    from google.ads.googleads.client import GoogleAdsClient

    return GoogleAdsClient.load_from_storage(config_path)


def _run(customer_id: str, query: str, config_path: str):
    client = _client(config_path)
    service = client.get_service("GoogleAdsService")
    cid = customer_id.replace("-", "").strip()
    if not cid.isdigit():
        raise ValueError("Customer ID chỉ gồm chữ số (có thể có dấu gạch ngang).")
    return service.search(customer_id=cid, query=query)


def fetch_campaigns(customer_id: str, days: int = 30, config_path: str = "google-ads.yaml") -> list[dict]:
    if days not in (7, 14, 30):
        raise ValueError("days phải là 7, 14 hoặc 30.")
    rows = []
    for r in _run(customer_id, CAMPAIGN_QUERY.format(days=days), config_path):
        m = r.metrics
        rows.append({
            "Campaign": r.campaign.name,
            "Status": r.campaign.status.name,
            "Type": r.campaign.advertising_channel_type.name,
            "Impressions": str(m.impressions),
            "Clicks": str(m.clicks),
            "Cost": f"{m.cost_micros / 1_000_000:.2f}",
            "Conversions": f"{m.conversions:.2f}",
            "Conv. value": f"{m.conversions_value:.2f}",
        })
    return rows


def fetch_search_terms(customer_id: str, days: int = 30, config_path: str = "google-ads.yaml") -> list[dict]:
    if days not in (7, 14, 30):
        raise ValueError("days phải là 7, 14 hoặc 30.")
    rows = []
    for r in _run(customer_id, SEARCH_TERM_QUERY.format(days=days), config_path):
        m = r.metrics
        rows.append({
            "Search term": r.search_term_view.search_term,
            "Campaign": r.campaign.name,
            "Impressions": str(m.impressions),
            "Clicks": str(m.clicks),
            "Cost": f"{m.cost_micros / 1_000_000:.2f}",
            "Conversions": f"{m.conversions:.2f}",
        })
    return rows
