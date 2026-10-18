// STAYO Doggy Mascot - Character Controller with Real Official Expressions
// Faithful to the official STAYO mascot: terracotta-brown (#B46A55), cream muzzle & paws (#EBD9C4)
// Integrates official Doggy expression and pose images:
// happy, sad, shocked, confused, jumping, rope-pulling, neutral, waving, sleepy.

import { sound } from "./audio.js";

export const DOGGY_IMAGES = {
  // 1. Idle & Neutral
  idle: "/assets/doggy-expressions/doggy-neutral.png",
  neutral: "/assets/doggy-expressions/doggy-neutral.png",

  // 2. Happy & Smiles & Laughing
  happy: "/assets/doggy-expressions/doggy-happy.png",
  warm_smile: "/assets/doggy-expressions/doggy-happy.png",
  laughing: "/assets/doggy-expressions/doggy-happy.png",
  mischievous: "/assets/doggy-expressions/doggy-happy.png",

  // 3. Confused & Thinking & Puzzled
  confused: "/assets/doggy-expressions/doggy-confused.png",
  confused_tilt: "/assets/doggy-expressions/doggy-confused.png",
  thinking: "/assets/doggy-expressions/doggy-confused.png",
  clever_smirk: "/assets/doggy-expressions/doggy-confused.png",
  annoyed_roll: "/assets/doggy-expressions/doggy-confused.png",
  shrug: "/assets/doggy-expressions/doggy-confused.png",
  medium_score: "/assets/doggy-expressions/doggy-confused.png",
  notice_rope: "/assets/doggy-expressions/doggy-confused.png",

  // 4. Shocked & Surprise
  shocked: "/assets/doggy-expressions/doggy-shocked.png",
  shock: "/assets/doggy-expressions/doggy-shocked.png",

  // 5. Sad & Disbelief
  sad: "/assets/doggy-expressions/doggy-sad.png",
  sympathetic_sad: "/assets/doggy-expressions/doggy-sad.png",
  low_score_freeze: "/assets/doggy-expressions/doggy-sad.png",
  walk_away: "/assets/doggy-expressions/doggy-sad.png",

  // 6. Sleepy & Yawn
  sleepy: "/assets/doggy-expressions/doggy-sleepy.png",
  sleepy_yawn: "/assets/doggy-expressions/doggy-sleepy.png",

  // 7. Waving & Welcoming & Confident
  welcome: "/assets/doggy-expressions/doggy-waving.png",
  confident: "/assets/doggy-expressions/doggy-waving.png",
  waving: "/assets/doggy-expressions/doggy-waving.png",
  share_gesture: "/assets/doggy-expressions/doggy-waving.png",

  // 8. Choreography: Jumping & Rope-Pulling
  crouch_jump: "/assets/doggy-expressions/doggy-neutral.png",
  jump_up: "/assets/doggy-expressions/doggy-jumping.png",
  grab_rope: "/assets/doggy-expressions/doggy-jumping.png",
  pull_rope: "/assets/doggy-expressions/doggy-pulling.png",
  celebrate: "/assets/doggy-expressions/doggy-jumping.png"
};

// Preload all expressions to eliminate latency during transitions
const preloadedCache = {};
if (typeof window !== "undefined") {
  Object.entries(DOGGY_IMAGES).forEach(([key, src]) => {
    if (!preloadedCache[src]) {
      const img = new Image();
      img.src = src;
      preloadedCache[src] = img;
    }
  });
}

export class DoggyMascot {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.expression = "idle";
    this.options = options;

    this.render();
  }

  render() {
    const initialSrc = DOGGY_IMAGES[this.expression] || DOGGY_IMAGES.idle;

    this.container.innerHTML = `
      <div class="doggy-wrapper" id="doggyMascot">
        <!-- Live Speech Bubble -->
        <div class="doggy-speech-bubble" id="doggySpeech" role="status" aria-live="polite">
          <span class="doggy-speech-text" id="doggySpeechText">Woof! Ready to test your hostel survival skills? 🐶</span>
          <div class="doggy-speech-tail"></div>
        </div>

        <!-- Mascot Character Frame -->
        <div class="doggy-character-box expr-${this.expression}" id="doggyBox">
          <!-- Floating Emote Badge -->
          <div class="doggy-emote-badge" id="doggyEmote"></div>

          <!-- Official Doggy Expression Image Display -->
          <div class="doggy-img-frame" id="doggyImgFrame">
            <img 
              class="doggy-expression-img" 
              id="doggyImg" 
              src="${initialSrc}" 
              alt="STAYO Doggy Mascot"
              draggable="false"
            />
          </div>
        </div>
      </div>
    `;

    // Cache element references
    this.speechEl = this.container.querySelector("#doggySpeech");
    this.speechTextEl = this.container.querySelector("#doggySpeechText");
    this.doggyBoxEl = this.container.querySelector("#doggyBox");
    this.doggyImgEl = this.container.querySelector("#doggyImg");
    this.emoteEl = this.container.querySelector("#doggyEmote");
  }

  say(message, mood = "neutral") {
    if (!this.speechTextEl || !this.speechEl) return;

    // Reset bubble animation
    this.speechEl.classList.remove("bounce-in", "shock-shake");
    void this.speechEl.offsetWidth; // force reflow

    this.speechTextEl.textContent = message;
    this.speechEl.className = `doggy-speech-bubble visible mood-${mood} bounce-in`;
  }

  // Master Expression Dispatcher - Coordinates all 24 questions & interactive actions
  setExpression(exprName, speechMessage = null, emote = null) {
    this.expression = exprName;

    if (!this.doggyBoxEl) return;

    // Remove all previous expression classes and apply new one
    this.doggyBoxEl.className = "doggy-character-box";
    this.doggyBoxEl.classList.add(`expr-${exprName}`);

    // Update the Doggy image to the matching expression
    if (this.doggyImgEl) {
      const targetSrc = DOGGY_IMAGES[exprName] || DOGGY_IMAGES.idle;
      if (this.doggyImgEl.getAttribute("src") !== targetSrc) {
        this.doggyImgEl.src = targetSrc;
      }
    }

    // Emote badge
    if (emote && this.emoteEl) {
      this.emoteEl.textContent = emote;
      this.emoteEl.classList.add("visible");
      setTimeout(() => {
        if (this.emoteEl) this.emoteEl.classList.remove("visible");
      }, 2400);
    }

    // Speech bubble
    if (speechMessage) {
      this.say(speechMessage, exprName);
    }

    // Trigger audio effects where appropriate
    switch (exprName) {
      case "mischievous":
      case "clever_smirk":
      case "confident":
      case "welcome":
      case "jump_up":
        sound.playPop();
        break;

      case "shocked":
      case "shock":
        sound.playPop();
        break;

      case "pull_rope":
        sound.playRopePull();
        break;

      case "celebrate":
        sound.playHighCelebration();
        break;

      case "shrug":
      case "medium_score":
        sound.playMediumChime();
        break;

      case "low_score_freeze":
      case "walk_away":
      case "sad":
        sound.playLowSad();
        break;

      default:
        break;
    }
  }

  // Backward compatibility alias for setState
  setState(stateName, speechMessage = null, emote = null) {
    const map = {
      idle: "idle",
      welcome: "welcome",
      thinking: "confused_tilt",
      shock: "shocked",
      funny: "laughing",
      pull_rope: "pull_rope",
      low_score_freeze: "low_score_freeze",
      walk_away: "walk_away",
      celebrate: "celebrate",
      medium_score: "shrug",
      share_gesture: "confident"
    };

    const targetExpr = map[stateName] || stateName;
    this.setExpression(targetExpr, speechMessage, emote);
  }

  celebrateConfetti() {
    const confettiColors = ["#C0552F", "#F4A65A", "#FFC98A", "#2B4C5F", "#48BB78", "#9F7AEA"];
    const container = document.body;

    for (let i = 0; i < 60; i++) {
      const conf = document.createElement("div");
      conf.className = "confetti-piece";
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.animationDuration = `${Math.random() * 1.8 + 1.8}s`;
      conf.style.animationDelay = `${Math.random() * 0.4}s`;
      conf.style.width = `${Math.random() * 10 + 6}px`;
      conf.style.height = `${Math.random() * 14 + 8}px`;

      container.appendChild(conf);
      setTimeout(() => conf.remove(), 4000);
    }
  }

  destroy() {
    // cleanup if needed
  }
}
