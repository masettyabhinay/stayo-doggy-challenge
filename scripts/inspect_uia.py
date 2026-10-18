import pywinauto
from pywinauto import Desktop

print("Listing visible windows with pywinauto...")
try:
    windows = Desktop(backend="uia").windows()
    for w in windows:
        title = w.window_text()
        if title:
            print("Window:", title)
except Exception as e:
    print("Error:", e)
