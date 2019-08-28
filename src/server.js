const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const asyncRedis = require('async-redis');
const fs = require('fs');

const port = '1999';
const address = '127.0.0.1';
const app = express();
const server = http.createServer(app);
const redisClient = asyncRedis.createClient();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const privateKey = fs.readFileSync('ecdsa256_private.key', 'utf8');
const publicKey = fs.readFileSync('ecdsa256_public.key', 'utf8');

// First middleware to print all incoming requests
app.use((req, res, next) => {
    console.log(`Visited url -> ${req.method}`, req.url);
    next();
});

/**
 * signup
 */
app.post('/signup', async (req, res) => {    
    return res.json({
        message: 'success signup'
    });
});

/**
 * login
 */
app.post('/login', async (req, res) => {
    const token = jwt.sign(
        {
            nombre: req.body.username,
            puesto: 'instructor',
            pais: 'México',
        },
        privateKey,
        {
            expiresIn: '1h',
            algorithm: 'ES256'
        },
    );
    await redisClient.set(req.body.username, token);
    await redisClient.set(token, "white");
    return res.json({
        message: 'success login',
        token,
    });
});

/**
 * logout
 */
app.post('/logout', async (req, res) => {
    let decoded;
    try {
        decoded = jwt.verify(req.body.token, publicKey);
    } catch (err) {
        return res.status(400).json({
            message: err.name,
            description: err.message,
        });
    }
    const token = await redisClient.get(decoded.nombre);
    await redisClient.set(token, "black");
    return res.json({
        message: 'success logout'
    });
});

/**
 * info
 */
app.get('/info', async (req, res) => {
    return res.json({
        message: 'success info'
    });
});

server.listen(port, address, () => {
    console.log('server started listening at ', port);
});  