const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const port = '2000';
const address = '127.0.0.1';
const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const publicKey = fs.readFileSync('ecdsa256_public.key', 'utf8');

// First middleware to print all incoming requests
app.use((req, res, next) => {
    console.log(`Visited url -> ${req.method}`, req.url);
    next();
});

/**
 * login
 */
app.post('/soyelfrontend', async (req, res) => {
    let decoded;
    try {
        decoded = jwt.verify(req.body.token, publicKey);
    } catch (err) {
        return res.status(400).json({
            message: err.name,
            description: err.message,
        });
    }
    return res.json({
        message: 'success soyelfrontend',
        decoded,
    });
});

server.listen(port, address, () => {
    console.log('server started listening at ', port);
});  