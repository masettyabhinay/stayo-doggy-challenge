import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

screenshots_dir = r"F:\Stayo game\scripts\test_screenshots"
os.makedirs(screenshots_dir, exist_ok=True)

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1280,900")
options.add_argument("--hide-scrollbars")

driver = webdriver.Chrome(options=options)
try:
    print("1. Opening Landing page at http://localhost:3000/ ...")
    driver.get("http://localhost:3000/")
    time.sleep(2)

    # Check Landing page elements
    title = driver.title
    print("Page Title:", title)
    assert "STAYO Doggy Challenge" in title

    mascot_img = driver.find_element(By.ID, "doggyImg")
    mascot_src = mascot_img.get_attribute("src")
    print("Landing Mascot Image src:", mascot_src)
    assert "doggy-waving.png" in mascot_src or "doggy-expressions" in mascot_src

    driver.save_screenshot(os.path.join(screenshots_dir, "01_landing_page.png"))
    print("Screenshot saved: 01_landing_page.png")

    # Start quiz
    name_input = driver.find_element(By.ID, "playerNameInput")
    name_input.clear()
    name_input.send_keys("Test Legend")
    
    start_btn = driver.find_element(By.ID, "btnStartQuiz")
    start_btn.click()
    time.sleep(1.5)

    # Question 1
    print("2. Verifying Quiz View (Question 1)...")
    q_title = driver.find_element(By.CLASS_NAME, "question-title").text
    print("Question 1 Title:", q_title)

    # Select Option A (Biryani Bandit -> mischievous)
    opts = driver.find_elements(By.CLASS_NAME, "option-card-btn")
    opts[0].click()
    time.sleep(1)

    # Scroll to top so full mascot is visible in screenshot
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(0.5)

    q1_img = driver.find_element(By.ID, "doggyImg").get_attribute("src")
    print("Doggy Image after Option A selection:", q1_img)
    driver.save_screenshot(os.path.join(screenshots_dir, "02_quiz_question_1.png"))

    # Test navigating directly to Question 24 to test end sequence
    print("3. Navigating to Question 24 (q=23)...")
    driver.get("http://localhost:3000/?q=23&name=TestHero")
    time.sleep(2)

    q24_title = driver.find_element(By.CLASS_NAME, "question-title").text
    print("Question 24 Title:", q24_title)

    # Check mascot image on Q24
    q24_img = driver.find_element(By.ID, "doggyImg").get_attribute("src")
    print("Q24 Doggy Image src:", q24_img)

    # Answer Q24: Click option
    q24_opts = driver.find_elements(By.CLASS_NAME, "option-card-btn")
    print(f"Clicking option on Question 24...")
    q24_opts[0].click()

    # The auto-transition triggers automatically after ~850ms!
    print("Waiting for automatic transition to Results and Choreography...")
    time.sleep(1.8)

    # Step: Inspect Mascot during Jump & Rope Pull
    print("Checking Doggy Mascot during Jump & Rope Pull sequence...")
    results_mascot = driver.find_element(By.ID, "doggyImg")
    rope = driver.find_element(By.ID, "hangingRope")
    board = driver.find_element(By.ID, "boardBody")

    time.sleep(1.2)
    step_src = results_mascot.get_attribute("src")
    print("Mascot image during jump/pull choreography:", step_src)
    driver.save_screenshot(os.path.join(screenshots_dir, "03_rope_pull_sequence.png"))

    # Wait for board drop and settling (~3.5 seconds)
    print("Waiting for Scoreboard to settle and reveal score...")
    time.sleep(4.5)

    # Check scoreboard settled
    board_classes = board.get_attribute("class")
    print("Scoreboard Body Classes:", board_classes)
    assert "dropped-in" in board_classes

    # Check score counter
    counter = driver.find_element(By.ID, "scoreCounter").text
    print("Final Revealed Score Counter:", counter)

    # Check personality
    p_title = driver.find_element(By.CLASS_NAME, "personality-title").text
    print("Revealed Personality Title:", p_title)

    # Final result screenshot
    driver.save_screenshot(os.path.join(screenshots_dir, "04_scoreboard_revealed.png"))
    print("Screenshot saved: 04_scoreboard_revealed.png")

    print("\nALL BROWSER INTEGRATION CHECKS PASSED SUCCESSFULLY! 🐶🎉")

finally:
    driver.quit()
