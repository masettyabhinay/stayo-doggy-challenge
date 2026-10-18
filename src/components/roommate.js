// STAYO Roommate Character Component
// A simple, friendly college hostel student matching STAYO brand aesthetics.
// Appears in the signature Low-Score Ending to take Doggy away!

export function createRoommateElement() {
  const container = document.createElement("div");
  container.className = "roommate-character";
  container.setAttribute("aria-label", "Friendly College Roommate");

  container.innerHTML = `
    <div class="roommate-sprite">
      <!-- Friendly College Student SVG in STAYO Palette -->
      <svg viewBox="0 0 160 260" class="roommate-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2B4C5F" />
            <stop offset="100%" stop-color="#1B3340" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#F5CBA7" />
            <stop offset="100%" stop-color="#E59866" />
          </linearGradient>
          <linearGradient id="maggiCupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFDD53" />
            <stop offset="100%" stop-color="#E5A823" />
          </linearGradient>
        </defs>

        <!-- Backpack straps & bag behind -->
        <path d="M 38 100 Q 25 150 35 190 Q 50 195 55 180" fill="#C0552F" opacity="0.9" />
        <path d="M 122 100 Q 135 150 125 190 Q 110 195 105 180" fill="#C0552F" opacity="0.9" />

        <!-- Legs & Casual Trousers -->
        <g class="roommate-legs">
          <rect x="52" y="180" width="22" height="60" rx="9" fill="#3D3A45" />
          <rect x="86" y="180" width="22" height="60" rx="9" fill="#2E2C35" />
          <!-- Sneakers -->
          <ellipse cx="60" cy="244" rx="16" ry="9" fill="#FFFFFF" stroke="#E59866" stroke-width="2" />
          <ellipse cx="98" cy="244" rx="16" ry="9" fill="#FFFFFF" stroke="#E59866" stroke-width="2" />
        </g>

        <!-- Torso & College Hoodie -->
        <g class="roommate-torso">
          <path d="M 42 105 Q 80 95 118 105 L 122 185 Q 80 192 38 185 Z" fill="url(#hoodieGrad)" />
          <!-- Hoodie pocket -->
          <path d="M 54 148 L 106 148 L 98 175 L 62 175 Z" fill="#1B3340" opacity="0.7" rx="4" />
          <!-- STAYO chest emblem -->
          <circle cx="65" cy="125" r="9" fill="#C0552F" />
          <text x="65" y="129" font-family="'Manrope', sans-serif" font-size="9" font-weight="800" fill="#FFFFFF" text-anchor="middle">S</text>
          <!-- Drawstrings -->
          <line x1="75" y1="108" x2="73" y2="132" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
          <line x1="85" y1="108" x2="87" y2="132" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- Left Arm: Waving friendly / pointing to exit -->
        <g class="roommate-arm-left">
          <path d="M 42 108 Q 20 125 24 150 Q 28 158 35 152 Q 45 130 52 115 Z" fill="#2B4C5F" />
          <circle cx="25" cy="154" r="8" fill="url(#skinGrad)" />
        </g>

        <!-- Right Arm: Holding hot cup of Maggi -->
        <g class="roommate-arm-right">
          <path d="M 118 108 Q 138 125 134 155 Q 128 162 122 155 Q 115 135 108 115 Z" fill="#2B4C5F" />
          <!-- Hand holding cup -->
          <circle cx="132" cy="155" r="8" fill="url(#skinGrad)" />
          <!-- Hot Maggi Cup with chopsticks -->
          <g transform="translate(122, 142)">
            <path d="M 2 8 L 18 8 L 16 26 L 4 26 Z" fill="url(#maggiCupGrad)" />
            <ellipse cx="10" cy="8" rx="8" ry="3" fill="#E5A823" />
            <!-- Steam swirls -->
            <path d="M 6 4 Q 8 0 6 -4" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.75" />
            <path d="M 12 5 Q 14 1 12 -3" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.75" />
            <!-- Chopsticks sticking out -->
            <line x1="6" y1="12" x2="22" y2="-2" stroke="#8D5B4C" stroke-width="1.8" stroke-linecap="round" />
          </g>
        </g>

        <!-- Head, Neck & Hair -->
        <g class="roommate-head">
          <rect x="74" y="90" width="12" height="18" fill="url(#skinGrad)" />
          <!-- Face -->
          <ellipse cx="80" cy="65" rx="26" ry="29" fill="url(#skinGrad)" />
          <!-- Messy College Hair -->
          <path d="M 54 62 Q 52 35 78 35 Q 106 33 106 60 Q 98 48 85 49 Q 70 48 54 62 Z" fill="#2B1B17" />
          <!-- Ears -->
          <ellipse cx="53" cy="67" rx="5" ry="7" fill="url(#skinGrad)" />
          <ellipse cx="107" cy="67" rx="5" ry="7" fill="url(#skinGrad)" />
          <!-- Eyes with friendly squint -->
          <ellipse cx="70" cy="64" rx="3.5" ry="4" fill="#2B1B17" />
          <circle cx="71.5" cy="62.5" r="1.2" fill="#FFFFFF" />
          <ellipse cx="90" cy="64" rx="3.5" ry="4" fill="#2B1B17" />
          <circle cx="91.5" cy="62.5" r="1.2" fill="#FFFFFF" />
          <!-- Eyebrows (friendly arch) -->
          <path d="M 66 57 Q 71 54 75 56" stroke="#2B1B17" stroke-width="2" stroke-linecap="round" fill="none" />
          <path d="M 85 56 Q 89 54 94 57" stroke="#2B1B17" stroke-width="2" stroke-linecap="round" fill="none" />
          <!-- Friendly Smile -->
          <path d="M 73 75 Q 80 82 87 75" stroke="#2B1B17" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </g>
      </svg>
      <div class="roommate-tag">Roommate Rohit</div>
    </div>
  `;

  return container;
}
