import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const sendFileOptions = {
    root: import.meta.dirname,
};

app.get('/', (req, res) => {
    res.sendFile('index.html', sendFileOptions);
});

app.get('/index', (req, res) => {
    res.sendFile('index.html', sendFileOptions);
});

app.get('/about', (req, res) => {
    res.sendFile('about.html', sendFileOptions);
});

app.get('/contact-me', (req, res) => {
    res.sendFile('contact-me.html', sendFileOptions);
});

app.use((req, res) => {
    res.status(404).sendFile('404.html', sendFileOptions);
});

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Listening on port ${PORT}!`);
});