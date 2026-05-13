# the goal for this app is to run a weather API and then use the data to create a Japanese newscaster style weather report.
# for v1, we prompt for a rough local city, fetch local weather, display both °F and °C, and compare it to a Japanese city with a similar temperature.
# later upgrades can add Weathernews LiVE scraping / API integration, a full Japanese report feed, and scheduled daily delivery via Kubernetes cron.

import html
import json
import os
import re
from pathlib import Path
from urllib.parse import urljoin

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

API_KEY = os.getenv("WEATHER_API_KEY", "")
WEATHER_API_BASE = os.getenv("WEATHER_API_BASE", "http://api.weatherapi.com/v1/current.json")
WEATHERNEWS_LIVE_BASE = os.getenv("WEATHERNEWS_LIVE_BASE", "https://weathernews.jp/smartphone/forecast/")
WEATHERNEWS_INDEX_URL = os.getenv("WEATHERNEWS_INDEX_URL", "https://weathernews.jp/onebox/tenki/")
WEATHERNEWS_CITY_CATALOG_FILE = Path(__file__).with_name("weathernews_city_catalog.json")
WEATHERNEWS_CITY_CATALOG = None

JAPAN_CITIES = [
    "Sapporo",
    "Asahikawa",
    "Hakodate",
    "Wakkanai",
    "Date, Hokkaido",
    "Kushiro",
    "Obihiro",
    "Aomori",
    "Hirosaki",
    "Hachinohe",
    "Akita",
    "Morioka",
    "Sendai",
    "Yamagata",
    "Fukushima",
    "Niigata",
    "Toyama",
    "Kanazawa",
    "Fukui",
    "Matsumoto",
    "Nagano",
    "Kofu",
    "Maebashi",
    "Utsunomiya",
    "Gifu",
    "Shizuoka",
    "Nagoya",
    "Tsu",
    "Osaka",
    "Kobe",
    "Nara",
    "Wakayama",
    "Himeji",
    "Okayama",
    "Hiroshima",
    "Matsue",
    "Takamatsu",
    "Matsuyama",
    "Kochi",
    "Fukuoka",
    "Saga",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Miyazaki",
    "Kagoshima",
    "Naha",
    "Ishigaki",
]

# Prefecture-level fallbacks if scraper fails or catalog is unavailable
STATIC_WEATHERNEWS_PREFECTURES = {
    "tokyo": "https://weathernews.jp/onebox/tenki/tokyo/",
    "hokkaido": "https://weathernews.jp/onebox/tenki/hokkaido/",
}

MOCK_WEATHER = {
    "temp_c": 22.0,
    "temp_f": 71.6,
    "condition": "晴れ",
    "location": "Mock City",
}


def parse_weathernews_links(html_text: str):
    for match in re.finditer(r'<a[^>]+href=["\'](?P<href>/onebox/tenki/[^"\']+)["\'][^>]*>(?P<label>[^<]+)</a>', html_text):
        href = html.unescape(match.group("href")).strip()
        label = html.unescape(match.group("label")).strip()
        yield href, label


def is_prefecture_page(href: str) -> bool:
    return bool(re.fullmatch(r"/onebox/tenki/[^/]+/?", href)) and not href.endswith("week/") and not href.endswith("week")


def is_city_page(href: str) -> bool:
    return bool(re.fullmatch(r"/onebox/tenki/[^/]+/\d+/?", href))


def load_cached_weathernews_catalog():
    if WEATHERNEWS_CITY_CATALOG_FILE.exists():
        try:
            return json.loads(WEATHERNEWS_CITY_CATALOG_FILE.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            return []
    return []


def save_cached_weathernews_catalog(catalog):
    try:
        WEATHERNEWS_CITY_CATALOG_FILE.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    except OSError:
        pass


def scrape_weathernews_city_catalog():
    try:
        index_html = requests.get(WEATHERNEWS_INDEX_URL, timeout=10).text
    except requests.RequestException:
        return []

    prefecture_urls = []
    for href, label in parse_weathernews_links(index_html):
        if is_prefecture_page(href):
            prefecture_urls.append((urljoin(WEATHERNEWS_INDEX_URL, href), label))

    catalog = []
    visited = set()
    for prefecture_url, prefecture_label in prefecture_urls:
        if prefecture_url in visited:
            continue
        visited.add(prefecture_url)
        try:
            prefecture_html = requests.get(prefecture_url, timeout=10).text
        except requests.RequestException:
            continue

        for city_href, city_label in parse_weathernews_links(prefecture_html):
            if is_city_page(city_href):
                catalog.append(
                    {
                        "prefecture_page": prefecture_url,
                        "prefecture_label_jp": prefecture_label,
                        "city_label_jp": city_label,
                        "city_url": urljoin(prefecture_url, city_href),
                    }
                )

    return catalog


def get_weathernews_city_catalog(force_refresh: bool = False):
    global WEATHERNEWS_CITY_CATALOG
    if WEATHERNEWS_CITY_CATALOG is not None and not force_refresh:
        return WEATHERNEWS_CITY_CATALOG

    if not force_refresh:
        cached_catalog = load_cached_weathernews_catalog()
        if cached_catalog:
            WEATHERNEWS_CITY_CATALOG = cached_catalog
            return cached_catalog

    catalog = scrape_weathernews_city_catalog()
    if catalog:
        save_cached_weathernews_catalog(catalog)
    WEATHERNEWS_CITY_CATALOG = catalog
    return catalog


def find_weathernews_reference(city: str, catalog):
    normalized_city = sanitize_city_for_url(city).lower()
    # Search catalog for city match
    for entry in catalog or []:
        city_url_lower = entry["city_url"].lower()
        if normalized_city in city_url_lower:
            return entry["city_url"]
        if entry.get("city_label_jp") and city.lower() in entry["city_label_jp"].lower():
            return entry["city_url"]

    # Fallback to prefecture-level from catalog
    for entry in catalog or []:
        prefecture_url_lower = entry["prefecture_page"].lower()
        if normalized_city in prefecture_url_lower or city.lower() in entry.get("prefecture_label_jp", "").lower():
            return entry["prefecture_page"]

    # Last resort: static prefecture fallback
    for pref_key, pref_url in STATIC_WEATHERNEWS_PREFECTURES.items():
        if pref_key in normalized_city:
            return pref_url

    # Default fallback to Tokyo
    return f"{WEATHERNEWS_INDEX_URL}tokyo/"


def celsius_from_fahrenheit(temp_f: float) -> float:
    return (temp_f - 32.0) * 5.0 / 9.0


def normalize_location(location: str) -> str:
    return location.strip() or "Tokyo"


def fetch_weather(location: str) -> dict:
    if not API_KEY:
        return {**MOCK_WEATHER, "location": location, "warning": "Using fallback weather because no API key is configured."}

    params = {
        "key": API_KEY,
        "q": location,
        "aqi": "no",
    }
    try:
        response = requests.get(WEATHER_API_BASE, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        current = data.get("current", {})
        temp_c = current.get("temp_c")
        temp_f = current.get("temp_f")
        if temp_c is None and temp_f is not None:
            temp_c = celsius_from_fahrenheit(temp_f)
        if temp_f is None and temp_c is not None:
            temp_f = temp_c * 9.0 / 5.0 + 32.0

        return {
            "location": data.get("location", {}).get("name", location),
            "region": data.get("location", {}).get("region", ""),
            "country": data.get("location", {}).get("country", ""),
            "temp_c": round(temp_c, 1) if temp_c is not None else None,
            "temp_f": round(temp_f, 1) if temp_f is not None else None,
            "condition": current.get("condition", {}).get("text", "Unknown"),
        }
    except (requests.RequestException, ValueError, KeyError) as exc:
        return {
            **MOCK_WEATHER,
            "location": location,
            "warning": f"Using fallback weather because API request failed: {exc}",
        }


def fetch_japan_city_weather(city: str) -> dict:
    if not API_KEY:
        mock_temp_c = 10.0 + 15.0 * (JAPAN_CITIES.index(city) / max(1, len(JAPAN_CITIES) - 1))
        return {
            "city": city,
            "temp_c": round(mock_temp_c, 1),
            "temp_f": round(mock_temp_c * 9.0 / 5.0 + 32.0, 1),
            "condition": "晴れ",
        }

    params = {
        "key": API_KEY,
        "q": city,
        "aqi": "no",
    }
    try:
        response = requests.get(WEATHER_API_BASE, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})
        temp_c = current.get("temp_c")
        if temp_c is None and current.get("temp_f") is not None:
            temp_c = celsius_from_fahrenheit(current.get("temp_f"))
        return {
            "city": city,
            "temp_c": round(temp_c, 1) if temp_c is not None else None,
            "temp_f": round(current.get("temp_f", temp_c * 9.0 / 5.0 + 32.0), 1) if temp_c is not None else None,
            "condition": current.get("condition", {}).get("text", "Unknown"),
        }
    except (requests.RequestException, ValueError, KeyError):
        mock_temp_c = 10.0 + 15.0 * (JAPAN_CITIES.index(city) / max(1, len(JAPAN_CITIES) - 1))
        return {
            "city": city,
            "temp_c": round(mock_temp_c, 1),
            "temp_f": round(mock_temp_c * 9.0 / 5.0 + 32.0, 1),
            "condition": "晴れ",
        }


def find_similar_japan_city(local_temp_c: float) -> dict:
    best_match = None
    smallest_diff = float("inf")
    for city in JAPAN_CITIES:
        city_weather = fetch_japan_city_weather(city)
        if city_weather["temp_c"] is None:
            continue
        diff = abs(local_temp_c - city_weather["temp_c"])
        if diff < smallest_diff:
            smallest_diff = diff
            best_match = city_weather
    return best_match or {"city": "Tokyo", "temp_c": None, "temp_f": None, "condition": "Unknown"}


def make_newscaster_report(local: dict, japan_match: dict) -> str:
    return (
        f"ウェザーニュースLiVEスタイルでお届けします。\n"
        f"現在、{local.get('location')}の気温は 摂氏{local.get('temp_c')}度、"
        f"華氏{local.get('temp_f')}度です。日本では、{japan_match.get('city')}が近い気温で、"
        f"摂氏{japan_match.get('temp_c')}度、華氏{japan_match.get('temp_f')}度です。"
        f"天気は{japan_match.get('condition')}でしょう。"
    )


def sanitize_city_for_url(city: str) -> str:
    return city.replace(",", "").replace(" ", "-").replace("　", "-")


def get_weathernews_link(city: str) -> str:
    return find_weathernews_reference(city, get_weathernews_city_catalog())


@app.route("/weather", methods=["GET"])
def get_weather():
    query_location = normalize_location(request.args.get("q", "Tokyo"))
    local = fetch_weather(query_location)

    if local.get("temp_c") is None:
        return jsonify({"error": "Unable to determine local temperature."}), 500

    similar_city = find_similar_japan_city(local["temp_c"])
    report = make_newscaster_report(local, similar_city)
    weathernews_catalog = get_weathernews_city_catalog()
    weathernews_url = find_weathernews_reference(similar_city.get("city", "Tokyo"), weathernews_catalog)

    response = {
        "local_location": local.get("location"),
        "local_temp_c": local.get("temp_c"),
        "local_temp_f": local.get("temp_f"),
        "local_condition": local.get("condition"),
        "similar_japan_city": similar_city.get("city"),
        "similar_japan_temp_c": similar_city.get("temp_c"),
        "similar_japan_temp_f": similar_city.get("temp_f"),
        "similar_japan_condition": similar_city.get("condition"),
        "weathernews_reference": weathernews_url,
        "weathernews_city_catalog_count": len(weathernews_catalog),
        "japanese_broadcast": report,
    }

    if local.get("warning"):
        response["warning"] = local.get("warning")

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)