import express from "express";
import { createServer } from "http";
import cors from "cors";
const app = express();
const httpServer = createServer(app);

var whitelist = ["http://example1.com", "http://example2.com"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    data: "default",
  });
});

app.post("/test", (req, res) => {
  console.log(JSON.parse(req.body));
  res.json({
    data: "ok",
  });
});

app.get(
  "/hello-world",
  cors({
    ...corsOptions,
    methods: "GET",
    credentials: true,
  }),
  (req, res) => {
    console.log(req.cookies['auth_token']);
    res.json({
      data: "Hello World",
    });
  }
);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
