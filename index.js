const express = require("express");

const app = express();
const port = 3000;
const ws = require("express-ws")(app);

let streamResponse = null;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/start", (req, res) => {
  console.log("start");
});

app.get("/stop", (req, res) => {
  console.log("stop");
});

app.get("/record", (req, res) => {
  if (!streamResponse) return;
  streamResponse.write(`data: { "data": "hello" }\n\n`);
});

app.get("/stream", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });

  streamResponse = res;

  let counter = 0;
  const interval = setInterval(() => {
    const chunk = JSON.stringify({ chunk: counter++ });
    res.write(`data: ${chunk}\n\n`);
  }, 3000);

  res.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
