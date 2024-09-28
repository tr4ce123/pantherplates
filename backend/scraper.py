from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

website = 'https://dineoncampus.com/FIU/whats-on-the-menu'

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

driver.get(website)
WebDriverWait(driver, 20).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "table[role='table']"))
)

# Selenium to find the rows
rows = driver.find_elements(By.CSS_SELECTOR, 'tr[role="row"]')

meals = []

for idx, row in enumerate(rows):
    item_name, description, portion, calories, nutritional_info = None, None, None, None, {}

    td_cells = row.find_elements(By.TAG_NAME, 'td')

    # Skip the first row because it will return None and isn't useful
    if len(td_cells) == 0:
        continue

    try:
        # Extract item name and description
        item_cell = td_cells[0]
        try:
            item_name_tag = item_cell.find_element(By.TAG_NAME, 'strong')
            item_name = item_name_tag.text.strip()
        except:
            item_name = item_cell.text.strip()

        # Extract portion
        portion_cell = td_cells[1]
        portion = portion_cell.text.strip()

        # Extract calories
        calories_cell = td_cells[2]
        calories = calories_cell.text.strip()

        # Find the "Nutritional Info" button in the current row
        try:
            button = row.find_element(By.CSS_SELECTOR, '.btn.btn-nutrition')
            driver.execute_script("arguments[0].scrollIntoView(true);", button)
            WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn.btn-nutrition")))
            driver.execute_script("arguments[0].click();", button)

            # Wait for the modal to be visible
            WebDriverWait(driver, 20).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "modal-body"))
            )
            time.sleep(1)

            # Get the modal content
            modal_content_element = driver.find_element(By.CLASS_NAME, "modal-body")

            if modal_content_element:
                modal_soup = BeautifulSoup(modal_content_element.get_attribute('innerHTML'), 'html.parser')
                ul_items = modal_soup.find_all('li')
                for item in ul_items:
                    strong_tag = item.find('strong')
                    if strong_tag:
                        label = strong_tag.get_text(strip=True).rstrip(":")
                        value = strong_tag.next_sibling.strip() if strong_tag.next_sibling else 'No data'
                        nutritional_info[label] = value

            # Close the modal
            close_button = driver.find_element(By.CSS_SELECTOR, ".modal-header .close")
            close_button.click()
        except Exception as e:
            print(f"Error retrieving nutritional info for {item_name}: {str(e)}")
            nutritional_info = {}

    except Exception as e:
        print(f"Error retrieving data for {item_name}: {str(e)}")
        continue

    meals.append({
        'Item': item_name,
        'Portion': portion,
        'Calories': calories,
        'Nutritional Info': nutritional_info
    })

if meals:
    for meal in meals:
        print(f"Item: {meal['Item']}")
        print(f"Portion: {meal['Portion']}, Calories: {meal['Calories']}, Nutritional Info: {meal['Nutritional Info']}")
        print("")
else:
    print("No meals found.")

driver.quit()
