import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/Pc/.gemini/antigravity-ide/brain/22f4c729-b4bc-48a5-9a8b-1bd394b7bed2";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9224;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyHostelButton() {
  console.log("Launching headless Chrome for verification...");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1280,960",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "about:blank"
  ]);

  try {
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

    if (!versionData) {
      throw new Error("Failed to connect to Chrome debugging port");
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

    console.log("Navigating to http://localhost:3000/?view=results&ending=high ...");
    await sendCommand("Page.navigate", { url: "http://localhost:3000/?view=results&ending=high" });

    // Wait for the scoreboard animation and actions reveal (approx 4.5-5.5s)
    console.log("Waiting for scoreboard drop & button reveal...");
    await sleep(5500);

    // Evaluate button properties
    const evalRes = await sendCommand("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.getElementById("btnFindHostel");
        if (!btn) return { error: "Button #btnFindHostel not found in DOM" };

        const style = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        const modalBackdrop = document.querySelector(".stayo-modal-backdrop");
        const isModalActiveBefore = modalBackdrop ? modalBackdrop.classList.contains("is-active") : false;

        // Simulate click
        btn.click();

        const isModalActiveAfter = modalBackdrop ? modalBackdrop.classList.contains("is-active") : false;

        return {
          tagName: btn.tagName,
          href: btn.getAttribute("href"),
          target: btn.getAttribute("target"),
          rel: btn.getAttribute("rel"),
          text: btn.innerText.trim(),
          computedStyle: {
            display: style.display,
            alignItems: style.alignItems,
            justifyContent: style.justifyContent,
            color: style.color,
            background: style.background || style.backgroundColor,
            textDecorationLine: style.textDecorationLine,
            cursor: style.cursor,
            fontWeight: style.fontWeight,
            borderRadius: style.borderRadius
          },
          rect: {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
          },
          isModalActiveBefore,
          isModalActiveAfter,
          currentUrl: window.location.href
        };
      })()`,
      returnByValue: true
    });

    console.log("Verification results:", JSON.stringify(evalRes.result.value, null, 2));

    // Scroll down to the action buttons and take screenshot
    await sendCommand("Runtime.evaluate", {
      expression: `
        document.scrollingElement.scrollTop = 1000;
        window.scrollTo(0, 1000);
      `
    });
    await sleep(500);

    // Capture screenshot
    const screenshot = await sendCommand("Page.captureScreenshot", { format: "png" });
    const screenshotPath = path.join(ARTIFACT_DIR, "btn_find_hostel_verified.png");
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));
    console.log(`Saved screenshot to ${screenshotPath}`);

    // Mobile viewport test (375x812 - iPhone X/12/13/14)
    console.log("Testing mobile viewport 375x812...");
    await sendCommand("Emulation.setDeviceMetricsOverride", {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(500);

    await sendCommand("Runtime.evaluate", {
      expression: `document.getElementById("resultsActions").scrollIntoView({ behavior: "instant", block: "center" })`
    });
    await sleep(300);

    const mobileEval = await sendCommand("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.getElementById("btnFindHostel");
        const rect = btn.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          visible: rect.width > 0 && rect.height > 0
        };
      })()`,
      returnByValue: true
    });
    console.log("Mobile verification results:", JSON.stringify(mobileEval.result.value, null, 2));

    const mobileScreenshot = await sendCommand("Page.captureScreenshot", { format: "png" });
    const mobileScreenshotPath = path.join(ARTIFACT_DIR, "btn_find_hostel_mobile_verified.png");
    fs.writeFileSync(mobileScreenshotPath, Buffer.from(mobileScreenshot.data, "base64"));
    console.log(`Saved mobile screenshot to ${mobileScreenshotPath}`);

    ws.close();
    chromeProcess.kill();
  } catch (err) {
    chromeProcess.kill();
    throw err;
  }
}

verifyHostelButton().then(() => {
  console.log("Verification script completed successfully!");
  process.exit(0);
}).catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
