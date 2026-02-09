/**
 * Minimal static file server for Playwright tests.
 * Serves the project root on port 4173.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4173;
const ROOT = path.resolve(__dirname, "..");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};

http
  .createServer((req, res) => {
    const urlPath = req.url.split("?")[0].split("#")[0];
    const filePath = path.join(ROOT, urlPath === "/" ? "/index.html" : urlPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Serve custom 404.html if available (matches GitHub Pages behavior)
        const notFoundPage = path.join(ROOT, "404.html");
        fs.readFile(notFoundPage, (err404, html) => {
          if (err404) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found");
          } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(html);
          }
        });
        return;
      }
      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Listening on http://127.0.0.1:${PORT}`);
  });
