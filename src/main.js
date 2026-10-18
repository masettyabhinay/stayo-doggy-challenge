// STAYO Doggy Challenge - Main Application Controller
// Orchestrates state machine, views, quiz progression, animations, endings, and sharing.
// Implements physically aligned, theatrical jump-and-rope-pull scoreboard reveal after Question 24.

import { questions } from "./data/questions.js";
import { personalities, calculatePersonalityResult } from "./data/personalities.js";
import { DoggyMascot } from "./components/doggy.js";
import { Scoreboard } from "./components/scoreboard.js";
import { createRoommateElement } from "./components/roommate.js";
import { sound } from "./components/audio.js";
import { share } from "./components/share.js";

class StayoGameApp {
  constructor() {
    this.appEl = document.getElementById("app");
    this.currentView = "landing"; // "landing" | "quiz" | "results"
    this.currentQuestionIdx = 0;
    this.userAnswers = new Array(questions.length).fill(null);
    this.playerName = "";
    this.challengeContext = null;
    this.lastResult = null;
    this.mascot = null;
    this.scoreboard = null;
    this.isAnsweringLocked = false;
    this.isScoreboardRevealed = false;

    this.checkUrlParams();
    this.renderHeader();
    this.renderView();
    window.__stayoApp = this;
  }

  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "challenge") {
      this.challengeContext = {
        challenger: params.get("challenger") || "A friend",
        targetScore: parseInt(params.get("targetScore"), 10) || 75,
        personality: params.get("personality") || "biryani_bandit",
        id: params.get("id") || ""
      };
    }

    if (params.get("q") !== null) {
      const qIdx = parseInt(params.get("q"), 10);
      if (!isNaN(qIdx) && qIdx >= 0 && qIdx < questions.length) {
        this.currentView = "quiz";
        this.currentQuestionIdx = qIdx;
        this.playerName = params.get("name") || "Hostel Tester";
        for (let i = 0; i < qIdx; i++) {
          this.userAnswers[i] = 3;
        }
      }
    }

    if (params.get("view") === "results") {
      this.currentView = "results";
      this.playerName = params.get("name") || "Hostel Tester";
      const ending = params.get("ending") || "high";
      if (ending === "high") {
        this.userAnswers = questions.map(q => q.options.reduce((best, opt, i, arr) => opt.score > arr[best].score ? i : best, 0));
      } else if (ending === "low") {
        this.userAnswers = questions.map(q => q.options.reduce((worst, opt, i, arr) => opt.score < arr[worst].score ? i : worst, 0));
      } else {
        this.userAnswers = questions.map(q => 1);
      }
      this.lastResult = calculatePersonalityResult(this.userAnswers, questions);
    }
  }

  showToast(message) {
    let toast = document.getElementById("stayoToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "stayoToast";
      toast.className = "stayo-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  renderHeader() {
    let header = document.getElementById("stayoHeader");
    if (!header) {
      header = document.createElement("header");
      header.id = "stayoHeader";
      header.className = "stayo-header";
      this.appEl.prepend(header);
    }

    header.innerHTML = `
      <a href="#" class="brand-link" id="navHome">
        <img src="/assets/stayo-logo.svg" alt="STAYO - Verified Hostels" class="stayo-nav-logo" />
        <span class="game-title-badge">Doggy Challenge 🐶</span>
      </a>

      <div class="header-actions">
        <button class="btn-audio-toggle" id="audioToggle" title="Toggle Sound FX" aria-label="Toggle Sound Effects">
          🔊
        </button>
        <a href="https://yourstayo.com/" target="_blank" rel="noopener noreferrer" class="btn-main-site">
          Visit yourstayo.com ↗
        </a>
      </div>
    `;

    header.querySelector("#navHome").addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Return to home? Your current quiz progress will restart.")) {
        this.resetGame();
      }
    });

    const audioBtn = header.querySelector("#audioToggle");
    audioBtn.addEventListener("click", () => {
      const isMuted = sound.toggleMute();
      audioBtn.textContent = isMuted ? "🔇" : "🔊";
      audioBtn.title = isMuted ? "Unmute Sound FX" : "Mute Sound FX";
      this.showToast(isMuted ? "Sound Muted" : "Sound Enabled 🔊");
    });
  }

  resetGame() {
    this.currentView = "landing";
    this.currentQuestionIdx = 0;
    this.userAnswers = new Array(questions.length).fill(null);
    this.lastResult = null;
    this.isAnsweringLocked = false;
    this.isScoreboardRevealed = false;
    this.renderView();
  }

  renderView() {
    let mainContainer = document.getElementById("mainContent");
    if (!mainContainer) {
      mainContainer = document.createElement("main");
      mainContainer.id = "mainContent";
      mainContainer.className = "stayo-main-content";
      this.appEl.appendChild(mainContainer);
    }

    mainContainer.innerHTML = "";

    switch (this.currentView) {
      case "landing":
        this.renderLanding(mainContainer);
        break;
      case "quiz":
        this.renderQuiz(mainContainer);
        break;
      case "results":
        this.renderResults(mainContainer);
        break;
    }
  }

  // ── 1. LANDING PAGE VIEW ─────────────────────────────────────────────
  renderLanding(container) {
    const landing = document.createElement("div");
    landing.className = "landing-view";

    landing.innerHTML = `
      <!-- Friend Challenge Alert Banner if active -->
      ${this.challengeContext ? `
        <div class="friend-challenge-alert">
          <div class="challenge-avatar-icon">⚔️</div>
          <div class="challenge-alert-text">
            <h3>Friend Challenge from ${this.challengeContext.challenger}!</h3>
            <p>They scored <strong>${this.challengeContext.targetScore}%</strong> in the STAYO Doggy Challenge. Do you have what it takes to beat their score?</p>
          </div>
        </div>
      ` : ""}

      <div class="landing-hero">
        <div class="challenge-banner-pill">
          <span>🐶 Official STAYO Social Challenge</span>
        </div>

        <h1 class="hero-headline">
          What Type of <span class="highlight-terracotta">Hostel Legend</span> Are You?
        </h1>

        <p class="hero-subtitle">
          Take the STAYO Doggy Challenge, survive hilarious hostel situations, discover your official hostel personality archetype, and unlock verified hostel matches near campus!
        </p>

        <!-- Mascot Stage Container -->
        <div class="mascot-stage-container" id="landingMascotStage"></div>

        <!-- Start CTA & Player Name -->
        <div class="landing-cta-container">
          <input 
            type="text" 
            id="playerNameInput" 
            class="input-player-name" 
            placeholder="Enter your name / nickname" 
            maxlength="24"
            value="${this.playerName}"
          />
          <button class="btn-start-challenge" id="btnStartQuiz">
            <span>Start My Challenge 🚀</span>
          </button>
          <span class="cta-subnote">Takes only 2 minutes • 24 Relatable Questions • No Login Required</span>
        </div>
      </div>

      <!-- Personality Archetypes Preview Section -->
      <section class="landing-preview-section">
        <h2 class="preview-title">Possible Hostel Personalities</h2>
        <p class="preview-subtitle">Which archetype will Doggy certify you as?</p>

        <div class="preview-cards-grid">
          ${Object.values(personalities).map(p => `
            <div class="preview-personality-card">
              <span class="card-emoji">${p.emoji}</span>
              <h3 class="card-title">${p.title}</h3>
              <p class="card-desc">${p.tagline}</p>
            </div>
          `).join("")}
        </div>
      </section>
    `;

    container.appendChild(landing);

    // Initialize Doggy Mascot on Landing
    const mascotContainer = landing.querySelector("#landingMascotStage");
    this.mascot = new DoggyMascot(mascotContainer);
    this.mascot.setExpression(
      "welcome",
      this.challengeContext
        ? `Woof! ${this.challengeContext.challenger} challenged you to beat ${this.challengeContext.targetScore}%! Think you can do it? 🐶`
        : "Woof! Welcome to STAYO! Tell me your name and let's find out your true hostel personality! 🐾"
    );

    // Bind Start Challenge Event
    const nameInput = landing.querySelector("#playerNameInput");
    const startBtn = landing.querySelector("#btnStartQuiz");

    startBtn.addEventListener("click", () => {
      this.playerName = nameInput.value.trim() || (this.challengeContext ? "Challenger" : "Hostel Legend");
      sound.playPop();
      this.currentView = "quiz";
      this.renderView();
    });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startBtn.click();
    });
  }

  // ── 2. QUIZ INTERFACE VIEW ───────────────────────────────────────────
  renderQuiz(container) {
    this.isAnsweringLocked = false;
    const q = questions[this.currentQuestionIdx];
    const progressPercent = Math.round(((this.currentQuestionIdx + 1) / questions.length) * 100);
    const selectedAnswer = this.userAnswers[this.currentQuestionIdx];

    const quiz = document.createElement("div");
    quiz.className = "quiz-view";

    quiz.innerHTML = `
      <!-- Progress Bar & Question Counter -->
      <div class="quiz-progress-bar-container">
        <div class="progress-meta-row">
          <span class="progress-counter-badge">Question ${this.currentQuestionIdx + 1} of ${questions.length}</span>
          <span class="progress-percent">${progressPercent}% Completed</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>

      <!-- Doggy Mascot Live Reaction in Quiz -->
      <div class="mascot-stage-container" id="quizMascotStage"></div>

      <!-- Question Card Container -->
      <div class="quiz-card">
        <h2 class="question-title">${q.title}</h2>

        <div class="options-list" id="optionsList" role="radiogroup" aria-label="Answer options">
          ${q.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedAnswer === idx;
            return `
              <button 
                class="option-card-btn ${isSelected ? 'is-selected' : ''}" 
                data-opt-index="${idx}"
                role="radio"
                aria-checked="${isSelected}"
              >
                <span class="option-letter-badge">${letter}</span>
                <span class="option-text">${opt.text}</span>
              </button>
            `;
          }).join("")}
        </div>

        <!-- Navigation Buttons -->
        <div class="quiz-nav-row">
          <button class="btn-nav-back" id="btnQuizBack" ${this.currentQuestionIdx === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          
          <button class="btn-nav-next" id="btnQuizNext" ${selectedAnswer === null ? 'disabled' : ''}>
            ${this.currentQuestionIdx === questions.length - 1 ? 'Reveal Scoreboard (Auto) 🐶' : 'Next Question →'}
          </button>
        </div>
      </div>
    `;

    container.appendChild(quiz);

    // Initialize Articulated Doggy Mascot on Quiz
    const mascotContainer = quiz.querySelector("#quizMascotStage");
    this.mascot = new DoggyMascot(mascotContainer);

    // Set Question Expression and Dialogue immediately when question appears
    if (selectedAnswer !== null) {
      const chosenOpt = q.options[selectedAnswer];
      this.mascot.setExpression(chosenOpt.expression || "warm_smile", chosenOpt.doggyReaction);
    } else {
      // Trigger question-specific expression & speech
      this.mascot.setExpression(q.questionExpression || "confused_tilt", q.questionDialogue);
    }

    // Handle Option Selection
    const optionBtns = quiz.querySelectorAll(".option-card-btn");
    const nextBtn = quiz.querySelector("#btnQuizNext");

    optionBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (this.isAnsweringLocked) return;

        const optIdx = parseInt(btn.getAttribute("data-opt-index"), 10);
        this.userAnswers[this.currentQuestionIdx] = optIdx;

        sound.playSelect();

        // Update UI selection
        optionBtns.forEach(b => {
          b.classList.remove("is-selected");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("is-selected");
        btn.setAttribute("aria-checked", "true");

        // Trigger Doggy's specific reaction to chosen option
        const chosen = q.options[optIdx];
        const optExpr = chosen.expression || (chosen.score <= 4 ? "shocked" : chosen.score >= 9 ? "confident" : "warm_smile");
        this.mascot.setExpression(optExpr, chosen.doggyReaction);

        // ── AUTO-TRANSITION LOGIC FOR QUESTION 24 ───────────────────────
        if (this.currentQuestionIdx === questions.length - 1) {
          // Lock options to prevent double-clicks
          this.isAnsweringLocked = true;
          optionBtns.forEach(b => {
            b.style.pointerEvents = "none";
          });
          nextBtn.setAttribute("disabled", "true");
          nextBtn.textContent = "Revealing Scoreboard... 🐶";

          // Calculate final score immediately
          this.lastResult = calculatePersonalityResult(this.userAnswers, questions);

          // Allow the player to see Doggy's reaction to Q24 for ~850ms, then transition automatically!
          setTimeout(() => {
            this.currentView = "results";
            this.renderView();
          }, 850);
          return;
        }

        // Questions 1 to 23: enable next button
        nextBtn.removeAttribute("disabled");
      });
    });

    // Handle Previous Button
    quiz.querySelector("#btnQuizBack").addEventListener("click", () => {
      if (this.isAnsweringLocked) return;
      if (this.currentQuestionIdx > 0) {
        sound.playPop();
        this.currentQuestionIdx--;
        this.renderView();
      }
    });

    // Handle Next Button (For Questions 1 to 23)
    nextBtn.addEventListener("click", () => {
      if (this.isAnsweringLocked) return;
      if (this.userAnswers[this.currentQuestionIdx] === null) return;

      sound.playPop();
      if (this.currentQuestionIdx < questions.length - 1) {
        this.currentQuestionIdx++;
        this.renderView();
      } else {
        // Fallback in case of manual click on Q24
        this.isAnsweringLocked = true;
        this.lastResult = calculatePersonalityResult(this.userAnswers, questions);
        this.currentView = "results";
        this.renderView();
      }
    });
  }

  // ── 3. SIGNATURE RESULTS & AUTOMATIC SCOREBOARD REVEAL ────────────────
  renderResults(container) {
    if (!this.lastResult) {
      this.lastResult = calculatePersonalityResult(this.userAnswers, questions);
    }

    const { scorePercent, personality, endingType } = this.lastResult;
    this.isScoreboardRevealed = false;

    const results = document.createElement("div");
    results.className = "results-view";

    results.innerHTML = `
      <!-- Head-to-Head Challenge Banner if active -->
      ${this.challengeContext ? `
        <div class="friend-challenge-alert" style="margin-bottom: 24px;">
          <div class="challenge-avatar-icon">${scorePercent >= this.challengeContext.targetScore ? '🏆' : '😅'}</div>
          <div class="challenge-alert-text">
            <h3>${scorePercent >= this.challengeContext.targetScore ? `You beat ${this.challengeContext.challenger}!` : `So close! ${this.challengeContext.challenger} holds the crown!`}</h3>
            <p>Your Score: <strong>${scorePercent}%</strong> vs ${this.challengeContext.challenger}'s Score: <strong>${this.challengeContext.targetScore}%</strong></p>
          </div>
        </div>
      ` : ""}

      <!-- The Unified Scoreboard & Mascot Theater Stage -->
      <div class="scoreboard-theater" id="scoreboardTheater">
        <!-- Ceiling Beam Structure -->
        <div class="theater-ceiling-truss">
          <div class="truss-beam">
            <span class="rivet"></span><span class="rivet"></span><span class="rivet"></span>
          </div>
        </div>

        <!-- The Stage Arena with Scoreboard & Doggy-Rope Station -->
        <div class="theater-arena" id="theaterArena">
          <!-- Left Column: Scoreboard Container -->
          <div class="scoreboard-zone" id="scoreboardStageContainer"></div>

          <!-- Right Column: Hanging Rope Pulley & Doggy Mascot Station -->
          <div class="doggy-rope-station" id="doggyRopeStation">
            <!-- Overhead Pulley & Cable connecting to Scoreboard -->
            <div class="overhead-pulley-rig" id="pulleyRig">
              <div class="pulley-wheel" id="pulleyWheel"></div>
              <div class="pulley-mount"></div>
              <div class="pulley-cable" id="pulleyCable"></div>

              <!-- The Hanging Pull Rope (Centered Directly Above Doggy!) -->
              <div class="hanging-rope" id="hangingRope">
                <div class="rope-line"></div>
                <div class="rope-knot"></div>
                <div class="rope-handle" id="ropeHandle" title="Pull Rope to Lower Scoreboard">
                  <span class="rope-tag">PULL</span>
                </div>
              </div>
            </div>

            <!-- Mascot Stage Container (Positioned directly under the rope handle!) -->
            <div class="mascot-stage-container" id="resultsMascotStage"></div>
          </div>
        </div>
      </div>

      <!-- Dynamic Ending Dialogue Banner -->
      <div id="endingDialogueBanner"></div>

      <!-- Viral Action Buttons (Revealed only after score is shown) -->
      <div class="results-actions-grid is-hidden" id="resultsActions">
        <a 
          href="https://yourstayo.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-action-primary" 
          id="btnFindHostel"
          aria-label="Find My Perfect Hostel on yourstayo.com (opens in new tab)"
        >
          <span>Find My Perfect Hostel 🏡</span>
        </a>

        <button class="btn-action-whatsapp" id="btnShareWhatsApp">
          <span>Share on WhatsApp 💬</span>
        </button>

        <button class="btn-action-secondary" id="btnCopyChallenge">
          <span>🔗 Copy Challenge Link</span>
        </button>

        <button class="btn-action-secondary" id="btnDownloadCard">
          <span>🖼️ Download Certificate</span>
        </button>

        <button class="btn-action-secondary" id="btnPlayAgain">
          <span>🔄 Play Again</span>
        </button>
      </div>
    `;

    container.appendChild(results);

    // 1. Initialize Scoreboard Component in scoreboard-zone
    const boardContainer = results.querySelector("#scoreboardStageContainer");
    this.scoreboard = new Scoreboard(boardContainer);
    this.scoreboard.render(this.lastResult);

    // 2. Initialize Doggy Mascot on Results Stage directly beneath the rope
    const mascotContainer = results.querySelector("#resultsMascotStage");
    this.mascot = new DoggyMascot(mascotContainer);

    // Cache Theater Rope and Pulley Elements
    this.ropeEl = results.querySelector("#hangingRope");
    this.pulleyWheelEl = results.querySelector("#pulleyWheel");
    this.pulleyCableEl = results.querySelector("#pulleyCable");

    // 3. AUTOMATIC SCOREBOARD REVEAL CHOREOGRAPHY (Starts automatically!)
    this.runScoreboardSequence(scorePercent, endingType, results);

    // Wire Action Buttons
    results.querySelector("#btnFindHostel").addEventListener("click", () => {
      sound.playPop();
    });

    results.querySelector("#btnShareWhatsApp").addEventListener("click", () => {
      sound.playPop();
      share.shareToWhatsApp(this.playerName, scorePercent, personality.title, this.lastResult.personalityKey);
    });

    results.querySelector("#btnCopyChallenge").addEventListener("click", () => {
      sound.playPop();
      const chalUrl = share.generateChallengeUrl(this.playerName, scorePercent, this.lastResult.personalityKey);
      share.copyLink(chalUrl, () => {
        this.showToast("Challenge link copied! Send it to your friends 🔗");
      });
    });

    results.querySelector("#btnDownloadCard").addEventListener("click", () => {
      sound.playPop();
      this.showToast("Generating official high-res scorecard... ⏳");
      share.generateResultImage(this.lastResult, this.playerName, (dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `STAYO-${this.lastResult.personalityKey}-Scorecard.png`;
        a.click();
        this.showToast("Scorecard downloaded successfully! 🖼️");
      });
    });

    results.querySelector("#btnPlayAgain").addEventListener("click", () => {
      sound.playPop();
      this.resetGame();
    });
  }

  // ── 4. CHOREOGRAPHED AUTOMATIC JUMP & ROPE PULL SEQUENCE ─────────────
  // Order of operations:
  // 1. Look up: Doggy notices the rope hanging above and looks up at it.
  // 2. Crouch: Doggy bends legs and lowers body, preparing to jump.
  // 3. Jump upward: Doggy visibly jumps high enough to reach the hanging rope.
  // 4. Grab the rope: While in air, Doggy raises both paws and grabs the rope.
  // 5. Pull the rope: Doggy pulls rope downward using paws and body weight.
  // 6. Lower the scoreboard: Scoreboard descends connected to pulling mechanism.
  // 7. Settle the board: Scoreboard stops with bounce and settles.
  // 8. Reveal the score: Only after board settles, show score and personality.
  // 9. React to the result: Doggy reacts to the revealed result.
  runScoreboardSequence(scorePercent, endingType, viewContainer) {
    if (this.isScoreboardRevealed) return;
    this.isScoreboardRevealed = true;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Accessible instant path
      this.mascot.setExpression("confident", "Official STAYO Results are ready! 🏆");
      this.scoreboard.dropBoard(() => {
        this.scoreboard.revealScore(scorePercent, () => {
          viewContainer.querySelector("#resultsActions").classList.remove("is-hidden");
          this.executeEndingSequence(endingType, viewContainer);
        });
      });
      return;
    }

    // Step 1: Look up (Doggy notices the rope hanging directly above him and looks up)
    this.mascot.setExpression("notice_rope", "Wait... what is that rope doing up there? 🤔🪢");

    // Step 2: Crouch (Doggy bends legs and lowers body, preparing to spring upward)
    setTimeout(() => {
      this.mascot.setExpression("crouch_jump", "Doggy is preparing to jump! 🐾");

      // Step 3: Jump upward (Doggy visibly jumps vertically upward by himself by 110px!)
      setTimeout(() => {
        this.mascot.setExpression("jump_up", "JUMPING! 🚀");

        // Step 4: Grab the rope (In mid-air at peak of jump, Doggy raises paws and grabs rope handle)
        setTimeout(() => {
          this.mascot.setExpression("grab_rope", "Got the rope! 🪢");

          // Step 5: Pull the rope (Doggy pulls downward using paws and body weight)
          setTimeout(() => {
            this.mascot.setExpression("pull_rope", "PULLING DOWN THE OFFICIAL SCOREBOARD! 💥");

            // Rope stretches and moves downward in lockstep with Doggy's pull
            if (this.ropeEl) this.ropeEl.classList.add("is-doggy-pulling");
            if (this.pulleyWheelEl) this.pulleyWheelEl.classList.add("is-spinning");
            if (this.pulleyCableEl) this.pulleyCableEl.classList.add("is-cable-pulling");

            // Step 6: Lower the scoreboard (Scoreboard plunges downward connected to the pull)
            setTimeout(() => {
              this.scoreboard.dropBoard(() => {
                // Step 7: Board finishes settling with physical bounce
                if (this.ropeEl) {
                  this.ropeEl.classList.remove("is-doggy-pulling");
                  this.ropeEl.classList.add("rope-released");
                }
                if (this.pulleyWheelEl) this.pulleyWheelEl.classList.remove("is-spinning");
                if (this.pulleyCableEl) this.pulleyCableEl.classList.remove("is-cable-pulling");

                // Doggy lands cleanly back on his feet beside the descended board
                this.mascot.setExpression("confident", "Scoreboard is here! Look! 📜✨");

                // Step 8: Reveal the score ONLY after the scoreboard has descended and settled!
                setTimeout(() => {
                  this.scoreboard.revealScore(scorePercent, () => {
                    // Reveal actions grid
                    const actionsGrid = viewContainer.querySelector("#resultsActions");
                    if (actionsGrid) actionsGrid.classList.remove("is-hidden");

                    // Step 9: React to the result (Doggy reacts to the score)
                    this.executeEndingSequence(endingType, viewContainer);
                  });
                }, 350);
              });
            }, 550);
          }, 450);
        }, 400);
      }, 550);
    }, 850);
  }

  // ── 5. SCORE-BASED ENDING REACTIONS ──────────────────────────────────
  executeEndingSequence(endingType, viewContainer) {
    const bannerContainer = viewContainer.querySelector("#endingDialogueBanner");
    const mascotContainer = viewContainer.querySelector("#resultsMascotStage");

    if (endingType === "low") {
      // ── LOW-SCORE ENDING: Doggy leaves with Roommate Rohit ──
      // Step A: Doggy freezes in utter disbelief staring at low score
      this.mascot.setExpression("low_score_freeze", "Wait... what?! Doggy is looking at this score in utter shock! 💀");

      setTimeout(() => {
        // Step B: Roommate enters the stage with hot Maggi
        const roommate = createRoommateElement();
        mascotContainer.parentElement.prepend(roommate);

        // Force reflow and slide roommate in
        void roommate.offsetWidth;
        roommate.classList.add("walked-in");

        this.mascot.say("Roommate Rohit just entered with hot Maggi and an AC room key...", "shocked");

        setTimeout(() => {
          // Step C: Doggy lowers ears, shakes head, and walks away with Rohit!
          this.mascot.setExpression("walk_away", "Bro... Doggy said 'I'm staying with Rohit tonight!' 😭");
          roommate.classList.add("walking-away-together");

          // Display signature comedic punchline
          bannerContainer.innerHTML = `
            <div class="low-score-dialogue-banner">
              <div class="dialogue-main">Bro... even Doggy found a better roommate. 💀</div>
              <div class="dialogue-sub">
                Doggy has officially transferred to Room 304 with Rohit. Your hostel survival score needs urgent emergency maintenance!
              </div>
            </div>
          `;
        }, 1900);
      }, 1500);

    } else if (endingType === "high") {
      // ── HIGH-SCORE ENDING: Doggy Celebrates + Confetti ──
      this.mascot.setExpression("celebrate", "LEGEND STATUS UNLOCKED! 🏆 Doggy has chosen YOU as the ultimate hostel legend!");
      this.mascot.celebrateConfetti();

      bannerContainer.innerHTML = `
        <div class="high-score-banner">
          <div class="celebrate-main">LEGEND STATUS UNLOCKED! 🏆</div>
          <div class="dialogue-sub">
            Roommate approved. Hostel certified. Your survival skills are officially elite tier!
          </div>
        </div>
      `;

    } else {
      // ── MEDIUM-SCORE ENDING: Neutral / Thoughtful Shrug ──
      this.mascot.setExpression("shrug", "Not bad, bro! Doggy is still deciding whether to trust you with the room key. 🔑");

      bannerContainer.innerHTML = `
        <div class="medium-score-banner">
          <div class="neutral-main">Solid Hostel Survivor! ⚖️</div>
          <div class="dialogue-sub">
            You've got what it takes to survive month-end and morning alarms, but there's room to become a true campus legend!
          </div>
        </div>
      `;
    }
  }
}

// Boot application upon DOM ready
window.addEventListener("DOMContentLoaded", () => {
  new StayoGameApp();
});
