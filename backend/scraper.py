from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

def breakfast():
    """
    Scrapes the breakfast menu from the specified website and returns meal details.

    Returns:
        list: A list of dictionaries containing meal information.
    """
    website = 'https://dineoncampus.com/FIU/whats-on-the-menu'

    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems

    # Initialize the Chrome driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        driver.get(website)
        # Wait until the table with role 'table' is present
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table[role='table']"))
        )

        # Find all rows with role 'row'
        rows = driver.find_elements(By.CSS_SELECTOR, 'tr[role="row"]')

        food_items = []

        for row in rows:
            item_name, portion, calories, nutritional_info, is_vegan, is_vegetarian, is_climate = None, None, None, {}, False, False, False

            td_cells = row.find_elements(By.TAG_NAME, 'td')

            # Skip rows without cells (e.g., header rows)
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

                img_tags = item_cell.find_elements(By.TAG_NAME, 'img')
                
                for img in img_tags:
                    # Check both the alt and src. Climate needs the src because it doesn't have an alt
                    alt = img.get_attribute('alt') or ""
                    src = img.get_attribute('src') or ""
                    if "Contains no animal-based ingredients or by-products." in alt or "vegan" in src:
                        is_vegan = True
                    elif "Contains no meat, poultry, fish or seafood but may contain eggs or dairy." in alt or "vegetarian" in src:
                        is_vegetarian = True
                    elif "climate" in src:
                        is_climate = True


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
                    time.sleep(1)  # Optional: Wait for content to load

                    # Get the modal content
                    modal_content_element = driver.find_element(By.CLASS_NAME, "modal-body")

                    if modal_content_element:
                        modal_soup = BeautifulSoup(modal_content_element.get_attribute('innerHTML'), 'html.parser')
                        ul_items = modal_soup.find_all('li')
                        for item in ul_items:
                            strong_tag = item.find('strong')
                            if strong_tag:
                                label = strong_tag.get_text(strip=True).rstrip(":")
                                # Handle cases where next_sibling might not be a string
                                value = strong_tag.next_sibling
                                if value:
                                    value = value.strip()
                                else:
                                    value = 'No data'
                                nutritional_info[label] = value
                        
                        ingredients = "No ingredients"
                        div_items = modal_soup.find_all('div')
                        # Looping here because finding via lambda function wasn't working. Less ideal, but it works
                        for div in div_items:
                            strong_tag = div.find('strong')
                            if strong_tag and 'Ingredients:' in strong_tag.get_text(strip=True):
                                ingredients = strong_tag.next_sibling.strip()
                                break

                        nutritional_info["Ingredients"] = ingredients
                        
                    # Close the modal
                    close_button = driver.find_element(By.CSS_SELECTOR, ".modal-header .close")
                    close_button.click()
                except Exception as e:
                    print(f"Error retrieving nutritional info for {item_name}: {str(e)}")
                    nutritional_info = {}

            except Exception as e:
                print(f"Error retrieving data for {item_name}: {str(e)}")
                continue

            food_items.append({
                'Item': item_name,
                'Meal': "Breakfast",
                'Portion': portion,
                'Calories': calories,
                'Nutritional Info': nutritional_info,
                'Vegan': is_vegan,
                'Vegetarian': is_vegetarian,
                'Climate Friendly': is_climate
            })

        if food_items:
            for item in food_items:
                print(f"Item: {item['Item']}, Meal: {item['Meal']}")
                print(f"Portion: {item['Portion']}, Calories: {item['Calories']}, Nutritional Info: {item['Nutritional Info']}")
                print(f"Vegan?: {item['Vegan']}, Vegetarian?: {item['Vegetarian']}, Climate?: {item['Climate Friendly']}")
                print("")
        else:
            print("No meals found.")

        return food_items

    finally:
        driver.quit()


def lunch():
    """
    Scrapes the lunch menu.

    Returns:
        list: A list of dictionaries containing meal information.
    """
    website = 'https://dineoncampus.com/FIU/whats-on-the-menu'

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Initialize the Chrome driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        driver.get(website)
        # Wait until the table with role 'table' is present
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table[role='table']"))
        )

        # Wait until the navlist is loaded
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "ul[role='tablist']"))
        )

        # Change to Lunch
        tab_link = driver.find_element(By.LINK_TEXT, 'Lunch')
        tab_link.click()

        # We need to sleep here, otherwise the data won't fully load and everything will be empty
        time.sleep(10)

        rows = driver.find_elements(By.CSS_SELECTOR, 'tr[role="row"]')

        food_items = []

        for row in rows:
            item_name, portion, calories, nutritional_info, is_vegan, is_vegetarian, is_climate = None, None, None, {}, False, False, False

            td_cells = row.find_elements(By.TAG_NAME, 'td')

            # Skip rows without cells (e.g., header rows)
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

                img_tags = item_cell.find_elements(By.TAG_NAME, 'img')
                
                for img in img_tags:
                    # Check both the alt and src. Climate needs the src because it doesn't have an alt
                    alt = img.get_attribute('alt') or ""
                    src = img.get_attribute('src') or ""
                    if "Contains no animal-based ingredients or by-products." in alt or "vegan" in src:
                        is_vegan = True
                    elif "Contains no meat, poultry, fish or seafood but may contain eggs or dairy." in alt or "vegetarian" in src:
                        is_vegetarian = True
                    elif "climate" in src:
                        is_climate = True

                # Extract portion
                portion_cell = td_cells[1]
                portion = portion_cell.text.strip()

                # Extract calories
                calories_cell = td_cells[2]
                calories = calories_cell.text.strip()

                # Find the "Nutritional Info" button in the current row
                try:
                    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn.btn-nutrition")))

                    button = row.find_element(By.CSS_SELECTOR, '.btn.btn-nutrition')
                    driver.execute_script("arguments[0].scrollIntoView(true);", button)
                    driver.execute_script("arguments[0].click();", button)

                    # Wait for the modal to be visible
                    WebDriverWait(driver, 20).until(
                        EC.visibility_of_element_located((By.CLASS_NAME, "modal-body"))
                    )
                    time.sleep(1)  # Optional: Wait for content to load

                    # Get the modal content
                    modal_content_element = driver.find_element(By.CLASS_NAME, "modal-body")

                    if modal_content_element:
                        modal_soup = BeautifulSoup(modal_content_element.get_attribute('innerHTML'), 'html.parser')
                        ul_items = modal_soup.find_all('li')
                        for item in ul_items:
                            strong_tag = item.find('strong')
                            if strong_tag:
                                label = strong_tag.get_text(strip=True).rstrip(":")
                                # Handle cases where next_sibling might not be a string
                                value = strong_tag.next_sibling
                                if value:
                                    value = value.strip()
                                else:
                                    value = 'No data'
                                nutritional_info[label] = value

                        ingredients = "No ingredients"
                        div_items = modal_soup.find_all('div')
                        # Looping here because finding via lambda function wasn't working. Less ideal, but it works
                        for div in div_items:
                            strong_tag = div.find('strong')
                            if strong_tag and 'Ingredients:' in strong_tag.get_text(strip=True):
                                ingredients = strong_tag.next_sibling.strip()
                                break

                        nutritional_info["Ingredients"] = ingredients

                    # Close the modal
                    close_button = driver.find_element(By.CSS_SELECTOR, ".modal-header .close")
                    close_button.click()
                except Exception as e:
                    print(f"Error retrieving nutritional info for {item_name}: {str(e)}")
                    nutritional_info = {}

            except Exception as e:
                print(f"Error retrieving data for {item_name}: {str(e)}")
                continue

            food_items.append({
                'Item': item_name,
                'Meal': "Lunch",
                'Portion': portion,
                'Calories': calories,
                'Nutritional Info': nutritional_info,
                'Vegan': is_vegan,
                'Vegetarian': is_vegetarian,
                'Climate Friendly': is_climate
            })

        if food_items:
            for item in food_items:
                print(f"Item: {item['Item']}")
                print(f"Portion: {item['Portion']}, Calories: {item['Calories']}, Nutritional Info: {item['Nutritional Info']}")
                print(f"Vegan?: {item['Vegan']}, Vegetarian?: {item['Vegetarian']}, Climate?: {item['Climate Friendly']}")
                print("")
        else:
            print("No meals found.")

        return food_items

    finally:
        driver.quit()



def dinner():
    """
    Scrapes the dinner menu.

    Returns:
        list: A list of dictionaries containing meal information.
    """
    website = 'https://dineoncampus.com/FIU/whats-on-the-menu'

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Initialize the Chrome driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        driver.get(website)
        # Wait until the table with role 'table' is present
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table[role='table']"))
        )

        # Wait until the navlist is loaded
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "ul[role='tablist']"))
        )

        tab_link = driver.find_element(By.LINK_TEXT, 'Dinner')
        tab_link.click()

        time.sleep(10)

        # Find all rows with role 'row'
        rows = driver.find_elements(By.CSS_SELECTOR, 'tr[role="row"]')

        food_items = []

        for row in rows:
            item_name, portion, calories, nutritional_info, is_vegan, is_vegetarian, is_climate = None, None, None, {}, False, False, False

            td_cells = row.find_elements(By.TAG_NAME, 'td')

            # Skip rows without cells (e.g., header rows)
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

                img_tags = item_cell.find_elements(By.TAG_NAME, 'img')
                
                for img in img_tags:
                    # Check both the alt and src. Climate needs the src because it doesn't have an alt
                    alt = img.get_attribute('alt') or ""
                    src = img.get_attribute('src') or ""
                    if "Contains no animal-based ingredients or by-products." in alt or "vegan" in src:
                        is_vegan = True
                    elif "Contains no meat, poultry, fish or seafood but may contain eggs or dairy." in alt or "vegetarian" in src:
                        is_vegetarian = True
                    elif "climate" in src:
                        is_climate = True

                # Extract portion
                portion_cell = td_cells[1]
                portion = portion_cell.text.strip()

                # Extract calories
                calories_cell = td_cells[2]
                calories = calories_cell.text.strip()

                # Find the "Nutritional Info" button in the current row
                try:
                    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn.btn-nutrition")))

                    button = row.find_element(By.CSS_SELECTOR, '.btn.btn-nutrition')
                    driver.execute_script("arguments[0].scrollIntoView(true);", button)
                    driver.execute_script("arguments[0].click();", button)

                    # Wait for the modal to be visible
                    WebDriverWait(driver, 20).until(
                        EC.visibility_of_element_located((By.CLASS_NAME, "modal-body"))
                    )
                    # Wait for the modal to load
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
                                # Handle cases where next_sibling might not be a string
                                value = strong_tag.next_sibling
                                if value:
                                    value = value.strip()
                                else:
                                    value = 'No data'
                                nutritional_info[label] = value

                        ingredients = "No ingredients"
                        div_items = modal_soup.find_all('div')
                        # Looping here because finding via lambda function wasn't working. Less ideal, but it works
                        for div in div_items:
                            strong_tag = div.find('strong')
                            if strong_tag and 'Ingredients:' in strong_tag.get_text(strip=True):
                                ingredients = strong_tag.next_sibling.strip()
                                break

                        nutritional_info["Ingredients"] = ingredients

                    # Close the modal
                    close_button = driver.find_element(By.CSS_SELECTOR, ".modal-header .close")
                    close_button.click()
                except Exception as e:
                    print(f"Error retrieving nutritional info for {item_name}: {str(e)}")
                    nutritional_info = {}

            except Exception as e:
                print(f"Error retrieving data for {item_name}: {str(e)}")
                continue

            food_items.append({
                'Item': item_name,
                'Meal': "Dinner",
                'Portion': portion,
                'Calories': calories,
                'Nutritional Info': nutritional_info,
                'Vegan': is_vegan,
                'Vegetarian': is_vegetarian,
                'Climate Friendly': is_climate
            })

        if food_items:
            for item in food_items:
                print(f"Item: {item['Item']}")
                print(f"Portion: {item['Portion']}, Calories: {item['Calories']}, Nutritional Info: {item['Nutritional Info']}")
                print(f"Vegan?: {item['Vegan']}, Vegetarian?: {item['Vegetarian']}, Climate?: {item['Climate Friendly']}")
                print("")
        else:
            print("No meals found.")

        return food_items

    finally:
        driver.quit()


dinner()