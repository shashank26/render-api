const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;
const ws = require("express-ws")(app);

let streamResponse = null;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/start", (req, res) => {
  if(!streamResponse) return;
  streamResponse.write(`data: { "data": "start-recording" }\n\n`);
});

app.get("/stop", (req, res) => {
  if(!streamResponse) return;
  streamResponse.write(`data: { "data": "stop-recording" }\n\n`);
});

app.get("/record", (req, res) => {
  if (!streamResponse) return;
  streamResponse.write(`data: { "data": ${JSON.stringify(req.body)} }\n\n`);
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
