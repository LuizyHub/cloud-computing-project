import calendar
import requests
from bs4 import BeautifulSoup
import csv
from datetime import datetime

# 검색 키워드와 기간 설정
keyword = "클라우드"
years = [2024, 2023, 2022]
months = range(12, 0, -1)  # 12월부터 1월 순으로

# 결과 저장 리스트
news_data = []

# pubDate를 MySQL DATETIME 형식으로 변환
def convert_pubdate_to_datetime(pub_date):
    try:
        # 'Mon, 24 Jan 2022 08:00:00 GMT' -> '2022-01-24 08:00:00'
        dt = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z")
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except Exception as e:
        print(f"Error converting pubDate: {pub_date}, {e}")
        return None

# 뉴스 데이터 크롤링 함수
def fetch_news(keyword, year, month):
    # 월의 마지막 날짜 계산
    _, last_day = calendar.monthrange(year, month)
    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year}-{month:02d}-{last_day}"

    # Google News 검색 URL 구성
    url = (
        f"https://news.google.com/rss/search?q={keyword}+after:{start_date}+before:{end_date}&hl=ko&gl=KR&ceid=KR:ko"
    )

    # RSS 데이터 가져오기
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "xml")
        items = soup.find_all("item")
        for item in items:
            title = item.title.text
            link = item.link.text
            pub_date_raw = item.pubDate.text if item.pubDate else None
            pub_date = convert_pubdate_to_datetime(pub_date_raw) if pub_date_raw else "0000-00-00 00:00:00"
            news_data.append({"title": title, "link": link, "pubDate": pub_date})
    else:
        print(f"Failed to fetch news for {year}-{month:02d}")

# 크롤링 수행
for year in years:
    for month in months:
        print(f"Fetching news for {year}-{month:02d}...")
        fetch_news(keyword, year, month)

# pubDate 기준으로 최신순 정렬
news_data = sorted(news_data, key=lambda x: x["pubDate"], reverse=True)

# 결과를 CSV 파일로 저장
csv_filename = f"news_data_{keyword}_{datetime.now().strftime('%Y%m%d')}.csv"
with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["title", "link", "pubDate"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(news_data)

print(f"News data saved to {csv_filename}")