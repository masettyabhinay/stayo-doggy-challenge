import { spawn } from "child_process";

async function main() {
  const p = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9225",
    "--disable-gpu",
    "about:blank"
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch("http://127.0.0.1:9225/json/list");
  const pages = await res.json();
  const pageTarget = pages.find(p => p.type === "page") || pages[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = id++;
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === curId) {
        ws.removeEventListener("message", handler);
        if (d.error) reject(d.error);
        else resolve(d.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send("Page.enable");
  await send("Page.navigate", { url: "https://drive.google.com/drive/folders/1OwD-u7dZwGYmS7EwTFTLS-dki_lBknf3" });
  await new Promise(r => setTimeout(r, 4000));

  const pageInfo = await send("Runtime.evaluate", {
    expression: "({ title: document.title, url: window.location.href, body: document.body.innerText.slice(0, 300) })",
    returnByValue: true
  });

  console.log("Page info:", pageInfo.result.value);

  ws.close();
  p.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
