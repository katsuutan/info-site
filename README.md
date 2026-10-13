# Basic Informational Site

A small website served by a plain Node.js `http` server, with no frameworks. Built for [The Odin Project's NodeJS course](https://www.theodinproject.com/lessons/nodejs-basic-informational-site).

## Running it

```
node index.js
```

Then open http://localhost:8080. For auto-restart while editing, use `node --watch index.js`.

## Routes

| URL | Page |
| --- | --- |
| `/` | `index.html` |
| `/index` | `index.html` |
| `/about` | `about.html` |
| `/contact-me` | `contact-me.html` |
| anything else | `404.html` (with a real 404 status) |

Query strings are ignored, so `/about?x=1` still serves the about page.

## How I approached it

I built it in small stages and tested each one before moving on:

1. A server that responds with plain text
2. Logging `req.url` to see what the browser actually sends
3. Serving one HTML file with `fs.readFile`
4. Routing to all four pages, plus a 404
5. Trying to break it with odd URLs and checking the Network tab

## What I learned

- **`res.end()` is required.** With only `writeHead`, the browser waits forever.
- **Errors need handling.** A misspelled filename crashed the whole server (the browser showed "refused to connect"). Wrapping the file read in `try/catch` fixed that, and every path, including the `catch`, must end the response.
- **Read the file before `writeHead`.** Once a status is sent, it can't be taken back, so I confirm the read worked first.
- **Paths:** a leading `/` means the filesystem root. I used a `./` relative path instead.
- **`url.pathname` over `req.url`:** `req.url` includes the query string, which broke matching on `/about?x=1`.
- **Allow-list routing:** I only serve filenames from a fixed list instead of building them from user input, so visitors can't choose which file the server opens.
- **404 vs 500:** an unknown page is the visitor's problem (404). A failed file read is the server's problem (500).

## Known limitations

- A URL starting with `//` (like `localhost:8080//`) is parsed as a hostname, so `new URL` throws and the visitor gets a 500. A 400 would be more accurate. `//about` serves the index page for the same reason.
- The port (`8080`) is hardcoded. Environment variables are the next lesson.