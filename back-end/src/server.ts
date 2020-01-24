const fs = require("fs");
const http = require("http");
const https = require("https");

const db = require("./db");
import app from './app'

const httpServer = http.createServer(app);

httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

