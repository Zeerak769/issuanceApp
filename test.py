from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Set up Chrome options
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)
chrome_options.add_argument(r"--user-data-dir=C:\Users\bunny\AppData\Local\Google\Chrome\User Data")
chrome_options.add_argument("--profile-directory=Default")  # Adjust if using a different profile
chrome_options.add_argument("--log-level=1")

# Initialize WebDriver with ChromeDriverManager
chrome_service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

def check_whatsapp_registration(base_phone_number, iterations=5000):
    driver.get('https://web.whatsapp.com')
    driver.implicitly_wait(10)
    
    country_code, area_code, local_number = base_phone_number.split()
    base_local_number = int(local_number)
    
    # Click 'New chat' button once
    try:
        new_chat_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@role='button'][@title='New chat']"))
        )
        new_chat_button.click()
    except Exception as e:
        print(f"Error clicking 'New chat' button: {e}")
        driver.quit()
        return

    # Open file for appending
    filename = f"registered_{base_local_number}_to_{base_local_number + iterations - 1}.txt"
    with open(filename, 'a') as file:
        for i in range(iterations):
            current_number = f"{country_code} {area_code} {base_local_number + i}"
            print("Searching for", current_number)
            try:
                # Locate the search box
                search_box = WebDriverWait(driver, 30).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@role='textbox']"))
                )
                
                # Clear the search box by selecting all text and deleting
                search_box.click()
                search_box.send_keys(Keys.CONTROL + 'a')  # Select all text
                search_box.send_keys(Keys.DELETE)         # Delete the selected text
                
                # Enter the new number
                search_box.send_keys(current_number)
                search_box.send_keys(Keys.RETURN)
                
                try:
                    # Check if the contact is found
                    WebDriverWait(driver, 2).until(
                        EC.presence_of_element_located((By.XPATH, f"//span[@title='{current_number}']"))
                    )
                    print("Found")
                    file.write(current_number + '\n')  # Write the registered number to the file immediately
                    file.flush()  # Ensure immediate write
                except Exception as e:
                    pass
                
                # Check for the 'New chat' button after each search
                try:
                    new_chat_button = WebDriverWait(driver, 1).until(
                        EC.presence_of_element_located((By.XPATH, "//div[@role='button'][@title='New chat']"))
                    )
                    new_chat_button.click()
                except:
                    pass  # If the button is not found, continue
                
            except Exception as e:
                print(f"Error during search process: {e}")

    driver.quit()
    print(f"Registered numbers saved to {filename}")

# Example usage
base_phone_number = "+44 7446 782205"  # Base phone number with correct format
check_whatsapp_registration(base_phone_number)
