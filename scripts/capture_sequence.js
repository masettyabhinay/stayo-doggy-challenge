import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/Pc/.gemini/antigravity-ide/brain/6fa481e7-eaca-4c21-b3f2-5fd0d1f9b542";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("Starting Chrome headless...");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1280,920",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "about:blank"
  ]);

  chromeProcess.on("error", (err) => console.error("Chrome process error:", err));

  // Wait for remote debugging to be active
  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        versionData = await res.json();
        break;
      }
    } catch (e) {
      // wait
    }
    await sleep(200);
  }

  if (!versionData) {
    console.error("Failed to connect to Chrome remote debugging port.");
    chromeProcess.kill();
    process.exit(1);
  }

  console.log("Chrome remote debugging connected:", versionData.Browser);

  // Get pages list
  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const pages = await listRes.json();
  const page = pages.find(p => p.type === "page") || pages[0];
  const wsUrl = page.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let nextId = 1;
  const pending = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);
  console.log("CDP WebSocket opened.");

  await sendCommand("Page.enable");
  await sendCommand("Runtime.enable");

  async function takeScreenshot(name) {
    const res = await sendCommand("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(res.data, "base64");
    const filePath = path.join(ARTIFACT_DIR, name);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved screenshot: ${name}`);
    return filePath;
  }

  console.log("Navigating to Question 24 on http://localhost:3000/?q=23 ...");
  await sendCommand("Page.navigate", { url: "http://localhost:3000/?q=23" });

  await sleep(1500);
  await takeScreenshot("step0_question24.png");

  console.log("Selecting option on Question 24 to trigger transition...");
  // Click option B (index 1) or option A
  await sendCommand("Runtime.evaluate", {
    expression: `
      const btn = document.querySelectorAll(".option-card-btn")[1];
      if (btn) btn.click();
    `
  });

  // Reaction to Q24
  await sleep(400);
  await takeScreenshot("step1_q24_selected.png");

  async function getMetrics(label) {
    const res = await sendCommand("Runtime.evaluate", {
      expression: `(() => {
        const handle = document.querySelector("#ropeHandle")?.getBoundingClientRect();
        const doggy = document.querySelector("#doggyBox")?.getBoundingClientRect();
        const svg = document.querySelector("#doggySvg")?.getBoundingClientRect();
        const reaching = document.querySelector("#doggyReachingArms")?.getBoundingClientRect();
        return {
          handle: handle ? { top: Math.round(handle.top), bottom: Math.round(handle.bottom), cy: Math.round((handle.top + handle.bottom)/2), cx: Math.round((handle.left + handle.right)/2) } : null,
          doggy: doggy ? { top: Math.round(doggy.top), bottom: Math.round(doggy.bottom) } : null,
          reaching: reaching ? { top: Math.round(reaching.top), bottom: Math.round(reaching.bottom), cx: Math.round((reaching.left + reaching.right)/2) } : null
        };
      })()`,
      returnByValue: true
    });
    console.log(`[Metrics @ ${label}]`, JSON.stringify(res.result.value));
    return res.result.value;
  }

  // At 850ms, the transition to results begins
  // Run sequence:
  // Step 1: notice_rope (starts at 0ms of results view)
  await sleep(800);
  await getMetrics("notice_rope");
  await takeScreenshot("step2_notice_rope.png");

  // Step 2: crouch_jump (starts at 850ms of results view -> ~1700ms total)
  await sleep(650);
  await getMetrics("crouch_jump");
  await takeScreenshot("step3_crouch_jump.png");

  // Step 3: jump_up (starts at +550ms -> ~2250ms total)
  await sleep(550);
  await getMetrics("jump_up");
  await takeScreenshot("step4_jump_up.png");

  // Step 4: grab_rope (starts at +400ms -> ~2650ms total)
  await sleep(400);
  await getMetrics("grab_rope");
  await takeScreenshot("step5_grab_rope.png");

  // Step 5: pull_rope (starts at +450ms -> ~3100ms total)
  await sleep(450);
  await getMetrics("pull_rope");
  await takeScreenshot("step6_pull_rope.png");

  // Step 6: scoreboard_drop (starts at +550ms -> ~3650ms total)
  await sleep(600);
  await getMetrics("scoreboard_drop");
  await takeScreenshot("step7_scoreboard_drop.png");

  // Step 7 & 8: board settles and score counts up (after drop finishes 950ms + 350ms delay)
  await sleep(1000);
  await takeScreenshot("step8_score_reveal.png");

  // Step 9: final result reaction (after counter finishes 1200ms)
  await sleep(1500);
  await takeScreenshot("step9_ending_reaction.png");

  console.log("All screenshots captured successfully!");
  ws.close();
  chromeProcess.kill();
  process.exit(0);
}

main().catch(err => {
  console.error("Error in capture script:", err);
  process.exit(1);
});
