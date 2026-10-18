import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/Pc/.gemini/antigravity-ide/brain/6fa481e7-eaca-4c21-b3f2-5fd0d1f9b542";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEnding(endingType, filename) {
  console.log(`Starting test for ending: ${endingType}...`);
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1280,920",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "about:blank"
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        versionData = await res.json();
        break;
      }
    } catch (e) {}
    await sleep(200);
  }

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const pages = await listRes.json();
  const page = pages.find(p => p.type === "page") || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

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
  await sendCommand("Page.enable");
  await sendCommand("Runtime.enable");

  console.log(`Navigating to http://localhost:3000/?view=results&ending=${endingType} ...`);
  await sendCommand("Page.navigate", { url: `http://localhost:3000/?view=results&ending=${endingType}` });

  // Wait for full sequence to run:
  // sequence takes ~4.5s to drop board + reveal score + ending
  if (endingType === "low") {
    // Wait for Rohit to enter and walk away
    await sleep(6500);
    const res = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `${filename}_rohit_walk.png`), Buffer.from(res.data, "base64"));
    console.log(`Saved screenshot: ${filename}_rohit_walk.png`);
  } else {
    // High score celebration
    await sleep(6000);
    const res = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `${filename}_celebrate.png`), Buffer.from(res.data, "base64"));
    console.log(`Saved screenshot: ${filename}_celebrate.png`);
  }

  ws.close();
  chromeProcess.kill();
  await sleep(1000);
}

async function run() {
  await testEnding("high", "test_high_score");
  await testEnding("low", "test_low_score");
  console.log("Ending tests complete!");
  process.exit(0);
}

run().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
