const fs = require("fs");
const http = require("http");
const https = require("https");

require("dotenv").config();

const db = require("./db");
import app from './app'
import config from './config';

const httpServer = http.createServer(app);

httpServer.listen(config.port, () => {
  console.log(`HTTP Server running on port ${config.port}`);
});