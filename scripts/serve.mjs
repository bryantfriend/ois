import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
const root = resolve("dist");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const path = resolve(root, "." + decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname));
    if (!path.startsWith(root + sep)) { response.writeHead(403); response.end("Forbidden"); return; }
    const body = await readFile(path);
    response.writeHead(200, { "Content-Type": (types[extname(path)] || "application/octet-stream") + "; charset=utf-8", "Cache-Control": "no-store" });
    response.end(body);
  } catch { response.writeHead(404); response.end("Not found"); }
});
server.listen(4173, "127.0.0.1", () => console.log("Oxford: http://127.0.0.1:4173"));
