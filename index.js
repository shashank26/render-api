const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;
const ws = require("express-ws")(app);

let streamResponse = null;
let recordStream = null;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/start", (req, res) => {
  if(!streamResponse) return;
  const data = JSON.stringify({ data: 'start-recording' });
  streamResponse.write(`data: ${data}\n\n`);
  res.json({
    ok: true
  });
});

app.get("/stop", (req, res) => {
  if(!streamResponse) return;
  const data = JSON.stringify({ data: 'stop-recording' });
  streamResponse.write(`data: ${data}\n\n`);
  res.json({
    ok: true
  });
});

app.post("/record", (req, res) => {
  if (!recordStream) return;
  const data = { data: req.body }; 
  recordStream.write(`data: ${JSON.stringify(data)}\n\n`);
  res.json({
    ok: true
  });
});

app.get('/record-event', (req, res) => {

  res.writeHead(200, {
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });

  recordStream = res;

  let counter = 0;
  const interval = setInterval(() => {
    const chunk = JSON.stringify({ recordchunk: counter++ });
    res.write(`data: ${chunk}\n\n`);
  }, 3000);

  res.on("close", () => {
    clearInterval(interval);
    res.end();
  });

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
