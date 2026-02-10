import re
import tldextract
from urllib.parse import urlparse

KEYWORDS = ["login", "verify", "bank", "secure", "account", "update"]

def extract_features(url: str):
    parsed = urlparse(url)
    ext = tldextract.extract(url)

    url_length = len(url)
    count_at = url.count("@")
    count_dash = url.count("-")
    count_dot = url.count(".")
    subdomain_depth = len(ext.subdomain.split(".")) if ext.subdomain else 0

    is_ip = 1 if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", parsed.hostname or "") else 0
    keyword_count = sum(keyword in url.lower() for keyword in KEYWORDS)

    return [
        url_length,
        count_at,
        count_dash,
        count_dot,
        subdomain_depth,
        is_ip,
        keyword_count,
    ]
