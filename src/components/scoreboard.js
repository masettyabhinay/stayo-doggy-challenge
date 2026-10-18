// STAYO Physical Hanging Scoreboard Component
// Simulates a realistic hostel wooden notice board with suspension chains and physical drop physics.
// Coordinated directly with Doggy's jump and rope-pull animation.

import { sound } from "./audio.js";

export class Scoreboard {
  constructor(containerElement) {
    this.container = containerElement;
    this.rendered = false;
    this.isDropped = false;
  }

  render(resultData) {
    const { scorePercent, personality } = resultData;

    this.container.innerHTML = `
      <div class="physical-scoreboard-wrapper" id="scoreboardWrapper">
        <!-- Hanging Suspension Chains linked to ceiling beam -->
        <div class="hanging-chains">
          <div class="chain chain-left">
            <span class="chain-link"></span><span class="chain-link"></span>
            <span class="chain-link"></span><span class="chain-link"></span>
          </div>
          <div class="chain chain-right">
            <span class="chain-link"></span><span class="chain-link"></span>
            <span class="chain-link"></span><span class="chain-link"></span>
          </div>
        </div>

        <!-- The Physical Wooden Scoreboard Body (Hoisted above screen initially) -->
        <div class="wooden-board-body" id="boardBody">
          <!-- Brass corner brackets -->
          <div class="corner-bracket corner-tl"></div>
          <div class="corner-bracket corner-tr"></div>
          <div class="corner-bracket corner-bl"></div>
          <div class="corner-bracket corner-br"></div>

          <!-- Board Header Notice Plaque -->
          <div class="board-header">
            <div class="stayo-board-badge">
              <svg width="22" height="22" viewBox="0 0 350 184" class="stayo-mini-logo">
                <path d="M0 0 C46 2 90 9 130 29 C181 64 228 175 211 190 C127 174 93 125 0 100 C-133 145 -140 197 -96 242 C89 294 237 408 246 486 C246 548 210 654 115 691 C10 692 -127 691 -190 676 C-258 536 -258 459 -235 433 C-161 408 -153 496 -139 588 C-98 602 12 602 127 588 C142 544 142 491 70 395 C-134 336 -249 150 -202 67 C-69 -2 0 0 Z" fill="#C0552F" transform="translate(180, 20) scale(0.22)"/>
              </svg>
              <span>OFFICIAL STAYO SCOREBOARD</span>
            </div>
            <div class="board-doc-no">REF: STY-2026-CHLG</div>
          </div>

          <!-- Main Results Display -->
          <div class="board-content" id="boardContent">
            <!-- Score Dial & Percentage Counter (Revealed only after board settles) -->
            <div class="score-spotlight">
              <div class="score-circle">
                <span class="score-counter" id="scoreCounter">0</span>
                <span class="score-unit">%</span>
              </div>
              <div class="score-subtext">HOSTEL SURVIVAL INDEX</div>
            </div>

            <!-- Personality Result Details -->
            <div class="personality-banner" id="personalityBanner">
              <div class="personality-tag" style="background-color: ${personality.accentColor}20; color: ${personality.accentColor}; border: 1px solid ${personality.accentColor}40;">
                ${personality.badge}
              </div>
              <h2 class="personality-title">${personality.emoji} ${personality.title}</h2>
              <p class="personality-tagline">"${personality.tagline}"</p>
            </div>

            <!-- Core Trait Meters -->
            <div class="board-traits-grid" id="boardTraits">
              ${personality.traits.map(t => `
                <div class="trait-row">
                  <div class="trait-info">
                    <span class="trait-name">${t.name}</span>
                    <span class="trait-val">${t.value}%</span>
                  </div>
                  <div class="trait-bar-track">
                    <div class="trait-bar-fill" style="width: 0%;" data-target-width="${t.value}%" style="background-color: ${personality.accentColor}"></div>
                  </div>
                  <span class="trait-label">${t.label}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    this.boardEl = this.container.querySelector("#boardBody");
    this.scoreCounterEl = this.container.querySelector("#scoreCounter");
    this.personalityBannerEl = this.container.querySelector("#personalityBanner");
    this.boardTraitsEl = this.container.querySelector("#boardTraits");
    this.rendered = true;
    this.isDropped = false;
  }

  // Step 6 & 7: Scoreboard descends in response to Doggy pulling the rope, and settles with a bounce
  dropBoard(onComplete) {
    if (!this.rendered || this.isDropped) return;
    this.isDropped = true;

    // Play impact sound as board descends
    sound.playBoardDrop();
    if (this.boardEl) {
      this.boardEl.classList.add("dropped-in");
    }

    // Trigger onComplete when the board finishes settling (~950ms)
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 950);
    }
  }

  // Step 8: Reveal the score and personality only after the board has fully settled
  revealScore(targetScore, onRevealComplete) {
    if (!this.rendered) return;

    // Animate score counter numbers counting up
    this.animateCounter(targetScore);

    // Expand trait meters
    const fills = this.container.querySelectorAll(".trait-bar-fill");
    fills.forEach(fill => {
      setTimeout(() => {
        fill.style.width = fill.getAttribute("data-target-width");
      }, 250);
    });

    if (onRevealComplete) {
      setTimeout(() => {
        onRevealComplete();
      }, 1200);
    }
  }

  animateCounter(targetScore) {
    let current = 0;
    const duration = 1100;
    const startTime = performance.now();

    const raf = (typeof window !== "undefined" && window.requestAnimationFrame) 
      ? window.requestAnimationFrame.bind(window) 
      : (typeof globalThis !== "undefined" && globalThis.requestAnimationFrame)
        ? globalThis.requestAnimationFrame
        : (cb) => setTimeout(cb, 16);

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      current = Math.round(easeProgress * targetScore);
      if (this.scoreCounterEl) {
        this.scoreCounterEl.textContent = current;
      }
      if (progress < 1) {
        raf(update);
      }
    };

    raf(update);
  }
}
