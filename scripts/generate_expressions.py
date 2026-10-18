import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

dest_dir = r"F:\Stayo game\public\assets\doggy-expressions"
os.makedirs(dest_dir, exist_ok=True)

# 1. doggy-sad.svg
sad_svg = """<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <g id="tail"><path d="M205 250 C240 255 255 240 258 215 C260 235 248 268 210 272 Z" fill="#A45D44"/></g>
  <g id="body">
    <path d="M95 300 C90 230 100 190 150 185 C200 190 210 230 205 300 Z" fill="#B46A55"/>
    <ellipse cx="150" cy="255" rx="34" ry="40" fill="#EBD9C4"/>
  </g>
  <g id="head-group">
    <!-- Droopy sad ears -->
    <g id="ear-left" transform="rotate(10 96 92)">
      <path d="M96 92 C68 100 58 145 78 185 C90 205 108 200 110 178 C112 150 108 115 96 92 Z" fill="#A45D44"/>
    </g>
    <g id="ear-right" transform="rotate(-10 204 92)">
      <path d="M204 92 C232 100 242 145 222 185 C210 205 192 200 190 178 C188 150 192 115 204 92 Z" fill="#A45D44"/>
    </g>
    <circle id="head" cx="150" cy="128" r="62" fill="#B46A55"/>
    <ellipse id="muzzle" cx="150" cy="152" rx="36" ry="26" fill="#EBD9C4"/>
    <circle id="nose" cx="150" cy="140" r="7" fill="#2F2F2F"/>
    
    <!-- Sad angled eyebrows -->
    <g id="eyebrow-left">
      <path d="M120 100 Q130 94 140 102" stroke="#2F2F2F" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
    <g id="eyebrow-right">
      <path d="M160 102 Q170 94 180 100" stroke="#2F2F2F" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
    
    <!-- Big sad puppy eyes looking up -->
    <g id="eye-left">
      <circle cx="130" cy="115" r="9" fill="#2F2F2F"/>
      <circle cx="128" cy="112" r="3.4" fill="#FFFFFF"/>
      <circle cx="133" cy="118" r="1.4" fill="#FFFFFF" opacity="0.8"/>
    </g>
    <g id="eye-right">
      <circle cx="170" cy="115" r="9" fill="#2F2F2F"/>
      <circle cx="168" cy="112" r="3.4" fill="#FFFFFF"/>
      <circle cx="173" cy="118" r="1.4" fill="#FFFFFF" opacity="0.8"/>
    </g>
    
    <!-- Little tear drop -->
    <path d="M121 127 Q117 137 122 141 Q127 137 123 127 Z" fill="#60A5FA" opacity="0.9"/>
    
    <!-- Downturned sad mouth -->
    <g id="mouth">
      <path d="M136 166 Q150 156 164 166" stroke="#2F2F2F" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
  </g>
  <g id="paws">
    <ellipse cx="122" cy="292" rx="16" ry="10" fill="#EBD9C4"/>
    <ellipse cx="178" cy="292" rx="16" ry="10" fill="#EBD9C4"/>
  </g>
</svg>"""

with open(os.path.join(dest_dir, "doggy-sad.svg"), "w", encoding="utf-8") as f:
    f.write(sad_svg)

# 2. doggy-shocked.svg
shocked_svg = """<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <g id="tail"><path d="M205 240 C245 230 268 200 262 170 C275 195 268 240 215 258 Z" fill="#A45D44"/></g>
  <g id="body">
    <path d="M95 300 C90 230 100 190 150 185 C200 190 210 230 205 300 Z" fill="#B46A55"/>
    <ellipse cx="150" cy="255" rx="34" ry="40" fill="#EBD9C4"/>
  </g>
  <g id="head-group">
    <!-- Perked shocked ears -->
    <g id="ear-left" transform="rotate(-8 96 92)">
      <path d="M96 92 C68 100 58 145 78 185 C90 205 108 200 110 178 C112 150 108 115 96 92 Z" fill="#A45D44"/>
    </g>
    <g id="ear-right" transform="rotate(8 204 92)">
      <path d="M204 92 C232 100 242 145 222 185 C210 205 192 200 190 178 C188 150 192 115 204 92 Z" fill="#A45D44"/>
    </g>
    <circle id="head" cx="150" cy="128" r="62" fill="#B46A55"/>
    <ellipse id="muzzle" cx="150" cy="154" rx="36" ry="26" fill="#EBD9C4"/>
    <circle id="nose" cx="150" cy="138" r="7" fill="#2F2F2F"/>
    
    <!-- High arched shocked eyebrows -->
    <g id="eyebrow-left">
      <path d="M116 86 Q128 78 140 86" stroke="#2F2F2F" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
    <g id="eyebrow-right">
      <path d="M160 86 Q172 78 184 86" stroke="#2F2F2F" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
    
    <!-- Huge wide-open shocked eyes -->
    <g id="eye-left">
      <circle cx="128" cy="108" r="12" fill="#2F2F2F"/>
      <circle cx="132" cy="104" r="4.2" fill="#FFFFFF"/>
      <circle cx="124" cy="112" r="1.8" fill="#FFFFFF" opacity="0.8"/>
    </g>
    <g id="eye-right">
      <circle cx="172" cy="108" r="12" fill="#2F2F2F"/>
      <circle cx="176" cy="104" r="4.2" fill="#FFFFFF"/>
      <circle cx="168" cy="112" r="1.8" fill="#FFFFFF" opacity="0.8"/>
    </g>
    
    <!-- Shock sweat drop -->
    <path d="M190 94 Q186 103 190 107 Q194 103 192 94 Z" fill="#60A5FA" opacity="0.9"/>
    
    <!-- Open 'O' shocked mouth -->
    <g id="mouth">
      <ellipse cx="150" cy="164" rx="10" ry="13" fill="#2F2F2F"/>
      <ellipse cx="150" cy="168" rx="6" ry="6" fill="#FF708F"/>
    </g>
  </g>
  <g id="paws">
    <!-- Paws raised slightly to chest in surprise -->
    <ellipse cx="126" cy="272" rx="16" ry="11" fill="#EBD9C4" transform="rotate(-15 126 272)"/>
    <ellipse cx="174" cy="272" rx="16" ry="11" fill="#EBD9C4" transform="rotate(15 174 272)"/>
  </g>
</svg>"""

with open(os.path.join(dest_dir, "doggy-shocked.svg"), "w", encoding="utf-8") as f:
    f.write(shocked_svg)

# 3. doggy-pulling.svg
pulling_svg = """<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Hanging rope gripped by paws -->
  <g id="rope-station">
    <line x1="150" y1="0" x2="150" y2="48" stroke="#D8BFA5" stroke-width="8" stroke-dasharray="4,2"/>
    <line x1="150" y1="0" x2="150" y2="48" stroke="#B46A55" stroke-width="2"/>
    <!-- Rope handle ring / knot -->
    <ellipse cx="150" cy="52" rx="22" ry="10" fill="none" stroke="#C0552F" stroke-width="6"/>
  </g>
  <g id="tail"><path d="M205 240 C245 230 268 200 262 170 C275 195 268 240 215 258 Z" fill="#A45D44"/></g>
  <g id="body">
    <!-- Torso flexing downward with pull weight -->
    <path d="M95 300 C90 230 100 185 150 180 C200 185 210 230 205 300 Z" fill="#B46A55"/>
    <ellipse cx="150" cy="250" rx="34" ry="40" fill="#EBD9C4"/>
  </g>
  
  <!-- Reaching and gripping muscular arms holding the rope -->
  <g id="reaching-arms">
    <!-- Left arm pulling downward -->
    <path d="M100 205 C75 140 105 75 138 52" fill="none" stroke="#B46A55" stroke-width="24" stroke-linecap="round"/>
    <path d="M100 205 C75 140 105 75 138 52" fill="none" stroke="#A45D44" stroke-width="20" stroke-linecap="round"/>
    <!-- Left gripping paw clasped over handle -->
    <ellipse cx="140" cy="52" rx="16" ry="12" fill="#EBD9C4" transform="rotate(-15 140 52)"/>
    <circle cx="134" cy="48" r="3.2" fill="#D8BFA5"/>
    <circle cx="140" cy="46" r="3.4" fill="#D8BFA5"/>
    <circle cx="146" cy="48" r="3.2" fill="#D8BFA5"/>

    <!-- Right arm pulling downward -->
    <path d="M200 205 C225 140 195 75 162 52" fill="none" stroke="#B46A55" stroke-width="24" stroke-linecap="round"/>
    <path d="M200 205 C225 140 195 75 162 52" fill="none" stroke="#A45D44" stroke-width="20" stroke-linecap="round"/>
    <!-- Right gripping paw clasped over handle -->
    <ellipse cx="160" cy="52" rx="16" ry="12" fill="#EBD9C4" transform="rotate(15 160 52)"/>
    <circle cx="154" cy="48" r="3.2" fill="#D8BFA5"/>
    <circle cx="160" cy="46" r="3.4" fill="#D8BFA5"/>
    <circle cx="166" cy="48" r="3.2" fill="#D8BFA5"/>
  </g>

  <g id="head-group" transform="translate(0, -6)">
    <!-- Ears perked with effort -->
    <g id="ear-left"><path d="M100 88 C74 84 60 118 74 158 C86 180 104 172 108 150 C112 128 110 105 100 88 Z" fill="#A45D44"/></g>
    <g id="ear-right"><path d="M200 88 C226 84 240 118 226 158 C214 180 196 172 192 150 C188 128 190 105 200 88 Z" fill="#A45D44"/></g>
    <circle id="head" cx="150" cy="128" r="62" fill="#B46A55"/>
    <ellipse id="muzzle" cx="150" cy="152" rx="36" ry="26" fill="#EBD9C4"/>
    <circle id="nose" cx="150" cy="140" r="7" fill="#2F2F2F"/>
    
    <!-- Determined strong eyebrows -->
    <g id="eyebrow-left">
      <path d="M120 102 Q130 96 140 98" stroke="#2F2F2F" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
    <g id="eyebrow-right">
      <path d="M160 98 Q170 96 180 102" stroke="#2F2F2F" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
    
    <!-- Determined joyful eyes looking up at the rope -->
    <g id="eye-left">
      <circle cx="130" cy="110" r="8.5" fill="#2F2F2F"/>
      <circle cx="132" cy="106" r="3" fill="#FFFFFF"/>
    </g>
    <g id="eye-right">
      <circle cx="170" cy="110" r="8.5" fill="#2F2F2F"/>
      <circle cx="172" cy="106" r="3" fill="#FFFFFF"/>
    </g>
    
    <!-- Energetic determined grin -->
    <g id="mouth">
      <path d="M128 154 Q150 180 172 154 Z" fill="#2F2F2F"/>
      <path d="M136 162 C134 184 136 196 150 200 C164 196 166 184 164 162 Z" fill="#FF708F"/>
    </g>
  </g>
</svg>"""

with open(os.path.join(dest_dir, "doggy-pulling.svg"), "w", encoding="utf-8") as f:
    f.write(pulling_svg)

print("Generated SVGs successfully!")

# Now let's render SVGs to 800x800 PNGs using headless Chrome
html_content = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ background: transparent; width: 800px; height: 800px; overflow: hidden; }}
  .svg-container {{ width: 800px; height: 800px; display: flex; align-items: center; justify-content: center; }}
  svg {{ width: 100%; height: 100%; }}
</style>
</head>
<body>
  <div class="svg-container" id="container"></div>
</body>
</html>"""

html_path = r"F:\Stayo game\scripts\render_svg.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=800,800")
options.add_argument("--hide-scrollbars")

driver = webdriver.Chrome(options=options)
try:
    driver.get(f"file:///{html_path.replace(os.sep, '/')}")
    time.sleep(1)

    svgs_to_render = [
        ("doggy-sad.svg", "doggy-sad.png"),
        ("doggy-shocked.svg", "doggy-shocked.png"),
        ("doggy-pulling.svg", "doggy-pulling.png"),
    ]

    for svg_fn, png_fn in svgs_to_render:
        with open(os.path.join(dest_dir, svg_fn), "r", encoding="utf-8") as fp:
            s_content = fp.read()
        
        # Inject SVG into container
        driver.execute_script("document.getElementById('container').innerHTML = arguments[0];", s_content)
        time.sleep(0.5)
        
        png_out = os.path.join(dest_dir, png_fn)
        driver.save_screenshot(png_out)
        print(f"Rendered {png_fn} ({os.path.getsize(png_out)} bytes)")

finally:
    driver.quit()
    if os.path.exists(html_path):
        os.remove(html_path)

print("All Doggy expressions rendered and installed!")
