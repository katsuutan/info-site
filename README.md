# Basic Informational Site

A small multi-page website built for [The Odin Project's NodeJS course](https://www.theodinproject.com/lessons/nodejs-basic-informational-site). I first built it with a plain Node.js `http` server, then rewrote it with Express. The original version is still in the commit history.

## Requirements

A recent version of Node.js. The project uses `node --env-file` and `import.meta.dirname`.

## Running it

Install dependencies:

```
npm install
```

Create a `.env` file in the project root (see `.env.sample`):

```
PORT=8080
```

Then start the server:

```
node --env-file=.env index.js
```

Open http://localhost:8080 (or whatever port you set). If `PORT` isn't set, the server falls back to port 3000. For auto-restart while editing, use `node --watch --env-file=.env index.js`.

## Environment variables

| Name | Purpose |
| --- | --- |
| `PORT` | The port the server listens on (defaults to 3000) |

`.env` is gitignored. Copy `.env.sample` to `.env` and fill it in.

## Routes

| URL | Page |
| --- | --- |
| `/` | `index.html` |
| `/index` | `index.html` |
| `/about` | `about.html` |
| `/contact-me` | `contact-me.html` |
| anything else | `404.html` (with a real 404 status) |

Query strings are ignored, so `/about?x=1` still serves the about page. Express also matches `/About` and `/about/` to the about page.

## How I approached it

I built the first version in small stages and tested each one before moving on:

1. A server that responds with plain text
2. Logging `req.url` to see what the browser actually sends
3. Serving one HTML file with `fs.readFile`
4. Routing to all four pages, plus a 404
5. Trying to break it with odd URLs and checking the Network tab

Then I rewrote it with Express on a separate branch, so the working version stayed safe. I ported one route at a time and retested the same edge cases to see what changed.

## What I learned

### Plain Node version

- **`res.end()` is required.** With only `writeHead`, the browser waits forever.
- **Errors need handling.** A misspelled filename crashed the whole server (the browser showed "refused to connect"). Wrapping the file read in `try/catch` fixed that, and every path, including the `catch`, must end the response.
- **Read the file before `writeHead`.** Once a status is sent, it can't be taken back, so I confirm the read worked first.
- **Paths:** a leading `/` means the filesystem root. I used a `./` relative path instead.
- **`url.pathname` over `req.url`:** `req.url` includes the query string, which broke matching on `/about?x=1`.
- **Allow-list routing:** I only serve filenames from a fixed list instead of building them from user input, so visitors can't choose which file the server opens.
- **404 vs 500:** an unknown page is the visitor's problem (404). A failed file read is the server's problem (500).
- **Environment variables:** settings that change per environment live in a gitignored `.env` file and are read with `process.env`, so the code stays the same everywhere. Values are always strings.

### Express version

- **A framework replaces the hand-written plumbing.** Routing, the request/response objects, and default error handling now come from Express, and each page is one `app.get` call.
- **Route order matters.** Express checks routes top to bottom and the first match wins, so the 404 handler goes last.
- **Middleware is a function the request passes through.** My 404 is a middleware registered with `app.use` and no path, so it catches whatever nothing above it matched.
- **Parameter count matters.** A function with four parameters `(err, req, res, next)` is treated as an error handler, not a normal middleware. My first 404 attempt used four parameters and never ran, so Express sent its own default 404 page instead.
- **`res.sendFile` needs an absolute path or a `root` option.** A relative path throws. In ES modules, `__dirname` doesn't exist, so I used `import.meta.dirname` as the root.
- **A URL is not a file path.** `localhost:3000` is where the server lives on the network; `root` needs a folder on disk.
- **Content-Type and status codes are handled for me.** `sendFile` infers the type from the file extension and Express sends 200 by default; I set 404 explicitly on the catch-all.
- **Test with `curl` as well as the browser.** The browser rewrites some URLs before sending them, so the Network tab (or `curl -i`) shows what was really requested.

## Known limitations

- Every page is its own `app.get` call. With more pages this could be a loop or a lookup.
- There's no custom 500 page. Unexpected errors fall through to Express's default error handler.
- `/index` duplicates `/`. It's kept to match the original version.