// Create web server
const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const querystring = require("querystring");

// Create web server
const server = http.createServer((req, res) => {
  const method = req.method;
  const urlParsed = url.parse(req.url, true);
  let filePath = path.join(__dirname, urlParsed.pathname);

  if (method === "GET") {
    if (urlParsed.pathname === "/comments") {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
      });
    } else {
      filePath = path.join(__dirname, "public", "index.html");
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    }
  } else if (method === "POST") {
    if (urlParsed.pathname === "/comments") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const params = querystring.parse(body);
        const { comment } = params;
        fs.readFile(filePath, "utf-8", (err, data) => {
          let comments = JSON.parse(data);
          comments.push(comment);
          fs.writeFile(filePath, JSON.stringify(comments), (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Internal Server Error");
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(comments));
            }
          });
        });
      });
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});