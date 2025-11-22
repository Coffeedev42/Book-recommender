from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
import time

def sarasavi(keyword):
    """
    Search for books on Sarasavi.lk and return a list of dicts:
    [{'title': ..., 'link': ..., 'price': ...}, ...]
    """
    BASE_URL = "https://www.sarasavi.lk/serach-result?keyword="  # Keep as site uses it
    cleaned_keyword = "+".join(keyword.strip().lower().split())
    url = BASE_URL + cleaned_keyword

    options = webdriver.ChromeOptions()

    # ⚡ SPEED OPTIMIZATION SETTINGS
    prefs = {
        "profile.managed_default_content_settings.images": 2,  # Block images
        "profile.managed_default_content_settings.fonts": 2,
        "profile.managed_default_content_settings.stylesheets": 1,
        "profile.managed_default_content_settings.javascript": 1,
        "profile.default_content_setting_values.cookies": 1,  # Allow cookies
    }
    options.add_experimental_option("prefs", prefs)

    # Speed flags
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-notifications")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--blink-settings=imagesEnabled=false")
    # Headless optional
    # options.add_argument("--headless=new")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    driver.set_page_load_timeout(60)

    try:
        driver.get(url)
    except Exception as e:
        driver.quit()
        print("Page failed to load:", e)
        return []

    # Wait for at least one product card to appear
    try:
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CLASS_NAME, "CategoryLanding_productlist_box__3PYze"))
        )
        time.sleep(1)  # Allow JS to finish rendering
    except Exception as e:
        print("Product container not found:", e)
        driver.quit()
        return []

    # Parse page
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    product_cards = soup.find_all("div", class_="CategoryLanding_productlist_box__3PYze")
    books = []

    # Partial/fuzzy keyword match
    pattern = re.compile(re.escape(keyword), re.IGNORECASE)

    for card in product_cards:
        details = card.find("div", class_="ProductBox_productbox_details__8EV8e")
        if details:
            title_tag = details.find("a", href=True)
            title = title_tag.text.strip() if title_tag else "No title"
            link = urljoin("https://www.sarasavi.lk", title_tag["href"]) if title_tag else "No link"

            price_tag = details.find("div", class_="ProductBox_productbox_details_price_price__nPHpZ")
            price = price_tag.text.strip() if price_tag else "No price"
        else:
            title, link, price = "No title", "No link", "No price"

        if pattern.search(title):
            books.append({
                "title": title,
                "link": link,
                "price": price,
            })

    return books
