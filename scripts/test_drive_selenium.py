import os
import shutil
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

source_user_data = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data"
dest_user_data = r"C:\Users\Pc\AppData\Local\Temp\chrome_selenium_profile2"

print("1. Preparing temp Profile 2...")
if os.path.exists(dest_user_data):
    shutil.rmtree(dest_user_data, ignore_errors=True)
os.makedirs(dest_user_data, exist_ok=True)

# Copy Local State
if os.path.exists(os.path.join(source_user_data, "Local State")):
    shutil.copy2(os.path.join(source_user_data, "Local State"), os.path.join(dest_user_data, "Local State"))

dest_profile = os.path.join(dest_user_data, "Profile 2")
src_profile = os.path.join(source_user_data, "Profile 2")
os.makedirs(dest_profile, exist_ok=True)

# Copy Profile 2 files
for f in ["Preferences", "Secure Preferences"]:
    src_f = os.path.join(src_profile, f)
    if os.path.exists(src_f):
        shutil.copy2(src_f, os.path.join(dest_profile, f))

src_net = os.path.join(src_profile, "Network")
dest_net = os.path.join(dest_profile, "Network")
if os.path.exists(src_net):
    os.makedirs(dest_net, exist_ok=True)
    for f in os.listdir(src_net):
        try:
            shutil.copy2(os.path.join(src_net, f), os.path.join(dest_net, f))
            print("Copied network file:", f)
        except Exception as e:
            print("Notice:", f, e)

print("2. Starting Selenium Chrome with Profile 2...")
options = Options()
options.add_argument(f"--user-data-dir={dest_user_data}")
options.add_argument("--profile-directory=Profile 2")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--headless=new")

download_dir = r"F:\Stayo game\public\assets\doggy-expressions"
os.makedirs(download_dir, exist_ok=True)

prefs = {
    "download.default_directory": download_dir,
    "download.prompt_for_download": False,
    "download.directory_upgrade": True,
    "safebrowsing.enabled": True
}
options.add_experimental_option("prefs", prefs)

driver = webdriver.Chrome(options=options)
try:
    url = "https://drive.google.com/drive/folders/1OwD-u7dZwGYmS7EwTFTLS-dki_lBknf3"
    print(f"3. Navigating to {url}...")
    driver.get(url)
    time.sleep(8)
    print("Page Title:", driver.title)
    print("Current URL:", driver.current_url)

    screenshot_path = r"F:\Stayo game\scripts\drive_screenshot_p2.png"
    driver.save_screenshot(screenshot_path)
    print("Screenshot saved to", screenshot_path)

    from selenium.webdriver.common.by import By
    items = driver.find_elements(By.XPATH, "//*[contains(text(), '.png') or contains(text(), '.jpg') or contains(text(), '.svg') or contains(text(), '.webp') or @data-target='item']")
    print(f"Found {len(items)} items matching files:")
    for it in items[:30]:
        t = it.text.strip()
        if t:
            print(" -", t)
finally:
    driver.quit()
