import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const sendFileOptions = {
    root: import.meta.dirname,
};

app.get('/', (req, res) => {
    res.sendFile('index.html', sendFileOptions);
});

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Listening on port ${PORT}!`);
});