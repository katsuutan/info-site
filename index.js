import * as http from 'node:http';
import fs from 'node:fs/promises';

http.createServer(async (req, res) => {
    let data;
    const pageAccess = ['/index', '/about', '/contact-me'];

    try {
        const url = new URL(req.url, 'http://localhost:8080');

        if (url.pathname === '/') {
            data = await fs.readFile('index.html', { encoding: 'utf8'} );
            res.writeHead(200, { 'Content-Type': 'text/html'} );
        }
        else if (pageAccess.includes(url.pathname)) {
            data = await fs.readFile(`.${url.pathname}.html`, { encoding: 'utf8' });
            res.writeHead(200, { 'Content-Type': 'text/html'} );
        }
        else {
            data = await fs.readFile('404.html', { encoding: 'utf8' });
            res.writeHead(404, { 'Content-Type': 'text/html'} );
        }
        res.end(data);

    } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('Error 500');
        console.log(err);
    }
}).listen(process.env.PORT);